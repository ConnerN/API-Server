const { getDBReference } = require('../lib/mongo');
const collectionName = "heroReviews";

var ObjectID = require('mongodb').ObjectID;

async function getReivewsPage(page) {
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
    reviews: results,
    pageNumber: page,
    totalPages: lastPage,
    pageSize: pageSize,
    totalCount: results.length,
  };
};
exports.getReivewsPage = getReivewsPage;

async function insertNewReview(hero) {
  const db = getDBReference();
  const collection = db.collection(collectionName);
  const result = await collection.insertOne(hero);
  //console.log("  -- result:", result);
  return result.insertedId;
};
exports.insertNewReview = insertNewReview;

async function getReviewByID(id) {
  const db = getDBReference();
  const collection = db.collection(collectionName);
  const review = await collection.find({_id: new ObjectID(id) }).toArray();
  return review[0];
};
exports.getReviewByID = getReviewByID;

async function getHeroReviewByHeroID(id) {
  const db = getDBReference();
  const collection = db.collection(collectionName);
  const hero = await collection.find({ heroid: id }).toArray();
  return hero;
};
exports.getHeroReviewByHeroID = getHeroReviewByHeroID;

async function getHeroReviewByUserID(id) {
  const db = getDBReference();
  const collection = db.collection(collectionName);
  const hero = await collection.find({ userid: id }).toArray();
  return hero;
};
exports.getHeroReviewByUserID = getHeroReviewByUserID;

async function deleteUserByID(id){
  const db = getDBReference();
  const collection = db.collection(collectionName);
  const result = await collection.deleteOne({_id: new ObjectID(id)});
  return result.deletedCount > 0;
};
exports.deleteUserByID = deleteUserByID;

async function updatereviewByID(id, newInfo) {
  const db = getDBReference();
  const collection = db.collection(collectionName);
  const result = await collection.replaceOne({_id: new ObjectID(id)},newInfo);
  return result.matchedCount > 0;
};
exports.updatereviewByID = updatereviewByID;
