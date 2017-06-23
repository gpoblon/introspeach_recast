const TmpDB = require('./fill_db'); // tmp js file before I find time to discover MongoDB and mongoose

let answer = {};

function getOutput(intent, entity, gazette, memory) {
	if (entity == 'pronoun' && (gazette == 'Tu' || gazette == 'Vous' || gazette == 'tu' || gazette == 'vous'))
	{
		entity = 'bot';
		gazette = 'bot';
	}

	console.log("intent : " + intent);
	console.log("entity : " + entity)
	console.log("gazette : " + gazette)

	let	answer = TmpDB.getAnswer(intent, entity);
	return answer;
}

module.exports = {
	getOutput
}
