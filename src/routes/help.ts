import { Build, ResponseModel, ResponseTypes, ContentTypes } from '../helpers/response';
import { iRouteClass, iRoute } from '../helpers/router';
import { Message, Client, VoiceConnection, VoiceChannel, RichEmbed } from 'discord.js';
var config = require('../config');

export class Help implements iRouteClass {
    Routes: iRoute[] =[
        { name: 'help2', alias:['2'], matchcase: false, route: this.help2 },
        { name: 'help3', alias:['3'], matchcase: false, route: this.help3 }
    ];

    message: String[];
    req: Message;
    client: Client;

    constructor(
        message: String[], 
        req: Message, 
        client: Client) 
    {
        this.message = message;
        this.req = req;
        this.client = client;
    }

    default(context: Help, response: Function) {
        var HelpPage = new RichEmbed()
            .setColor(0xb5130f)
            .setAuthor(context.client.user.username, context.client.user.avatarURL)
            .setTitle("(( -+-+-+- { Help 1 } -+-+-+- ))") 
            .setDescription("Help page, a list of commands you can use. The reactions below can be used to scroll through pages!")
            .addField("Prefixs", config.prefixs.toString().replace(',', ', '))
            .addField("help (-h) <#>", "Prints this very help page!")
            .addField("hello (hi, hey, hoi)", "Says hello")
            .addField("github (git)", "Link to find me on GitHub")
            .addField("play [stop] | [<url>]", "Have me join your voice channel and play you some youtube audio")
            .setTimestamp(new Date())
            .setFooter("Requested by: " + context.req.author.username + "#" + context.req.author.discriminator + " | From: Help | Page: 1");

        return response(
            Build('', ContentTypes.embed, ResponseTypes.page, HelpPage)
        )
    }

    help2(context: Help, response: Function) {
        var HelpPage = new RichEmbed()
            .setColor(0xb5130f)
            .setAuthor(context.client.user.username, context.client.user.avatarURL)
            .setTitle("(( -+-+-+- { Help 2 } -+-+-+- ))") 
            .setDescription("uhhhh, I have limited functionality at the moment and nothing more to tell you...")
            .setTimestamp(new Date())
            .setFooter("Requested by: " + context.req.author.username + "#" + context.req.author.discriminator + " | From: Help | Page: 2");

        return response(
            Build('', ContentTypes.embed, ResponseTypes.page, HelpPage)
        )
    }

    help3(context: Help, response: Function) {
        var HelpPage = new RichEmbed()
            .setColor(0xb5130f)
            .setAuthor(context.client.user.username, context.client.user.avatarURL)
            .setTitle("(( -+-+-+- { Help 3 } -+-+-+- ))") 
            .setDescription("meow")
            .setTimestamp(new Date())
            .setFooter("Requested by: " + context.req.author.username + "#" + context.req.author.discriminator + " | From: Help | Page: 3");
context
        return response(
            Build('', ContentTypes.embed, ResponseTypes.page, HelpPage)
        )
    }
}