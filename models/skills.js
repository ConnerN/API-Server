const { getDBReference } = require('../lib/mongo');
const collectionName = "heroSkills";

var ObjectID = require('mongodb').ObjectID;

async function getSkillPage(page) {
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
    skills: results,
    pageNumber: page,
    totalPages: lastPage,
    pageSize: pageSize,
    totalCount: results.length,
  };
};
exports.getSkillPage = getSkillPage;

async function insertNewSkills(hero) {
  const db = getDBReference();
  const collection = db.collection(collectionName);
  const result = await collection.insertOne(hero);
  //console.log("  -- result:", result);
  return result.insertedId;
};
exports.insertNewSkills = insertNewSkills;

async function getSkillByID(id) {
  const db = getDBReference();
  const collection = db.collection(collectionName);
  const result = await collection.find({_id: new ObjectID(id) }).toArray();
  return result[0];
};
exports.getSkillByID = getSkillByID;

async function getHeroSkillByHeroID(id) {
  const db = getDBReference();
  const collection = db.collection(collectionName);
  const result = await collection.find({ heroid: id }).toArray();
  return result;
};
exports.getHeroSkillByHeroID = getHeroSkillByHeroID;

async function deleteSkillsByID(id){
  const db = getDBReference();
  const collection = db.collection(collectionName);
  const result = await collection.deleteOne({_id: new ObjectID(id)});
  return result.deletedCount > 0;
};
exports.deleteSkillsByID = deleteSkillsByID;

async function updateSkillByID(id, newInfo) {
  const db = getDBReference();
  const collection = db.collection(collectionName);
  const result = await collection.replaceOne({_id: new ObjectID(id)},newInfo);
  return result.matchedCount > 0;
};
exports.updateSkillByID = updateSkillByID;
