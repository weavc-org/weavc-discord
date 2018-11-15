
/**
 * class router
 * @param {Array} routes - The provided routes for controller
 * @param {Object} command - the command to match with routes
 * @returns {Sting} returns the name attached with the chosen route
 */
function class_router(routes, command) {

	for (var i = 0; i < routes.length; i++) {
		if (command === undefined) break;
		if (!routes[i].match_case) { 
			command = command.toLowerCase(); 
			for (var x = 0; x < routes[i].alias; x++) {
				routes[i].alias[x] = routes[i].alias[x].toLowerCase();
			}
		}

		if (routes[i].alias.includes(command)) {
			return routes[i].name;
		}
	}

	return routes[0].name;
 }

module.exports = class_router;