const router = require('express').Router();

const { getHeroesPage,
        insertNewHero,
        deleteHeroByID,
        getHeroByID,
        getHeroDetailByID,
        updateHeroByID
} = require('../models/heroes');

const {generateAuthToken, requireAuthentication} = require('../lib/auth');

exports.router = router;

router.get('/', async (req, res) =>{
  try {
    const heroPage = await getHeroesPage(
      parseInt(req.query.page) || 1
    );
    //console.log("heroPage: ", heroPage);
    res.status(200).send(heroPage);
  } catch (err) {
    //console.error(" -- error:", err);
    res.status(500).send({
      error: "Error fetching hero page."
    });
  }

});

/*
 * Route to create a new hero.
 */
router.post('/', async (req, res, next) => {
    try{
      const id = await insertNewHero(req.body)
      res.status(201).json({
        id: id,
        links: {
          hero: `/heroes/${id}`
        }
      });
    }catch(err) {
      res.status(500).send({
        error: "Error inserting heroes"
      });
    }
});

/*
 * Route to fetch info about a specific hero.
 */
router.get('/:id', requireAuthentication, async (req, res, next) => {
  const heroid = req.params.id;
  //console.error(" -- heroid:", heroid);
  try {
    const hero = await getHeroDetailByID(heroid)
    console.log("== image:", hero.image);
    if (hero) {
      const result = {
        _id: hero._id,
        name: hero.name,
        role: hero.role,
        description: hero.description,
        skill: hero.skill,
        review: hero.review,
        image: [{
          url: `/images/${hero.image.metadata.filename}`,
          contentType: hero.image.metadata.contentType
        }]
        // url: `images/${hero.filename}`,
        // contentType: hero.metadata.contentType,
        // heroid: hero.metadata.heroid,
        // urls: hero.urls
      };
      res.status(200).send(result);
    } else {
      next();
    }
  } catch (err) {
    //console.log(" -- err:", err);
    res.status(500).send({
      error: "Unable to find Hero."
    });
  }
});

/*
 * Route to replace data for a hero.
 */
router.put('/:id', async (req, res, next) => {
  const heroid = req.params.id;
    try {
      const updateSuccessful = await
        updateHeroByID(heroid, req.body);
      if (updateSuccessful) {
        res.status(200).send({
          _id: heroid,
          body: req.body
        });
      } else {
        next();
      }
    } catch (err) {
      res.status(500).send({
        error: "Unable to update hero."
      });
    }
});

/*
 * Route to delete a hero.
 */
router.delete('/:id', async (req, res, next) => {
  const heroid = req.params.id;
  try {
    const deleteSuccessful = await deleteHeroByID(heroid)
    if (deleteSuccessful) {
       res.status(204).end();
    } else {
      next();
    }
  } catch (err) {
    res.status(500).send({
      error: "Unable to delete hero."
    });
  }
});
