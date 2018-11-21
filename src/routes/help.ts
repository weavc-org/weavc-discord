import { ResponseModel, ResponseTypes, ContentTypes } from '../helpers/response';
import { iRouteClass, iRoute } from '../helpers/router';
import { Message, Client, VoiceConnection, VoiceChannel, RichEmbed } from 'discord.js';
import { Config, ConfigModel } from '../helpers/config';
var config = new Config();

export class Help implements iRouteClass {
    Routes: iRoute[] =[];

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

        var page = context.message[1];
        if (page == undefined) {
            page = '1';
        }

        var HelpPage = new RichEmbed()
            .setColor(0xb5130f)
            .setAuthor(context.client.user.username, context.client.user.avatarURL)
            .setTitle("(( -+-+-+- { Help 1 } -+-+-+- ))") 
            .setDescription("Help page, a list of commands you can use. The reactions below can be used to scroll through pages!")
            .addField("Prefixs", config.prefixes.toString().replace(',', ', '))
            .addField("help (-h) <#>", "Prints this very help page!")
            .addField("hello (hi, hey, hoi)", "Says hello")
            .addField("github (git)", "Link to find me on GitHub")
            .addField("play [stop] | [<url>]", "Have me join your voice channel and play you some youtube audio")
            .setTimestamp(new Date())
            .setFooter("Requested by: " + context.req.author.username + "#" + context.req.author.discriminator + " | From: Help | Page: 1");

        var HelpPage2 = new RichEmbed()
            .setColor(0xb5130f)
            .setAuthor(context.client.user.username, context.client.user.avatarURL)
            .setTitle("(( -+-+-+- { Help 2 } -+-+-+- ))") 
            .addField("nhentai (n, nh) [gallery id] | <random>", "Share your favourite nhentai doujinshis")
            .setTimestamp(new Date())
            .setFooter("Requested by: " + context.req.author.username + "#" + context.req.author.discriminator + " | From: Help | Page: 2");

        var HelpPage3 = new RichEmbed()
            .setColor(0xb5130f)
            .setAuthor(context.client.user.username, context.client.user.avatarURL)
            .setTitle("(( -+-+-+- { Help 3 } -+-+-+- ))") 
            .setDescription("meow")
            .setTimestamp(new Date())
            .setFooter("Requested by: " + context.req.author.username + "#" + context.req.author.discriminator + " | From: Help | Page: 3");

        var embeds: Array<RichEmbed> = [HelpPage, HelpPage2, HelpPage3]

        return response(
            new ResponseModel(page, ContentTypes.embed, ResponseTypes.page, embeds)
        )
    }
}