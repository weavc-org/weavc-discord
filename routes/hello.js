
var buildresponse = require('../helpers/response');

class hello {

    constructor() {

    }

    go(message, response) {
        return response(buildresponse('text', 'hello'));
    }
}
module.exports = hello;