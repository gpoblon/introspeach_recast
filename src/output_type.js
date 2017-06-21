function getObjectType(objType, output, count, toReturn) {
	let fullObject = {
		text: {
			text: output.text,
		},
		quick_replies: {
			text: output.text,
			quick_replies: [
				{
					content_type: output[count].type,
					title: output[count].text,
					payload: output[count].payload
				},
			]
		},
		"image": {
			"attachment": {
				"type": "image",
				"payload": {
					"url": output.url
				}
			}
		},
		"video": {
			"attachment": {
				"type": "video",
				"payload": {
					"url": output.url
				}
			}
		},
		"audio": {
			"attachment": {
				"type": "audio",
				"payload": {
					"url": output.url
				}
			}
		},
		"file": {
			"attachment": {
				"type": "file",
				"payload": {
					"url": output.url
				}
			}
		},
		"buttons_url": {
			"buttons": [
				{
					"type": "web_url",
					"url": output[count].url,
					"title": output[count].title
				}
			],
		},
		"buttons_call": {
			"buttons": [
				{
					"type": "phone_number",
					"title": output[count].title,
					"payload": output[count].number,
				}
			],
		}
	};
	if (toReturn == 'full_object') {
		return (fullObject[objType]);
	} else if (toReturn == 'push_array') {
		return (fullObject[objType][objType][0]);
	}
};

function parseOutput(output) {
	let count = 0;
	let objType = getObjectType(output.type, output, count, 'full_object');

	while (output[++count].text != '' && (output.type == 'quick_replies'|| output.type == 'buttons'))
	{
		objType.quick_replies[count] = getObjectType(output.type, output, count, 'push_array')
	}
	console.log("\n== Final Object ==\n" + JSON.stringify(objType, null, 4) + "\n----");
	return (objType);
};

module.exports = {
	parseOutput
};
