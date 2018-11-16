
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

	var route = undefined;
	var route_ = undefined;

	/**
	 * initial command
	 * cycles through the routes defined at top of this document.
	 * matches first arg of user message to an alias of the route.
	 * defaults to first index of routes (routes[0])
	 */
	if (message[0]) {
		routes.forEach((r) => {
			let initial_command = message[0];
			if (!r.match_case) { r.alias = matchcase_false(r.alias); initial_command = initial_command.toLowerCase(); }
			if (r.alias.includes(initial_command)) {
				route = new r.route(message, req, client);
			}
		})
	}
	if (route == undefined) { route = new routes[0].route(message, req, client); }

	/**
	 * secondary command
	 * cycles through routes in matched route class
	 * matches second arg of user message to an alias in class routes
	 * defaults to route.default function
	 */
	if (message[1]) {
		route.routes.forEach((r) => {
			let secondary_command = message[1];
			if (!r.match_case) { r.alias = matchcase_false(r.alias); secondary_command = secondary_command.toLowerCase(); }
			if (r.alias.includes(secondary_command)) {
				route_ = r.name;
			}
		});
	}
	if (route_ == undefined) { route_ = 'default' }

	//execute matched route, wait for response
	route[route_]((response) => {
		res(response);
	})
 }

 function matchcase_false(array) {
	for (var x = 0; x < array.length; x++) {
		array[x] = array[x].toLowerCase();
	}
	return array;
 }

module.exports = router;