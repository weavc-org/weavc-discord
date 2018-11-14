var buildresponse = require('../helpers/response');

class help {

    constructor() {

    }

    go(message, response) {
        return response(buildresponse('text', 'help'));
    }
}
module.exports = help;