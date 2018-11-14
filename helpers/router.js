
const hello = require('../routes/hello');
const help = require('../routes/help')

var routes = {
	'hello': hello,
	'help': help,
}

/**
 * router
 * @param {String} message - the message array. First index ([0]) is the command.
 * @returns {Function} returns correct routing class for given command. help by default.
 */
function router(message, res) {
	var route = new routes[message[0].toLowerCase()];
	if (route === undefined) route = new routes.help;

	route.go(message, (response) => {
		res(response);
	})
 }

module.exports = router;