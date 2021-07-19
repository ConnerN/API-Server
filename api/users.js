const router = require('express').Router();

const { getUserPage,
        insertNewUser,
        deleteUserByID,
        getUserByID,
        getUserDetailByID,
        updateUserByID,
        validateUser
} = require('../models/users');
const {generateAuthToken, requireAuthentication} = require('../lib/auth');

exports.router = router;

router.get('/', async (req, res) =>{
  try {
    const userPage = await getUserPage(
      parseInt(req.query.page) || 1
    );
    //console.log("userPage: ", userPage);
    res.status(200).send(userPage);
  } catch (err) {
    //console.error(" -- error:", err);
    res.status(500).send({
      error: "Error fetching user page."
    });
  }

});

/*
 * Route to create a new user.
 */
router.post('/', async (req, res, next) => {
    try{
      const id = await insertNewUser(req.body)
      res.status(201).json({
        id: id,
        links: {
          users: `/users/${id}`
        }
      });
    }catch(err) {
      res.status(500).send({
        error: "Error inserting user"
      });
    }
});

/*
 * Route to fetch info about a specific user.
 */
router.get('/:id', requireAuthentication, async (req, res, next) => {
  if(req.user !== req.params.id){
    res.status(403).send({
      error: "Unauthorized to access"
    });
  }
  else{
    const userid = req.params.id;
    //console.error(" -- userid:", userid);
    try {
      const user = await getUserDetailByID(userid)
      if (user) {
        res.status(200).send(user);
      } else {
        next();
      }
    } catch (err) {
      //console.log(" -- err:", err);
      res.status(500).send({
        error: "Unable to find user."
      });
    }
  }
});

/*
 * Route to replace data for a user.
 */
router.put('/:id', async (req, res, next) => {
  const userid = req.params.id;
    try {
      const updateSuccessful = await
        updateUserByID(userid, req.body);
      if (updateSuccessful) {
        res.status(200).send({
          _id: userid,
          body: req.body
        });
      } else {
        next();
      }
    } catch (err) {
      res.status(500).send({
        error: "Unable to update user."
      });
    }
});

/*
 * Route to delete a user.
 */
router.delete('/:id', async (req, res, next) => {
  const userid = req.params.id;
  try {
    const deleteSuccessful = await deleteUserByID(userid)
    if (deleteSuccessful) {
       res.status(204).end();
    } else {
      next();
    }
  } catch (err) {
    res.status(500).send({
      error: "Unable to delete user."
    });
  }
});

router.post('/login', async (req, res) => {
  console.log(" -- req:", req.body);
  if(req.body && req.body.id && req.body.password){
    try{
      const authenticated = await validateUser(req.body.id, req.body.password);
      if(authenticated){
        res.status(200).send({
          token: generateAuthToken(req.body.id)
        });
      }
      else{
        res.status(401).send({
          error: " Invalid authentication credentials."
        });
      }
    } catch (err) {
      console.error(" -- error:", err);
      res.status(500).send({
        error: "Error logging in."
      });
    }
  }
  else{
    res.status(400).send({
      error: "Request body need id and password."
    })
  }
});
