# introspeach_recast

This repo contains my first chatbot powered by recast.ai.

It is supposed to introduce another chatbot (Speach) which will be the main projet.

Speach is a teenagers sexual conversational assistant. It allows boys and girls from 13 to 18 to healthily discover and manage their firsts steps into sexuality, IE risks prevention, pleasure, first time, dealing with attraction and love and sex, harassment, and so on.

Anyway IntroSpeach has a main mission : introduce Speach and what it does to people. I might later split conversational features depending on whether it is talking with a kid or his parents.
The secondary mission of this bot is a market reseach to ensure we're dealing with this society issue the right way.

I'm using recast mainly as a NLP service but I will use its bot builder to have a better understanding of the way it handles things.

Why using only NLP features ?
Most bots are used as customers service : reserving a flight, a restaurant table, a train for example. Some have a more complex or specific usage : companies intern bots, cultural or fasion ones.
But only a few bots are developped for conversational usage and I don't even know any bot that can properly hold a conversation about as much topics we want to cover.
For that, we'll need an homemade builder. We'll develop our own interface which will be used by psychologists, sexologists for exemple to fulfill our gigantic tree of topics.


TWO BRANCHES:
- Master hasn't received much love yet. It's a simple recast.ai bot using their servers, their NLP, and their builder. I'll work on it to get a simple conversational bot ASAP.

- Scratch on the other hand is powered on my own server, webhooked with FB on a secured domain of mine and uses only the core feature of recast : it's NLP. The way my bot will respond is entirely depending on my code.
Details and explanations :

Example :
 * FB_INPUT : Bonjour (string) is sent to recast NLP API (text_analysis).
 * Recast returns a json which contains a greeting intent (could be entites and other markers I set depending on the input) 
 * This json is sent to a tmp_db functions list which looks for a matching answer
 * I send back my Object to sendAnswerBack(ObjectAnswer) => outputs properly into messenger.
 *
 * Note that I can pretty much send anything I want to facebook : a quick_reply, text, picture and so on.

Caution : the final Object is parsed by a homemade parser.
The standard output (JSON) of this parser  looks like this :

{
        "type": "text",
        "text": "Je suis désolé, je suis encore jeune et travaille dur pour mieux te comprendre !",
        "title": "",
        "url": "",
        "0": {
                "type": "text",
                "text": "",
                "payload": "",
                "url": ""
        },
        "1": {
                "type": "text",
                "text": "",
                "payload": "",
                "url": ""
        },
        "2": {
                "type": "text",
                "text": "",
                "payload": "",
                "url": ""
        },
        "3": {
                "type": "text",
                "text": "",
                "payload": "",
                "url": ""
        },
        "4": {
                "type": "text",
                "text": "",
                "payload": "",
                "url": ""
        },
        "5": {
                "type": "text",
                "text": "",
                "payload": "",
                "url": ""
        },
        "6": {
                "type": "text",
                "text": "",
                "payload": "",
                "url": ""
        },
        "7": {
                "type": "text",
                "text": "",
                "payload": "",
                "url": ""
        }
}

it's all based on placeholders : your finalObject will be merged with Standard one, so you don't have to worry about forget an input required by facebook API.
0 / 1 / 2... are buttons/quick_replies answers. I did set a limit to 7 for UX readibility reasons. OFC You can have only 1 qr/button.

A few examples of my final outputObject:
- a simple text message:
{
    text: "text_to_send"
}

- quick_replies
{
    text: "EXAMPLE OF QUICK_REPLY",
    type: "quick_replies",
    0: {
        text: "qr_1",
        payload: "what you decide to send back as text analysis to recast API"
    },
    1: {
        text: "qr_2",
        payload: "what you decide to send back as text analysis to recast API"
    }
}

- an image 
{
   type: "image",
   url: "http://...."
}
