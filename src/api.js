const request = require('request');

function ifChuckJokeAskApi(data, res, next) {
	// ?firstName=John&amp;lastName=Doe

	if (data.intent == 'askJoke' || data.entity == 'chuckNorris') {
		request('http://www.chucknorrisfacts.fr/api/get?data=tri:alea;type:text;nb:1', (error, result, body) => {
			body = JSON.parse(body);
			let joke = body[0].fact;
			joke = htmlToUtf8(joke);
			data.formattedAnswer = {
				type: 'text',
				content: joke
			};
			next(data, res, false);
		});
	}
	else
		next(data, res, true);
}

// I'm not proud of it
function htmlToUtf8(str)
{
    str = str.replace(/&#039;/g, '\'');
    str = str.replace(/&egrave;/g, 'è');
    str = str.replace(/&eacute;/g, 'é');
    str = str.replace(/&ecirc;/g, 'ê');
    str = str.replace(/&euml;/g, 'ë');

    str = str.replace(/&agrave;/g, 'à');
    str = str.replace(/&acirc;/g, 'ä');
    str = str.replace(/&auml;/g, 'â');

    str = str.replace(/&ograve;/g, 'ò');
    str = str.replace(/&ocirc;/g, 'ô');
    str = str.replace(/&ouml;/g, 'ö');

    str = str.replace(/&igrave;/g, 'ì');
    str = str.replace(/&icirc;/g, 'î');
    str = str.replace(/&iuml;/g, 'ï');

    str = str.replace(/&ugrave;/g, 'ù');
    str = str.replace(/&uuml;/g, 'ü');
    str = str.replace(/&ucirc;/g, 'û');
    return str ;
}

module.exports = {
	ifChuckJoke: ifChuckJokeAskApi
}

