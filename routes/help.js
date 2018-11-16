var res_helper = require('../helpers/response');
var config = require('../config');

class help {

    constructor(message, req, client) {
        this.message = message;
        this.req = req;
        this.client = client;
        this.routes = [];
    }

    default(response) {
        // var help_response =
        //     "Prefixs: \n"+ config.prefixs +"\n\n"+
        //     "Commands:\n"+
        //     "hello (hi, hey, hoi) - Says hello back\n"+
        //     "github (git) - Prints the github repo for this bot\n" +
        //     "play <url> - plays audio from linked youtube video to your current voice channel\n"+
        //     "play stop - leaves your current voice channel and stops playing music\n"+
        //     "help (-h) - responds with this help page\n";

    var help_response = {
            color: 0xb5130f,
            author: {
                name: this.client.user.username,
                icon_url: this.client.user.avatarURL
            },
            title: "(( -+-+-+- { Help } -+-+-+- ))",
            description: "Prefixs: " + config.prefixs.toString().replace(',', ', ') +
                            "\n**(( -+-+-+- { Commands } -+-+-+- ))**",
            fields: [
            {
                name: "help (-h)",
                value: "Prints this very help page!"
            },
            {
                name: "hello (hi, hey, hoi)",
                value: "Says hello"
            },
            {
                name: "github (git)",
                value: "I'm open source, you can get a link to the repo here"
            },
            {
                name: "play",
                value: "<url>: Plays audio from the linked youtube video in your current voice channel\n"+
                        "stop: Stops playing music and leaves the channel",
            }
            ],
            timestamp: new Date(),
            footer: {
                text: "\nRequested by: " + this.req.author.username + "#" + this.req.author.discriminator
            }
        }

        return response(
            res_helper.build(
                res_helper.types.embed, help_response, res_helper.send_types.send)
            );
    }
}
module.exports = help;