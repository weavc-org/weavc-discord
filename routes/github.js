
var res_helper = require('../helpers/response');

class github {

    constructor(message, req, client) {
        this.message = message;
        this.req = req;
        this.client = client;
    }

    go(response) {
        return response(
            res_helper.build(
                res_helper.types.text, 'https://github.com/ChrisWeaver1/discord-bot')
            );
    }
}
module.exports = github;