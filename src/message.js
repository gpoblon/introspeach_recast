/*
 * message.js
 * This file contains your bot code
 */

const recastai = require('recastai');
const Tools = require('./logic');

// This function is the core of the bot behaviour
const replyMessage = (message) => {
	// Instantiate Recast.AI SDK, just for request service
	const request = new recastai.request(process.env.REQUEST_TOKEN, process.env.LANGUAGE);
	const text = message.content;
	console.log('I receive: ', text);
	const senderId = message.senderId;

	// Call Recast.AI SDK, through /converse route
	request.converseText(text, { conversationToken: senderId })
	.then((result) => {
		console.log("+++++\n./message.result is :\n", JSON.stringify(result, null, 4), "\n");
	/*
	* YOUR OWN CODE
	* Here, you can add your own process. Ex: You can call any external API, update your mongo DB, etc...
	*/
	// If there is not any message return by Recast.AI for this current conversation
	if (!result.replies.length) {
		let intent = Tools.getIntent(result);
		let entity = Tools.getMostProbableEntity(result);
		let gazette = Tools.getGazette(result, entity);
		message.addReply(Tools.getOutput(intent, entity, gazette));
	} else {
		console.log('Reponse par le builder :) : ' + result.replies[0]);
		result.replies.forEach((replyContent) => message.addReply({ type: 'text', content: replyContent }));
	}
	// Send all replies
	message.reply()
	.then(() => {
		// Do some code after sending messages
	})
	.catch((err) => {
		console.error('Error while sending message to channel', err);
	})
	})
	.catch((err) => {
		console.error('Error while sending message to Recast.AI', err);
	})
};

module.exports = replyMessage;
