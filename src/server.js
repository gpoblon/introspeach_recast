/*
 * server.js
 * This file is the core of your bot
 *
 * It creates a little server using express
 * So, your bot can be triggered throught "/" route
 *
 * This file was made for locally testing your bot
 * You can test it by running this command
 * curl -X "POST" "http://localhost:5000" -d '{"text": "YOUR_TEXT"}' -H "Content-Type: application/json; charset=utf-8"
 * You might modify the server port ^^^^  depending on your configuration in config.js file
 */

const express = require('express');
const bodyParser = require('body-parser');

// Load configuration
require('./config');
const bot = require('./bot').bot;

// Start Express server
const app = express();
app.set('port', process.env.PORT || 5000);
app.use(bodyParser.json());

// Handle / route
app.use('/', (request, response) => {
	// Call bot main function
	bot(request.body, response, (error, success) => {
		console.log(request.body);
		if (error) {
			console.log('Error in your bot:', error);
			if (!response.headersSent) {
				response.sendStatus(400);
			}
		} else if (success) {
			console.log(success);
			if (!response.headersSent) {
				response.status(200).json(success);
			}
		}
	});
});

if (!process.env.REQUEST_TOKEN.length) {
	console.log('ERROR: env variable REQUEST_TOKEN has not been set (src/config.js).');
	process.exit(0);
} else {
	// Run Express server, on right port
	app.listen(app.get('port'), () => {
    console.log('Our bot is running on port', app.get('port'));
  });
}
