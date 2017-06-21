const recastai = require('recastai');

// Endpoint to be call from the client side
function connectAndAnswer(input, callback) {
	
	const request = new recastai.request(process.env.REQUEST_TOKEN, process.env.LANGUAGE);
	const client = new recastai.default(process.env.REQUEST_TOKEN);
	//let payload = {};

	client.connect.handleMessage({ body }, response, replyMessage);



	console.log(payload);
    conversation.message(payload, function(err, data) { // Send the input to the conversation service
        if (err) {
			err = res.status(err.code || 500).json(err);
        }
		let recast_output = updateMessage(payload, data);
        res.json(updateMessage(payload, data));
		Facebook.sendAnswerBack(input, watson_output[0]);
		console.log(watson_output);
		//return res.json(watson_output);
    });
}

/**
 * Updates the response text using the intent confidence
 * @param  {Object} input The request to the Conversation service
 * @param  {Object} response The response from the Conversation service
 * @return {Object}          The response with the updated message
 */
function updateMessage(input, response) {
    let responseText = null;
    if (!response.output) {
        response.output = {};
    } else {
        return response.output.text;
    }
    /*  if (response.intents && response.intents[0]) {
        var intent = response.intents[0];
        if (intent.confidence >= 0.75) {
            responseText = 'Ton intention était : ' + intent.intent;
        } else if (intent.confidence >= 0.5) {
            responseText = 'Je pense avoir compris que tu voulais : ' + intent.intent;
        } else {
            responseText = 'Désolé, j\'ai mal compris ton intention.';
        }
    }*/
	console.log("DOES IT GO THROUGH CONFIDENCE ?");
	response.output.text = responseText;
	return response;
}

module.exports = {
	connectAndAnswer
};
