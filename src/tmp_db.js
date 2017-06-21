/*
 *
 * As I am short in time to learn how to use a db in node, and how I can save
 * in my datas (I need some time to think about the best way to save input /
 * output and how to link an input to an answer). So as a placeholder I will
 * send my AnswerObject in there and connect it to Recast.request.json which
 * is actually  my input.
 *
 * For example :
 *
 * FB INPUT : Bonjour
 * Recast return a json which contains a greeting intent
 * is send this json here and look for a matching answer
 * I send back to sendAnserBack(ObjectAnswer) which output properly into messenger.
 *
 * Note that I can pretty much send anything I want to facebook : a
 * quick_reply, text, picture and so on.
*/

function greeting() {
let	output = {
		text: "Voic un exemple de quick_reply a envoyer",
		type: "quick_replies",
		0: {
			text: "1e quick_reply",
			payload: "Inutilisé pour l'instant"
		},
		1: {
			text: "Une 2e pour la route",
			payload: "Inutilisé pour l'instant"
		}
	}
	return (output);
}

module.exports = {
	greeting
}
