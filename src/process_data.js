/*
 * process_data.js
 * This file contains your bot code
 *
 * IMPORTANT !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
 * You can insert your own code at 3 points :
 * - PHASE 1:
 *		 When your server receives recast result from fb users input ;
 * - PHASE 2:
 *		- If no reply has been catch from recast builder : apply some code of yours.
 *		- Else : apply some code to recasts reply/ies.
 * - PHASE 3:
 *		The answer has been sent back: so here do whatever logic the doesn't imply to change the output.
 */

const Db = require('./db');
const Api = require('./api');
const Midware = require('./middleware');

function callMiddleware(data) {
	let middlewareObject = Midware.create(endOfChain);

	Midware.add(runLogicToOutput, middlewareObject);
  Midware.add(Api.ifChuckJoke, middlewareObject);
  Midware.add(Db.getUserData, middlewareObject);
  Midware.add(Db.updateDbAfterQuestion, middlewareObject);
  if (!data.recast.replies.length) {
    Midware.add(isIntent, middlewareObject);
    Midware.add(isEntity, middlewareObject);
    Midware.add(isGazette, middlewareObject);
  } else {
      Midware.add(getRecastReply, middlewareObject);
  }

  Midware.run(data, {}, middlewareObject);
}

/*
 * PHASE 1 in this function
 * IE DB connect. Code logic that will be applied whatever happens next
 */

function runLogicToOutput(data, res, next) {
  res.addToLog("Entering in my middleware chain...");

  data.q_max = 6;
	next(data, res, true);
}

/*
 * Use this function only if recast has a reply to send
 * It's PHASE 2
 */

function getRecastReply(data, res, next) {
  if(data.recast.replies.length && data.user.q_status == false) {
    data.answers.recast = {
		type: 'text',
		content: data.recast.replies[0].replace(/\\n/g, '\n')
	  };
	  res.addToLog("Answer by Recast builder : " + data.answers.recast.content);
  }
  next(data, res, true);
}

/*
 * PHASE 2 bis
 * else, run everything that follows
*/

function isIntent(data, res, next) {
  if (data.intent) {
    console.log(data.intent);
    res.addToLog("Intent: " + data.intent);
    next(data, res, true);
  } else {
    data.defaultAnswer = true;
    data.answer = 'defaultAnswer';
    res.addToLog("no intent found. Stop there");
    next(data, res, false);
  }
}

function isEntity(data, res, next) {
  if (data.entity) {
    res.addToLog("Entity: " + data.entity);
    next(data, res, true);
  } else {
    data.answer += '_default';
    res.addToLog("no entity found. Stop there");
    next(data, res, false);
  }
}

function isGazette(data, res, next) {
  if (data.gazette) {
    res.addToLog("Gazette : " + data.gazette);
    next(data, res, true);
  } else {
    res.addToLog("No gazette found. Stop there.")
    next(data, res, false);
  }
}

function endOfChain(data, err, res) {
	res.addToLog('In end of chain...');

  console.log(data.recast.intents);
  if(!data.answers.recast && !data.user.q_status && !data.answers.api && !data.defaultAnswer) {
		// if none has been called: call Db to find the answer and eventually do some code
		console.log("Db call.");
    Db.getDbAnswers(data, proceedReplies);
  } else if (data.user.q_status) {
    console.log(`proceed reply from questions : ${data.user.q_status}`);
    Db.askQuestion(data, proceedReplies);
  } else if (data.answers.recast) {
    console.log(`proceed recast reply`);
    proceedReplies(null, data);
  } else {
    console.log(`proceed default reply`);
    Db.getDbDefaultAnswer(data, proceedReplies);
  }
}

function proceedReplies(err, data) {
  console.log("=-=-=-=-");
  console.log(data.answers);
	Object.keys(data.answers).forEach((source) => {
		console.log(`intent: ${data.intent}`);
  	console.log(`entity: ${data.entity}`);
		console.log(data.answers[source]);
		console.log('\n');
			data.message.addReply(data.answers[source]);
		});
	console.log("-=-=-=-");
  data.message.reply()
	.then(() => {
		// EDITION PHASE 3 : add some code after the answer has been sent
	})
	.catch((err) => {
		console.error('Error while sending message to channel', err);
	})
}

module.exports = {
	callMiddleware
}
