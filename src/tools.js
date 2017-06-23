function getIntent(result) {
	let intent;

	if(result.intents[0]) {
		intent = result.intents[0].slug;
		intent = intent.replace(/-([a-z])/g, function (g) {
			return g[1].toUpperCase();
		});
	}
	return intent;
}

function getEntity(result) {
	let entity;

	if (Object.keys(result.entities)[0]) {
		entity = Object.keys(result.entities)[0];
		entity = entity.replace(/-([a-z])/g, function (g) {
			return g[1].toUpperCase();
		});
	}
	return entity;
}

function getGazette(result) {
	let entityObj = Object.keys(result.entities)[0];
	let gazette;

	if (result.entities[entityObj]) {
		gazette = result.entities[entityObj][0].raw;
		console.log(gazette);
		gazette = gazette.replace(/-([a-z])/g, function (g) {
			return g[1].toUpperCase();
		});
	}
	return gazette;
}

module.exports = {
	getIntent,
	getEntity,
	getGazette
};

// TODO store not only the first intent/entity but every single one OR
// only retain the one with the highest confident rate.
