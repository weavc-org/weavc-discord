var res_helper = require('../helpers/response');
var config = require('../config');

class help {

    constructor(message, req, client) {
        this.message = message;
        this.req = req;
        this.client = client;
        this.routes = [
            { name: 'help2', alias:['2'], match_case: false },
            { name: 'help3', alias:['3'], match_case: false }
        ];
    }

    default(response) {

    var help_response = {
            color: 0xb5130f,
            author: {
                name: this.client.user.username,
                icon_url: this.client.user.avatarURL
            },
            title: "(( -+-+-+- { Help 1 } -+-+-+- ))",
            description: "Help page, a list of commands you can use. The reactions below can be used to scroll through pages!",
            fields: [
            {
                name: "Prefixs",
                value: config.prefixs.toString().replace(',', ', ')
            },
            {
                name: "help (-h) <#>",
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
                name: "play [stop] | [<url>]",
                value: "Use play to have me join your voice channel and play you some youtube audio.",
            }
            ],
            timestamp: new Date(),
            footer: {
                text: "Requested by: " + this.req.author.username + "#" + this.req.author.discriminator + " | From: Help | Page: 1"
            }
        }

        return response(
            res_helper.build(
                res_helper.types.embed, help_response, res_helper.send_types.page)
            );
    }

    help2(response) {
        var help_response = {
            color: 0xb5130f,
            author: {
                name: this.client.user.username,
                icon_url: this.client.user.avatarURL
            },
            title: "(( -+-+-+- { Help 2 } -+-+-+- ))",
            description: "uhhhh, I have limited functionality at the moment and nothing more to tell you...",
            timestamp: new Date(),
            footer: {
                text: "Requested by: " + this.req.author.username + "#" + this.req.author.discriminator + " | From: Help | Page: 2"
            }
        }

        return response(
            res_helper.build(
                res_helper.types.embed, help_response, res_helper.send_types.page)
            );
    }

    help3(response) {
        var help_response = {
            color: 0xb5130f,
            author: {
                name: this.client.user.username,
                icon_url: this.client.user.avatarURL
            },
            title: "(( -+-+-+- { Help 3 } -+-+-+- ))",
            description: "Hi",
            timestamp: new Date(),
            footer: {
                text: "Requested by: " + this.req.author.username + "#" + this.req.author.discriminator + " | From: Help | Page: 3"
            }
        }

        return response(
            res_helper.build(
                res_helper.types.embed, help_response, res_helper.send_types.page)
            );
    }
}
module.exports = help;