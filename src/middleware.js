// finished(err, res);
// middlewareObject = { functions: [], finished: function() }

/*
 * inits middlewareObject which contains : the array of functions we'll use, an stop-out function
*/
function createMiddleware(finished)
{
	let middlewareObject = {};
	middlewareObject.functions = [];
	middlewareObject.finished = finished;
	return middlewareObject;
}

/*
 * add a function in my midObj (mid.functions array of functions)
*/
function addMiddleware(middlewareToAdd, middlewareObject)
{
	middlewareObject.functions.push(middlewareToAdd);
}

/*
 * fulfill res.middleware and run chain
*/
function startMiddlewaresChain(body, res, middlewareObject)
{
	if (!middlewareObject || !middlewareObject.functions || !middlewareObject.finished)
		return false;

	res.middleware = middlewareObject;
	res.middleware.id = -1;
	res.middleware.error = null;
	res.log = 'LOG :';
	res.addToLog = (comment) => {
		res.log = res.log + '\n' + comment;
	};

	runEachMiddleware(body, res, true);
}

/*
* Core function : runs the array of middlewares until it arrives to the finished function.
*/
function runEachMiddleware(body, res, toContinue)
{
	if (!res.middleware)
		return false;
	else
		++res.middleware.id;

	if (res.middleware.error)
	{
		res.middleware.finished(body, true, res); // should return res.middleware.error ?
		return;
	}

	if (!toContinue || res.middleware.id >= res.middleware.functions.length)
	{
		res.middleware.finished(body, null, res);
		return;
	}

	res.middleware.functions[res.middleware.id](body, res, runEachMiddleware)
}

module.exports = {
	create: createMiddleware,
	add: addMiddleware,
	run: startMiddlewaresChain
};
