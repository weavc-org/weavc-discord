

/**
 * response - Builds up the response which is later formatted.
 * Just text at the moment and very loosely typed
 * @param {String} type 
 * @param {String} message 
 */
function response(type, message) {
	const res = {
		type: type,
		message: message,
	};
	return res;
}

module.exports = response;