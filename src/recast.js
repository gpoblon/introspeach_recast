/*
 * recast.js
 *
 * In this file:
 * - received message from a connected channel will be transformed with Recast.AI SDK
 * - received message from test command will be processed by Recast.AI
 *   You can run this command for testing:
 *   curl -X "POST" "http://localhost:5000" -d '{"text": "YOUR_TEXT"}' -H "Content-Type: application/json; charset=utf-8"
 *
 * The Recast.AI SDK will handle the message and call your reply bot function (ie. replyMessage function)
 */

const recastai = require('recastai').default;
const Process = require('./process_data');
const Tools = require('./tools');
const client = new recastai(process.env.REQUEST_TOKEN); // Instantiate Recast.AI SDK


/*
 * Main bot function
 * Parameters are:
 * - body: Request body
 * - response: Response of your server (can be a blank object if not needed: {})
 * - callback: Callback is a function called by Recast.AI hosting system when your code will be hosted
 */
export const bot = (body, response, callback) => {
	if (body) {
		/*
		* Call the Recast.AI SDK function to handle message from Bot Connector
		* This function will:
		* - Return a response with the status code 200
		* - Create a Message object, easily usable in your code
		* - Call the 'replyMessage' function, with this Message object in parameter
		*/
		client.connect.handleMessage({ body }, response, getReply);
		// This function is called by Recast.AI hosting system when your code will be hosted
		callback(null, { result: 'new message from Speach' });
	} else {
		callback('No text provided');
	}
};

function getReply(message) {
	// Instantiate Recast.AI SDK, just for request service
	const request = new recastai.request(process.env.REQUEST_TOKEN, process.env.LANGUAGE)

	request.converseText(message.content, { conversationToken: message.senderId })
	// Call Recast.AI SDK, through /converse route
	.then((result) => {
		let data = {
			answers: {}
		};
		Tools.resultToData(data, result, message);
		Process.callMiddleware(data);
	})
	.catch((err) => {
		console.error('Error while sending message to Recast.AI', err);
	})
};
