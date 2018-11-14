
var buildresponse = require('../helpers/response');

class github {

    constructor(message, req, client) {
        this.message = message;
        this.req = req;
        this.client = client;
    }

    go(response) {
        return response(buildresponse('text', 'https://github.com/ChrisWeaver1/discord-bot'));
    }
}
module.exports = github;