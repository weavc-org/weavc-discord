
class response_helper {

	constructor() {
		this.types = { text:'text', code:'code', embed:'embed' };
		this.send_types = { send: 'send', reply: 'reply', page: 'page' };

		this.embed_model = {};
	}

	/**
	 * Builds message from given type
	 * only supports types in this.types
	 * @param {types} type 
	 * @param {string} message - might change into object at later date 
	 */
	build(type, message, sendtype) {
		var send_type = 'reply';
		if (Object.keys(this.send_types).includes(sendtype)) { 
			send_type = sendtype;
		}

		if (!Object.keys(this.types).includes(type)) { 
			return { type: 'text', message: message, send: send_type };
		}

		const res = {
			type: type,
			send: send_type,
		};
		res.message = this[type](message);
		return res;
	}

	text(message) { return message; }
	code(message) { return '```'+message+'```'; }
	//embed(message) { return this.build_embed(message); }

	embed(model) {
		this.embed_model = { 'embed': model };
		return this.embed_model;
	}
}

module.exports = new response_helper();