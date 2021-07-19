const { getDBReference } = require('../lib/mongo');
const collectionName = "users";
const { getHeroReviewByUserID } = require('../models/reviews');
const { getHeroImageByUserID } = require('../models/images');
const bcrypt = require('bcryptjs');

var ObjectID = require('mongodb').ObjectID;

async function getUserPage(page) {
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
    users: results,
    pageNumber: page,
    totalPages: lastPage,
    pageSize: pageSize,
    totalCount: results.length,
  };
};
exports.getUserPage = getUserPage;

async function insertNewUser(user) {
  user.password = passwordHash = await bcrypt.hash(user.password, 8);
  const db = getDBReference();
  const collection = db.collection(collectionName);
  const result = await collection.insertOne(user);
  //console.log("  -- result:", result);
  return result.insertedId;
};
exports.insertNewUser = insertNewUser;

async function getUserByID(id, includePassword) {
  const db = getDBReference();
  const collection = db.collection(collectionName);
  const projection = includePassword ? {} : {password : 0}
  const result = await collection
  .find({_id: new ObjectID(id) })
  .project(projection)
  .toArray();
  return result[0];
};
exports.getUserByID = getUserByID;

async function getUserDetailByID(id) {
  const user = await getUserByID(id);
  if(user){
    user.review = await getHeroReviewByUserID(id);
    user.image = await getHeroImageByUserID(id);
  }
  return user;
};
exports.getUserDetailByID = getUserDetailByID;

async function deleteUserByID(id){
  const db = getDBReference();
  const collection = db.collection(collectionName);
  const result = await collection.deleteOne({_id: new ObjectID(id)});
  return result.deletedCount > 0;
};
exports.deleteUserByID = deleteUserByID;

async function updateUserByID(id, newInfo) {
  const db = getDBReference();
  const collection = db.collection(collectionName);
  const result = await collection.replaceOne({_id: new ObjectID(id)},newInfo);
  return result.matchedCount > 0;
};
exports.updateUserByID = updateUserByID;

async function validateUser (id, password){
  const user = await exports.getUserByID(id, true);
  return user && await bcrypt.compare(password, user.password);
}
exports.validateUser = validateUser;
