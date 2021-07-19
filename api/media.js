const router = require('express').Router();
const express = require('express');
const multer = require('multer');
const crypto = require('crypto');

const {
    getImageDownloadStreamByFilename,
    getImageInfoById
  } = require('../models/images');


// router.get('/images/:filename-:size.jpg', async (req, res, next) => {
//   var filenameParam = req.params.filename;
//   var size = req.params.size;
//   console.log("req.params", req.params);
//   try{
//     const image = await getImageNameByIdAndSize(filenameParam, size);
//     console.log("==image: ", image);
//     getImageDownloadStreamByFilename(image)
//       .on('file', (file) => {
//         res.status(200).type(file.metadata.contentType);
//       })
//       .on('error', (err) => {
//         if (err.code === 'ENOENT') {
//           next();
//         } else {
//           next(err);
//         }
//       })
//       .pipe(res);
//   }catch (err){
//     console.error(err);
//     res.status(500).send({
//       error: "Unable to fetch photo.  Please try again later."
//     });
//   }

  
// });
module.exports = router;

router.get('/media/images/:filename', (req, res, next) => {
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
