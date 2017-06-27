const mongo = require('mongodb').MongoClient;

function getDbAnswers(data, next) {
	// TODO put the connection in server.js and figure out a way to call db object here
	mongo.connect('mongodb://127.0.0.1:27017/introspeach', function (err, db) {
		if (err) {
			throw err;
		}
		db.collection('bot_replies').find({ 'intent': data.intent}).toArray(function (err, res) {
			if (err){
				return next(err, data);
			}
			console.log(data.intent);
			let entitiesArr = [];
			for (let i = 0; res[i]; i++) { // get the matching entity
				if (res[i].entity == data.entity) {
					console.log("entity: " + res[i].entity);
					entitiesArr.push(i);
					if (!res[i].gazette) // catch default entity in case no gazette matches
						data.answers.db = res[i].result;
				}
			}
			// look at every matching entity and catch, if exist, a matching gazette in db
			for(let i = 0; res[entitiesArr[i]]; i++) {
				if (res[i].gazette == data.gazette) {
					data.answers.db = res[entitiesArr[i]].result;
				}
			}
			next(null, data);
		});
	});
}

function getDbDefaultAnswer(data, next) {
	//if nothing (IE not intent) has been found or answer is text: get default answer
	// TODO put the connection in server.js and figure out a way to call db object here
	mongo.connect('mongodb://127.0.0.1:27017/introspeach', function (err, db) {
		if (err) {
			throw err;
		}
		db.collection('bot_replies').find({ 'intent': ''}).toArray(function (err, res) {
			data.answers.default = res[0].result;
			next(null, data);
		});
	});
}

function getDbQuestions(data) {
	mongo.connect('mongodb://127.0.0.1:27017/introspeach', function (err, db) {
		if (err) {
			throw err;
		}
		db.collection("questions").find().toArray(function (err, res) {
			if (err)
				throw err;
			if (res[data.questionId])
				data.dbReply = res[data.questionId].result;
			if(!res[data.questionId + 1])
				data.questionsOver = true;
		});
	});
}

module.exports = {
	getDbAnswers,
	getDbDefaultAnswer
};
