/*const mongoose = require('mongoose');

let Schema = mongoose.schema;

function getTextSchema() {
	let textSchema = new Schema({
		text: String
	});
	return textSchema;
}

function getQuickRepliesSchema() {
	let quickRepliesSchema = new Schema({
		title: String,
		buttons: [{title: String, value: String}]
	});
}

let defineWordSchema = new Schema({
	bot: {
		type: String,
		content: 
	}
});
*/

let allAnswers = {
/*
 * intent : define-word
 * entities : bot
 * gazettes : none
 *
*/
	defineWord_bot: {
		entity: 'bot',
		gazette: '',
		type: 'text',
		content: 'Un chatbot c\'est un programme informatique qui est utilisé pour répondre à des questions de personnes. Il remplace l\'homme. Le notre comprend le sens des phrases. Partant de là beaucoup de travail de saisie par des professionnels de la santé et du sexe pour répondre à toutes les questions que tu te poses... :)'
	},

	defineWord_default: {
		entity: '',
		gazette: '',
		type: 'text',
		content: 'Je n\'ai pas compris ce que tu voulais que je t\'explique, désolé !'
	},

/*
 * intent : reason-why
 * entities : bot, subject
 * gazettes : none
 *
*/
	reasonWhy_bot: {
		entity: 'bot',
		gazette: '',
		type: 'text',
		content: '2 raisons. Déjà, tu te poses des questions de cul tous les jours.\nEnsuite, la société ne t\'aide pas à découvrir la sexualité sainement : trop peu d\'informations, trop peu de gens avec qui en parler sans tabou. Les vidéos que tu peux voir, ce que tes amis te racontent, c\'est souvent loin de la réalité.\n Voilà pourquoi Speach. Lui il pourra t\'aider à répondre à toutes les questions que tu te poses, sans gène, sans jugement :)'
	},

	reasonWhy_subject: {
		entity: 'subject',
		gazette: '',
		type: 'text',
		content: 'Notre logo est une pêche (peach en anglais). Les pêches familièrement c\'est les fesses, un organe commun aux gars et filles. S pour sexe / sexualité. Speach aussi ressemble a speech, top pour un chatbot ! B|'
	},

	reasonWhy_default: {
		entity: '',
		gazette: '',
		type: 'text',
		content: 'Oula, je n\'ai pas la réponse à tous les pourquoi !'
	},

/*
 * intent : want-help
 * entities : bot, subject
 * gazettes : none
 *
*/
	wantHelp_subject: {
		entity: 'subject',
		gazette: '',
		type: 'quickReplies',
		content: {
			title: 'Speach c\'est ton e-ami calé en sexe ! Tu pourras lui demander ce que tu veux en lien avec le sexe. Il t\'accompagnera dans la découverte de ta vie d\'adulte. Si tu imagines un arbre, voici les 5 branches principales :',
			buttons: [
				{
					title: 'l\'amour et le sexe',
					value: 'dis en plus sur la branche "l\'amour et le sexe"'
				},
				{
					title: 'le plaisir',
					value: 'dis en plus sur la branche "le plaisir"'
				},
				{
					title: 'les premières fois',
					value: 'dis en plus sur la branche "les premieres fois"'
				},
				{
					title: 'soi-même et les autres',
					value: 'dis en plus sur la branche "soi-même et les autres"'
				},
				{
					title: 'la prévention et la contraception',
					value: 'dis en plus sur la branche "prévention et contraception"'
				}
			],
		}
	},

	wantHelp_subject_brancheLAmourEtLeSexe: {
		entity: 'subject',
		gazette: 'brancheLAmourEtLeSexe',
		type: 'text',
		content: 'Les deux notions sont liées. Speach pourra te parler de dépendance affective, de jalousie, de rupture, d\'attirance, de friendzone, de fidélité, de savoir quel est le bon moment pour passer à l\'acte par exemple.'
	},

	wantHelp_subject_brancheLePlaisir: {
		entity: 'subject',
		gazette: 'brancheLePlaisir',
		type: 'text',
		content: 'Le plaisir est un aspect central car il est lié à tous les autres (première fois, amour, etc). Bien sur les sujets directs seront : se donner du plaisir seul ou à plusieurs (des conseils, des explications), les fantasmes, les pratiques sexuelles, et plein d\'autres choses...'
	},

	wantHelp_subject_brancheLesPremieresFois: {
		entity: 'subject',
		gazette: 'brancheLesPremieresFois',
		type: 'text',
		content: 'Bien sur il y aura d\'autres sujets mais, évidemment, tu pourras poser plein de questions sur LA première fois ;).\nSpeach t\'aidera à éviter certains pièges et à faire ça bien, à te préparer au mieux pour ce moment!'
	},

	wantHelp_subject_brancheSoiMêmeEtLesAutres: {
		entity: 'subject',
		gazette: 'brancheSoiMêmeEtLesAutres',
		entity: 'subject',
		type: 'text',
		content: 'Un sujet très sensible. Speach te dira jamais que tu es gay ou ce genre de choses. Mais si tu t\'interroge, Speach pourra te guider un peu et t\'aider à te poser les bonnes questions :)'
	},

	wantHelp_subject_branchePréventionEtContraception: {
		entity: 'subject',
		gazette: 'branchePréventionEtContraception',
		type: 'text',
		content: 'C\'est un sujet omniprésent dans le sexe. Les jeunes ne sont pas assez avertis des risques ni des bons usages de précaution, et ne savent pas gérer les conséquences en cas de problème.\n Speach sera alors d\'une grande aide et saura informer mais aussi proposer des solutions, comme :\nQue faire dans l\'urgence si la capote a craqué ?'
	},

	wantHelp_bot: {
		entity: 'bot',
		gazette: '',
		type: 'card',
		content: {
			title: 'Je peux t\'informer sur ces divers sujets',
			buttons: [
				{
					title: 'De quoi il parlera ?',
					type: 'postback',
					value: 'need help dans les branches principales',
				},
				{
					title: 'Pq faire ce bot ?',
					type: 'postback',
					value: 'pourquoi faire ce bot ?',
				},
				{
					title: 'D\'où vient Speach ?',
					type: 'postback',
					value: 'Pourquoi le nom speach ?',
				}
			],
		},
	},

	wantHelp_default: {
		entity: '',
		gazette: '',
		type: 'text',
		content: 'J\'aimerais t\'aider mais j\'ai pas compris ta demande'
	},

/*
 * a card answer for resources requests
*/

	resources_default: {
		entity: '',
		gazette: '',
		type: 'card',
		content: {
			title: 'Je pense que le mieux pour ça est que je te donne le site, tu y trouveras toutes les informations que tu cherches : des infos sur la team qui m\'a crée, sur le projet Speach, un formulaire de contact, quelques prototypes, et surtout en bas de page une brochure complète, regroupant des chiffres issus d\'études, les raisons pour lesquelles ce chatbot doit voir le jour, et bien plus encore :)',
			subtitle: 'Speach.bot website',
			imageUrl: '',
			buttons: [
				{
					title: 'Lien vers le site',
					type: 'web_url',
					value: 'https://speach.bot'
				}
			]
		}
	},

/*
 * a default answer in case no intent is defined
*/
	defaultAnswer: {
		entity: '',
		gazette: '',
		type: 'quickReplies',
		content: {
			title: 'Voici certains sujets dont on peut parler toi et moi ;)',
			buttons: [
				{
					title: 'Sujets principaux de Speach',
					value: 'need help dans les branches principales'
				},
				{
					title: 'Pourquoi faire ce bot ?',
					value: 'poruquoi faire ce bot ?'
				},
				{
					title: 'Quelques chiffres',
					value: 'envoie des chiffres'
				},
				{
					title: 'documentation externe',
					value: 'envoie moi plus d\'informations'
				}
			]
		}
	}
};

function getDbAnswers(res, answer, answer_with_gazette) {
	res.addToLog("getDbAnswers receives: " + answer + " & " + answer_with_gazette);
	if (allAnswers[answer_with_gazette]) {
		res.addToLog("getDbAnswers returns: " + answer_with_gazette);
		return(allAnswers[answer_with_gazette]);
	} else if (allAnswers[answer]) {
		res.addToLog("getDbAnswers returns: " + answer);
		return(allAnswers[answer]);
	} else {
		res.addToLog("getDbAnswers returns: defaultAnswer");
		return(allAnswers['defaultAnswer']);
	}
}


module.exports = {
	getDbAnswers
};
