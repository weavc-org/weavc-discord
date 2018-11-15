var res_helper = require('../helpers/response');
var config = require('../config');

class help {

    constructor(message, req, client) {
        this.message = message;
        this.req = req;
        this.client = client;
    }

    go(response) {
        var help_response =
            "Prefixs: \n"+ config.prefixs +"\n\n"+
            "Commands:\n"+
            "hello (hi, hey, hoi) - Says hello back\n"+
            "github (git) - Prints the github repo for this bot\n" +
            "play <url> - plays audio from linked youtube video to your current voice channel\n"+
            "play stop - leaves your current voice channel and stops playing music\n"+
            "help (-h) - responds with this help page\n";

        return response(
            res_helper.build(
                res_helper.types.code, help_response)
            );
    }
}
module.exports = help;