
var  res_helper = require('../helpers/response');

class hello {

    constructor(message, req, client) {
        this.message = message;
        this.req = req;
        this.client = client;
        this.routes = [
            { name: 'hello2', alias:['.'], match_case: false }
        ];
    }

    default(response) {
        return response(
            res_helper.build(
                res_helper.types.text, 'Hello ^-^')
            );
    }

    hello2(response) {
        return response(
            res_helper.build(
                res_helper.types.text, 'Just a route to test the routing features')
            );
    }
}
module.exports = hello;