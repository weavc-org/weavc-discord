
var buildresponse = require('../helpers/response');

class hello {

    constructor(message, req, client) {
        this.message = message;
        this.req = req;
        this.client = client;
    }

    go(response) {
        return response(buildresponse('text', 'hello'));
    }
}
module.exports = hello;