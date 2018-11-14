
const hello = require('../routes/hello');
const help = require('../routes/help');
const play = require('../routes/play');
const github = require('../routes/play');

var routes = {
	'hello': hello,
	'help': help,
	'play': play,
	'github': github,
}

/**
 * router
 * @param {String} message - the message array. First index ([0]) is the command.
 * @returns {Function} returns correct routing class for given command. help by default.
 */
function router(message, req, client, res) {
	var route = new routes[message[0].toLowerCase()](message, req, client);
	if (route === undefined) route = new routes.help(message, req, client);

	route.go((response) => {
		res(response);
	})
 }

module.exports = router;