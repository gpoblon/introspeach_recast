const mongo = require('mongodb').MongoClient;
const format = require('util').format;

mongo.connect('mongodb://127.0.0.1:27017/introspeach', function (err, db) {
    if (err) {
	    throw err;
	} else {
		console.log("successfully connected to the database");
	}
    db.close();
});
