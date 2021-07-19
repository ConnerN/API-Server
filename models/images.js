const { getDBReference } = require('../lib/mongo');
const collectionName = "images";
const { ObjectID, GridFSBucket } = require('mongodb');
//var ObjectID = require('mongodb').ObjectID;
const fs = require('fs');

const PhotoSchema = {
  heroid: { required: true },
  userid: { required: true},
  caption: { required: false }
};
exports.PhotoSchema = PhotoSchema;

async function getImagePage(page) {
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
    image: results,
    pageNumber: page,
    totalPages: lastPage,
    pageSize: pageSize,
    totalCount: results.length,
  };
};
exports.getImagePage = getImagePage;

async function insertNewImage(hero) {
  const db = getDBReference();
  const collection = db.collection(collectionName);
  const result = await collection.insertOne(hero);
  //console.log("  -- result:", result);
  return result.insertedId;
};
exports.insertNewImage = insertNewImage;

async function getImageByID(id) {
  const db = getDBReference();
  const collection = db.collection(collectionName);
  const result = await collection.find({_id: new ObjectID(id) }).toArray();
  return result[0];
};
exports.getImageByID = getImageByID;

// async function getHeroImageByHeroID(id) {
//   const db = getDBReference();
//   const collection = db.collection(collectionName);
//   const result = await collection.find({ heroid: id }).toArray();
//   return result;
// };
async function getHeroImageByHeroID(id) {
  const db = getDBReference();
  const bucket = new GridFSBucket(db, {
    bucketName: 'images'
  });
  if (!ObjectID.isValid(id)) {
    return null;
  } else {
    //const results = await collection
    const results = await bucket
      .find({ "metadata.heroid": id })
      .toArray();
    //console.log("result", result);
    var size = results.length-1;
    return results[size];
  }
}
exports.getHeroImageByHeroID = getHeroImageByHeroID;

async function getHeroImageByUserID(id) {
  const db = getDBReference();
  const collection = db.collection(collectionName);
  const result = await collection.find({ userid: id }).toArray();
  return result;
};
exports.getHeroImageByUserID = getHeroImageByUserID;

async function deleteImageByID(id){
  const db = getDBReference();
  const collection = db.collection(collectionName);
  const result = await collection.deleteOne({_id: new ObjectID(id)});
  return result.deletedCount > 0;
};
exports.deleteImageByID = deleteImageByID;

async function updateImageByID(id, newInfo) {
  const db = getDBReference();
  const collection = db.collection(collectionName);
  const result = await collection.replaceOne({_id: new ObjectID(id)},newInfo);
  return result.matchedCount > 0;
};
exports.updateImageByID = updateImageByID;

exports.saveImageFile = async function (image) {
  return new Promise((resolve, reject) => {
    const db = getDBReference();
    const bucket = new GridFSBucket(db, {
      bucketName: 'images'
    });
    const metadata = {
      contentType: image.contentType,
      heroid: image.heroid,
      filename: image.filename,
      caption: image.caption,
      userid: image.userid
    };
    //console.log("== PHOTO:", metadata);
    const uploadStream = bucket.openUploadStream(
      image.filename,
      { metadata: metadata }
    );
    fs.createReadStream(image.path).pipe(uploadStream)
      .on('error', (err) => {
        reject(err);
      })
      .on('finish', (result) => {
        resolve(result._id);
      });
  });
};

async function getImageInfoById(id) {
  const db = getDBReference();
  const bucket = new GridFSBucket(db, {
    bucketName: 'images'
  });

  if (!ObjectID.isValid(id)) {
    return null;
  } else {
    //const results = await collection
    const results = await bucket
      .find({ _id: new ObjectID(id) })
      .toArray();
    return results[0];
  }
}
exports.getImageInfoById = getImageInfoById;

async function saveImageInfo(image) {
  const db = getDBReference();
  const collection = db.collection('images');
  const result = await collection.insertOne(image);
  return result.insertedId;
}
exports.saveImageInfo = saveImageInfo;

let channel = null
exports.getChannel = function () {
  return channel;
};

exports.getImageDownloadStreamByFilename = function(filename) {
  const db = getDBReference();
  const bucket = new GridFSBucket(db, { bucketName: 'images' });
  return bucket.openDownloadStreamByName(filename);
};
