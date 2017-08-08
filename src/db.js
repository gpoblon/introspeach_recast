const mongo = require('./mongo_connect').connectToMongo();

// bot answers connections

function getDbAnswers(data, next) {
  mongo.then((db) => {
    db.collection('bot_replies').find({ 'intent': data.intent}).toArray(function (err, res) {
      if (err){
        return next(err, data);
      }
      let entitiesArr = [];
      for (let i = 0; res[i]; i++) { // get the matching entity
        if (!data.answers.db && res[i].entity == '')
          data.answers.db = res[i].result;
        if (res[i].entity == data.entity) {
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
      if (!data.answers.db) {
        getDbDefaultAnswer(data, next);
      } else {
      next(null, data); 
      }
    });
  });
}

function getDbDefaultAnswer(data, next) {
	//if nothing (IE not intent) has been found or answer is text: get default answer
  mongo.then((db) => {
    db.collection('bot_replies').find({ 'intent': ''}).toArray(function (err, res) {
		  data.answers.default = res[0].result;
	  	next(null, data);
	  });
  });
}

// questions connections

function askQuestion(data, next) {
  mongo.then((db) => {
    db.collection('questions').find({ '_id': data.user.q_ref}).toArray(function (err, res) {
      if (err) {
        throw err;
      }
      if (res[0] && res[0].question) {
        data.answers.question = res[0].question;
        console.log(`save question`);
      }
	  	next(null, data);
	  });
  });
}

function updateDbAfterQuestion(data, result, next) {
  console.log(`update db after questions : ${data.user.q_ref}`);
  mongo.then((db) => {
    // first add the user answer to our db
    if (data.user.q_ref != -1) {
      db.collection('questions').update(
        { _id: data.user.q_ref },
        { $push: {answers: {raw: data.user.answer, user_id: data.user.id }}},
        (err, res) => {
          if (err) {
            throw err;
          }
      });
    }
    // then update status for users
    console.log(`DB: updating 'users' collection, user.q_ref of user ${data.user.id} is now ${data.user.q_ref}`);
    if (data.user.q_ref == -1) {
      data.user.q_status = false;
    }
    if (data.user.q_status == true && data.user.q_ref < data.q_max) {
      data.user.q_ref += 1;
    } else if (data.user.q_ref == data.q_max) {
      data.user.q_ref = -1;
      data.user.q_status = false;
    }
    db.collection('users').update(
      { _id: data.user.id },
      {
        q_status: data.user.q_status,
        q_ref: data.user.q_ref,
      },
      (err, res) => {
        if (err) {
          throw err;
        }
      next(data, result, true);
    });
  });
}
// users connections

function getUserData(data, res, next) {
  console.log("USER DATA");
  mongo.then((db) => {
    db.collection('users').find({"_id": data.user.id}).toArray((err, response) => {
      if (data.intent == "launch-questions" && response[0] && response[0].q_ref >= 0) {
        console.log("edit status after determining launch-questions intent");
        response[0].q_status = true;
        response[0].q_ref = 0;
      }
      if (err || !response[0]) {
        console.log("ADDING USER TO DB");
        if (data.intent == "launch-questions") {
          data.user.q_status = true;
        }
        db.collection('users').insertOne({
          "_id": data.user.id,
          "q_status": data.user.q_status,
          "q_ref": data.user.q_ref
        });
      } else {
        data.user.q_status = response[0].q_status;
        data.user.q_ref = response[0].q_ref;
      }
      console.log(`user id: ${data.user.id}, user questions ref: ${data.user.q_ref}`);
      next(data, res, true);
    });
  });
}

module.exports = {
	getDbAnswers,
  getDbDefaultAnswer,
  getUserData,
  askQuestion,
  updateDbAfterQuestion
};
