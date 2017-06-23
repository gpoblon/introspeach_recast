/*const mongoose = require('mongoose');
const DB = mongoose.connect('mongodb://163.172.218.236:3000/introspeach')
*/

const db = require('./fill_db');

function getIntent(result) {
	let intent;

	if(result.intents[0]) {
		intent = result.intents[0].slug;
		intent = intent.replace(/[-' ]([a-z])/g, function (g) {
			return g[1].toUpperCase();
		});
	}
	return intent;
}

function getMostProbableEntity(result) {
	let mostProbableEntity = '';

	let	confidence = 0.;
	for (let entityKey in result.entities) {
		if (!result.entities.hasOwnProperty(entityKey)) continue;
		let entity = result.entities[entityKey]
		if (entity[0].confidence > confidence) {
			mostProbableEntity = entityKey;
		}
	}
	return mostProbableEntity;
}

function getGazette(result, entityKey) {
	let gazette;

	if (result.entities[entityKey]) {
		gazette = result.entities[entityKey][0].raw;
		console.log(gazette);
		gazette = gazette.replace(/"/g, "");
		gazette = gazette.replace(/[- ']([a-z])/g, function (g) {
			return g[1].toUpperCase();
		});
	}
	return gazette;
}

function getOutput(intent, entity, gazette, memory) {
	if (entity == 'pronoun' && (gazette == 'Tu' || gazette == 'Vous' || gazette == 'tu' || gazette == 'vous'))
	{
		entity = 'bot';
		gazette = 'bot';
	}

	console.log("intent : " + intent);
	console.log("entity : " + entity);
	console.log("gazette : " + gazette);

	let	answer = getAnswer(intent, entity, gazette);
	return answer;
}

// TODO use memory to fill more precise answers

function getAnswer(intent, entity, gazette) {
	let allAnswers = db.getFullAnswersObject();
	let answerRef = '';
	if (!intent) {
		answerRef = 'defaultAnswer';
		console.log("nothing catched : " + answerRef );
	} else if (!entity) {
		answerRef = intent + '_default';
		console.log("intent catched only : " + answerRef );
	} else if (!gazette) {
		answerRef = intent + '_' + entity;
		console.log("entity catched + intent : " + answerRef );
	} else {
		answerRef = intent + '_' + entity + '_' + gazette;
		console.log("gazette catched : " + answerRef );
		if (!allAnswers[answerRef]) {
			console.log("... but doesnt match db");
			answerRef = intent + '_' + entity;
		}
	}
	if (!allAnswers[answerRef]) {
		console.log("catched but nothing matches is db :(");
		return allAnswers['defaultAnswer'];
	}
	console.log("ANSWERREF = ", answerRef);
	console.log(allAnswers[answerRef])
	return allAnswers[answerRef];
}

// TODO implement gazette and memory to deal with more complex entities

module.exports = {
	getIntent,
	getMostProbableEntity,
	getGazette,
	getOutput
};
