function resultToData(data, result, message) {
	avoidPronounAndNumber(data, result);
	getData(result, data);
  data.message = message;
  data.user.answer = message.content;
	data.recast = result;
}

function getData(result, data) {
	let confidence = 0;
	let i = -1;

	while(result.intents[++i]) {
		if (confidence < result.intents[i].confidence)
			data.intent = result.intents[i].slug;
	}
	confidence = 0;
	for (let entityKey in result.entities) {
		if (!result.entities.hasOwnProperty(entityKey))
			continue;
		let cur_entity = result.entities[entityKey]
		if (cur_entity[0].confidence > confidence && entityKey != 'pronoun' && entityKey != 'number') {
			data.entity = entityKey;
			data.gazette = result.entities[entityKey][0].raw;
		}
	}
	if (data.entity) {
		data.gazette = data.gazette.replace(/"/g, "");
		data.gazette = data.gazette.replace(/[- ']([a-z])/g, function (g) { return g[1].toUpperCase(); });
	}
}

function avoidPronounAndNumber(data, result) {
	for (let entityKey in result.entities) {
		if (!result.entities.hasOwnProperty(entityKey)) continue;
		let entity = result.entities[entityKey]
		let gazette = entity[0].raw;
		if(entityKey == 'Number')
			delete result.entities[entityKey];
		else if (entityKey == 'pronoun' && (gazette == 'Tu' || gazette == 'Vous' || gazette == 'tu' || gazette == 'vous'))
		{
			data.entity = 'bot';
			data.gazette = 'bot';
		}
	}
}

module.exports = {
	resultToData,
}
