const mongo = require('mongodb').MongoClient;

function connectToMongo() {
  var db = mongo.connect('mongodb://127.0.0.1:27017/introspeach');

  console.log("DB CONNECT");
  return db;
}

module.exports = {
  connectToMongo
};
