
var  res_helper = require('../helpers/response');

class hello {

    constructor(message, req, client) {
        this.message = message;
        this.req = req;
        this.client = client;
    }

    go(response) {
        return response(
            res_helper.build(
                res_helper.types.text, 'Hello ^-^')
            );
    }
}
module.exports = hello;