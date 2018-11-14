
class response_helper {

	constructor() {
		this.types = {text:'text', code:'code'};
	}

	/**
	 * Builds message from given type
	 * only supports types in this.types
	 * @param {types} type 
	 * @param {string} message - might change into object at later date 
	 */
	build(type, message) {
		if (!Object.keys(this.types).includes(type)) { 
			return { type: 'text', message: message};
		}

		const res = {
			type: type,
		};

		res.message = this[type](message);
		return res;
	}

	text(message) { return message; }
	code(message) { return '```'+message+'```'; }

}

module.exports = new response_helper();