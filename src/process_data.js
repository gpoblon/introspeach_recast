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

const Db = require('./fill_db');
const Api = require('./api');
const Midware = require('./middleware');

function callMiddleware(data) {
	let middlewareObject = Midware.create(endOfChain);

	Midware.add(runLogicToOutput, middlewareObject);
	Midware.add(Api.ifChuckJoke, middlewareObject);
	if (!data.recast.replies.length) { // if recast doesn't fin any reply :my logic
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
	next(data, res, true);
}

/*
 * Use this function only if recast has a reply to send
 * It's PHASE 2
*/
function getRecastReply(data, err, res) {
	console.log('Reponse par le builder :) : ' + data.recast.replies[0]);
	data.recast.replies[0] = data.recast.replies[0].replace(/\\n/g, '\n');
	data.recast.replies.forEach((replyContent) => data.message.addReply({type: 'text', content: replyContent}));
	data.message.addReply(Db.getDbAnswers(data, 'defaultAnswer'));
}

/*
 * PHASE 2 bis
 * else, run everything that follows
*/

function isIntent(data, res, next) {
	if (data.intent) {
		data.answer = data.intent;
		res.addToLog("Intent: " + data.intent);
		next(data, res, true);
	} else {
		data.answer = 'defaultAnswer';
		res.addToLog("no intent found. Stop there");
		next(data, res, false);
	}
}

function isEntity(data, res, next) {
	if (data.entity) {
		data.answer += '_' + data.entity;
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
		data.answer_with_gazette = data.answer + '_' + data.gazette;
		res.addToLog("Gazette : " + data.gazette);
		next(data, res, true);
	} else {
		res.addToLog("No gazette found. Stop there.")
		next(data, res, false);
	}
}

function endOfChain(data, err, res) {
	data.formattedAnswer = Db.getDbAnswers(data.answer, data.answer_with_gazette);
	res.addToLog("Answer sent : ", data.formattedAnswer);
	console.log("++++\n", data, "\n+++++")
	console.log("data.answer = ", data.answer);
	console.log("RES LOG :\n", res.log);
	console.log("Error: ", err);
	data.message.addReply(data.formattedAnswer);
	if (data.formattedAnswer.type == 'text') // send default message to relance if output is of type text
		data.message.addReply(Db.getDbAnswers('defaultAnswer'));
}

module.exports = {
	callMiddleware
}
