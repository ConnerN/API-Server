const router = require('express').Router();
const multer = require('multer');
const crypto = require('crypto');
const { validateAgainstSchema } = require('../lib/validation');
const { PhotoSchema,
        getImagePage,
        insertNewImage,
        deleteImageByID,
        getImageByID,
        updateImageByID,
        saveImageInfo,
        saveImageFile,
        getImageInfoById,
        getImageDownloadStreamByFilename,
        getChannel
} = require('../models/images');
const {generateAuthToken, requireAuthentication} = require('../lib/auth');

const imageTypes = {
  'image/jpeg': 'jpg',
  'image/png': 'png',
  'image/gif': 'gif'
};

const upload = multer({
  storage: multer.diskStorage({
    destination: `${__dirname}/uploads`,
    filename: (req, file, callback) => {
      
      const filename = crypto.pseudoRandomBytes(16).toString('hex');
      const extension = imageTypes[file.mimetype];
      callback(null, `${filename}.${extension}`);
    }
  }),
  fileFilter: (req, file, callback) => {
    callback(null, !!imageTypes[file.mimetype]);
  }
});

exports.router = router;

// router.get('/', async (req, res) =>{
//   try {
//     const imagePage = await getImagePage(
//       parseInt(req.query.page) || 1
//     );
//     //console.log("imagePage: ", imagePage);
//     res.status(200).send(imagePage);
//   } catch (err) {
//     //console.error(" -- error:", err);
//     res.status(500).send({
//       error: "Error fetching image page."
//     });
//   }

// });

/*
 * Route to create a new image.
 */
router.post('/', requireAuthentication, upload.single('image'), async (req, res) => {
  if(req.user !== req.body.userid){
    //  console.log("req.user",req.user);
    //  console.log("req.body",req.body);
    res.status(403).send({
      error: "Unauthorized to access"
    });
  }
 else{
    if (validateAgainstSchema(req.body, PhotoSchema) && req.file) {
      const image = {
        contentType: req.file.mimetype,
        filename: req.file.filename,
        path: req.file.path,
        heroid: req.body.heroid,
        caption: req.body.caption,
        userid: req.body.userid
      }
      //console.log("image",image);
      try {
        console.log("image",image);
        const id = await saveImageFile(image);
        // const channel = getChannel();
        // //console.log("id",id);
        // channel.sendToQueue('images', Buffer.from(id.toString()));
        res.status(201).send({
          id: id,
          links: {
            photo: `/images/${id}`,
            filename: image.filename,
            hero: `/heroes/${req.body.heroid}`
          }
        });
      } catch (err) {
        console.error(err);
        res.status(500).send({
          error: "Error inserting photo into DB.  Please try again later."
        });
      }
    } else {
      res.status(400).send({
        error: "Request body needs 'image' file, heroid and userid"
      });
    }
  }
});

// router.post('/', requireAuthentication, upload.single('image'), async (req, res, next) => {
//   if(req.user !== req.body.userid){
//     // console.log("req.user",req.user);
//     // console.log("req.body",req.body);
//     res.status(403).send({
//       error: "Unauthorized to access"
//     });
//   }
//   else{
//     try{
//       const id = await insertNewImage(req.body)
//       res.status(201).json({
//         id: id,
//         links: {
//           images: `/images/${id}`
//         }
//       });
//     }catch(err) {
//       res.status(500).send({
//         error: "Error inserting images"
//       });
//     }
//   }
// });

/*
 * Route to fetch info about a specific image.
 */
router.get('/:id', async (req, res, next) => {
  try {
    const photo = await getImageInfoById(req.params.id);
    console.log("== PHOTO:", photo);
    if (photo) {
      const responseBody = {
        _id: photo._id,
        url: `/images/${photo.filename}`,
        contentType: photo.metadata.contentType,
        heroid: photo.metadata.heroid,
        urls: photo.urls
      };
      res.status(200).send(responseBody);
    } else {
      next();
    }
  } catch (err) {
    console.error(err);
    res.status(500).send({
      error: "Unable to fetch photo.  Please try again later."
    });
  }
});


// router.get('/:id', async (req, res, next) => {
//   const imageid = req.params.id;
//   //console.error(" -- imageid:", imageid);
//   try {
//     const image = await getImageByID(imageid)
//     if (image) {
//       res.status(200).send(image);
//     } else {
//       next();
//     }
//   } catch (err) {
//     //console.log(" -- err:", err);
//     res.status(500).send({
//       error: "Unable to find image."
//     });
//   }
// });

/*
 * Route to replace data for a image.
 */
// router.put('/:id', async (req, res, next) => {
//   if(req.user !== req.body.userid){
//     // console.log("req.user",req.user);
//     // console.log("req.body",req.body);
//     res.status(403).send({
//       error: "Unauthorized to access"
//     });
//   }
//   else{
//     const imageid = req.params.id;
//       try {
//         const updateSuccessful = await
//           updateImageByID(imageid, req.body);
//         if (updateSuccessful) {
//           res.status(200).send({
//             _id: imageid,
//             body: req.body
//           });
//         } else {
//           next();
//         }
//       } catch (err) {
//         res.status(500).send({
//           error: "Unable to update image."
//         });
//       }
//   }
// });

/*
 * Route to delete a image.
 */
// router.delete('/:id', async (req, res, next) => {
//   const imageid = req.params.id;
//   try {
//     const deleteSuccessful = await deleteImageByID(imageid)
//     if (deleteSuccessful) {
//        res.status(204).end();
//     } else {
//       next();
//     }
//   } catch (err) {
//     res.status(500).send({
//       error: "Unable to delete image."
//     });
//   }
// });

router.get('/:filename', (req, res, next) => {
  getImageDownloadStreamByFilename(req.params.filename)
    .on('file', (file) => {
      res.status(200).type(file.metadata.contentType);
    })
    .on('error', (err) => {
      if (err.code === 'ENOENT') {
        next();
      } else {
        next(err);
      }
    })
    .pipe(res);
});
