const router = require('express').Router();

const { getReivewsPage,
        insertNewReview,
        deleteUserByID,
        getReviewByID,
        updatereviewByID
} = require('../models/reviews');
const {generateAuthToken, requireAuthentication} = require('../lib/auth');

exports.router = router;

router.get('/', async (req, res) =>{
  try {
    const reviewPage = await getReivewsPage(
      parseInt(req.query.page) || 1
    );
    //console.log("reviewPage: ", reviewPage);
    res.status(200).send(reviewPage);
  } catch (err) {
    //console.error(" -- error:", err);
    res.status(500).send({
      error: "Error fetching review page."
    });
  }

});

/*
 * Route to create a new review.
 */
router.post('/', requireAuthentication, async (req, res, next) => {
  if(req.user !== req.body.userid){
    // console.log("req.user",req.user);
    // console.log("req.body",req.body);
    res.status(403).send({
      error: "Unauthorized to access"
    });
  }
  else{
    try{
      const id = await insertNewReview(req.body)
      res.status(201).json({
        id: id,
        links: {
          review: `/review/${id}`
        }
      });
    }catch(err) {
      res.status(500).send({
        error: "Error inserting review"
      });
    }
  }
});

/*
 * Route to fetch info about a specific review.
 */
router.get('/:id', async (req, res, next) => {
  const reviewid = req.params.id;
  //console.error(" -- reviewid:", reviewid);
  try {
    const review = await getReviewByID(reviewid)
    if (review) {
      res.status(200).send(review);
    } else {
      next();
    }
  } catch (err) {
    //console.log(" -- err:", err);
    res.status(500).send({
      error: "Unable to find review."
    });
  }
});

/*
 * Route to replace data for a review.
 */
router.put('/:id', requireAuthentication, async (req, res, next) => {
  if(req.user !== req.body.userid){
    // console.log("req.user",req.user);
    // console.log("req.body",req.body);
    res.status(403).send({
      error: "Unauthorized to access"
    });
  }
  else{
    const reviewid = req.params.id;
      try {
        const updateSuccessful = await
          updatereviewByID(reviewid, req.body);
        if (updateSuccessful) {
          res.status(200).send({
            _id: reviewid,
            body: req.body
          });
        } else {
          next();
        }
      } catch (err) {
        res.status(500).send({
          error: "Unable to update review."
        });
      }
  }
});

/*
 * Route to delete a review.
 */
router.delete('/:id', async (req, res, next) => {
  const reviewid = req.params.id;
  try {
    const deleteSuccessful = await deleteUserByID(reviewid)
    if (deleteSuccessful) {
       res.status(204).end();
    } else {
      next();
    }
  } catch (err) {
    res.status(500).send({
      error: "Unable to delete review."
    });
  }
});
