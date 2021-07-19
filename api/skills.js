const router = require('express').Router();

const { getSkillPage,
        insertNewSkills,
        deleteSkillsByID,
        getSkillByID,
        updateSkillByID
} = require('../models/skills');

exports.router = router;

router.get('/', async (req, res) =>{
  try {
    const skillPage = await getSkillPage(
      parseInt(req.query.page) || 1
    );
    //console.log("skillPage: ", skillPage);
    res.status(200).send(skillPage);
  } catch (err) {
    //console.error(" -- error:", err);
    res.status(500).send({
      error: "Error fetching skill page."
    });
  }

});

/*
 * Route to create a new skill.
 */
router.post('/', async (req, res, next) => {
    try{
      const id = await insertNewSkills(req.body)
      res.status(201).json({
        id: id,
        links: {
          skills: `/skills/${id}`
        }
      });
    }catch(err) {
      res.status(500).send({
        error: "Error inserting skills"
      });
    }
});

/*
 * Route to fetch info about a specific skill.
 */
router.get('/:id', async (req, res, next) => {
  const skillid = req.params.id;
  //console.error(" -- skillid:", skillid);
  try {
    const skill = await getSkillByID(skillid)
    if (skill) {
      res.status(200).send(skill);
    } else {
      next();
    }
  } catch (err) {
    //console.log(" -- err:", err);
    res.status(500).send({
      error: "Unable to find skill."
    });
  }
});

/*
 * Route to replace data for a skill.
 */
router.put('/:id', async (req, res, next) => {
  const skillid = req.params.id;
    try {
      const updateSuccessful = await
        updateSkillByID(skillid, req.body);
      if (updateSuccessful) {
        res.status(200).send({
          _id: skillid,
          body: req.body
        });
      } else {
        next();
      }
    } catch (err) {
      res.status(500).send({
        error: "Unable to update skill."
      });
    }
});

/*
 * Route to delete a skill.
 */
router.delete('/:id', async (req, res, next) => {
  const skillid = req.params.id;
  try {
    const deleteSuccessful = await deleteSkillsByID(skillid)
    if (deleteSuccessful) {
       res.status(204).end();
    } else {
      next();
    }
  } catch (err) {
    res.status(500).send({
      error: "Unable to delete skill."
    });
  }
});
