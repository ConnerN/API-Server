const mongoHost = process.env.MONGO_HOST || "localhost";
const mongoPort = process.env.MONGO_PORT || 27017;
const mongoUser = process.env.MONGO_USER;
const mongoPassword = process.env.MONGO_PASSWORD;
const mongoDBName = process.env.MONGO_DATABASE;

const mongoUrl = `mongodb://${mongoUser}:${mongoPassword}@${mongoHost}:${mongoPort}/${mongoDBName}`;

const { MongoClient } = require('mongodb');

let db = null;

exports.connectToDB = function (callback) {
  MongoClient.connect(mongoUrl, {useUnifiedTopology: true}, function (err, client) {
    //console.log("== MongoURL: ", mongoUrl);
    if (err) {
      throw err;
    }
    db = client.db(mongoDBName);
    callback();
  });
};

exports.getDBReference = function () {
  return db;
};
