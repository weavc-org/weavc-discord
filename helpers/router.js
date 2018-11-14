
var routes = [
	{ name:'default', route: require('../routes/help'), alias: [], match_case: false, description: 'Default route. index 0'},
	{ name:'hello', route: require('../routes/hello'), alias: ['hello', 'hi', 'hey', 'hoi'], match_case: false },
	{ name:'help', route: require('../routes/help'), alias: ['help', '-h'], match_case: false },
	{ name:'play', route: require('../routes/play'), alias: ['play'], match_case: false },
	{ name:'github', route: require('../routes/github'), alias: ['git', 'github'], match_case: false },
]

/**
 * router
 * @param {Array} message - the message array. First index ([0]) is the command
 * @param {Object} req - The request object
 * @param {Object} client - Discord.js client 
 * @param {Function} res - callback function. Takes response object as parameter
 * @returns {Object} response - The response object, built by response_helper class
 */
function router(message, req, client, res) {

	var route;
	for (var i = 0; i < routes.length; i++) {
		var command = message[0];
		if (command === undefined) break;
		if (!routes[i].match_case) { 
			command = command.toLowerCase(); 
			for (var x = 0; x < routes[i].alias; x++) {
				routes[i].alias[x] = routes[i].alias[x].toLowerCase();
			}
		}

		if (routes[i].alias.includes(command)) {
			route = new routes[i].route(message, req, client);
		}
	}

	if (route === undefined) route = new routes[0].route(message, req, client);

	route.go((response) => {
		res(response);
	})
 }

module.exports = router;