require('./config');
const OutputType = require('./output_type.js');
const request = require('request');

function auth(req, res) {
	if (req.query['hub.mode'] === 'subscribe' && req.query['hub.verify_token'] === process.env.FB_VALIDATION_TOKEN) {
		console.log("Validating webhook");
		res.status(200).send(req.query['hub.challenge']);
	} else {
		console.error("Failed validation. Make sure the validation tokens match.");
		res.sendStatus(403);
	}
}

function getInput(req, res) {
	let input = {};
	let message_events = req.body.entry[0].messaging;
    for (let message_event of message_events) {
		input.sender = message_event.sender.id;
        if (message_event.message && message_event.message.text) {
			input.text = message_event.message.text;
		}
	}
	res.sendStatus(200);
	return input;
}

function sendAnswerBack(sender, output) {
	let msg_data = OutputType.parseOutput(output);
	//	console.log(msg_data);
	let payload = {
        url: 'https://graph.facebook.com/v2.9/me/messages',
		qs: {access_token: process.env.FB_ACCESS_TOKEN},
        method: 'POST',
        json: {
            recipient: { id: sender },
            message: msg_data,
        }
    };
	request(payload, function(error, response, body) {
        if (error) {
            console.log('Error sending messages: ', error);
        } else if (response.body.error) {
            console.log('Error: ', response.body.error);
        }
    });
}

module.exports = {
	auth,
	getInput,
	sendAnswerBack
};
