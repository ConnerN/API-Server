const { getDBReference } = require('../lib/mongo');
const collectionName = "heroes";
const { getHeroSkillByHeroID } = require('../models/skills');
const { getHeroReviewByHeroID } = require('../models/reviews');
const { getHeroImageByHeroID } = require('../models/images');


var ObjectID = require('mongodb').ObjectID;

async function getHeroesPage(page) {
  const db = getDBReference();
  const collection = db.collection(collectionName);

  const count = await collection.countDocuments();
  const pageSize = 10;
  const lastPage = Math.ceil(count / pageSize);
  page = page > lastPage ? lastPage : page;
  page = page < 1 ? 1 : page;
  const offset = (page - 1) * pageSize;

  const results = await collection.find({})
    .sort({ _id: 1 })
    .skip(offset)
    .limit(pageSize)
    .toArray();

  return {
    heroes: results,
    pageNumber: page,
    totalPages: lastPage,
    pageSize: pageSize,
    totalCount: results.length,
  };
};
exports.getHeroesPage = getHeroesPage;

async function insertNewHero(hero) {
  const db = getDBReference();
  const collection = db.collection(collectionName);
  const result = await collection.insertOne(hero);
  //console.log("  -- result:", result);
  return result.insertedId;
};
exports.insertNewHero = insertNewHero;

async function getHeroByID(id) {
  const db = getDBReference();
  const collection = db.collection(collectionName);
  const hero = await collection.find({_id: new ObjectID(id) }).toArray();
  return hero[0];
};
exports.getHeroByID = getHeroByID;

async function getHeroDetailByID(id) {
  const hero = await getHeroByID(id);
  if(hero){
    hero.skill = await getHeroSkillByHeroID(id);
    hero.review = await getHeroReviewByHeroID(id);
    hero.image = await getHeroImageByHeroID(id);
  }
  return hero;
};
exports.getHeroDetailByID = getHeroDetailByID;

async function deleteHeroByID(id){
  const db = getDBReference();
  const collection = db.collection(collectionName);
  const result = await collection.deleteOne({_id: new ObjectID(id)});
  return result.deletedCount > 0;
};
exports.deleteHeroByID = deleteHeroByID;

async function updateHeroByID(id, newInfo) {
  const db = getDBReference();
  const collection = db.collection(collectionName);
  const result = await collection.replaceOne({_id: new ObjectID(id)},newInfo);
  return result.matchedCount > 0;
};
exports.updateHeroByID = updateHeroByID;
