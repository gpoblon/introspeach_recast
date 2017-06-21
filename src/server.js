const express = require('express');
const bodyParser = require('body-parser');
const _ = require('lodash');
const recastai = require('recastai');
require('./config');

const Facebook = require('./facebook_connect.js');
const Db = require('./tmp_db');

const app = express()
const recastRequest = new recastai.request(process.env.REQUEST_TOKEN);

let input = {};
let standardOutput = require('./standard_output_format.json');

/* Server setup */
app.set('port', process.env.PORT);
app.use(bodyParser.json());

app.listen(app.get('port'), () => {
	console.log('Our bot is running on port', app.get('port'));
});

app.get('/api/facebook', Facebook.auth);

app.post('/api/facebook', function(req, res) {
	input = Facebook.getInput(req, res, input);
	/* ouputObject is filled with either type, text, title, qr_type, qr_text,
	* url. Whatever you need to output to fb. Read my repo doc to know
	* how to properly fill this Object
	*/
	let outputObject = _.merge(standardOutput, Db.greeting());
	
	if(input.text) {
		Facebook.sendAnswerBack(input.sender, outputObject);
	}
	/*
	recastRequest.analyseText(input.text)
	.then(function(result) {
		let recastResult = result;
		console.log(JSON.stringify(recastResult, null, 4));
	});*/
});

// TODO add an action KV string which will define whether a message should be sent randomly, or if several messages are to be sent etc or even if there is an order to send it.


