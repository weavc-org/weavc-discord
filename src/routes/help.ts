import { iRouteClass, iRoute } from '../helpers/router';
import { Message, Client, VoiceConnection, VoiceChannel, RichEmbed } from 'discord.js';
import { Config, ConfigModel } from '../helpers/config';
import { PagingOptions, Pager } from '../helpers/pager';
var config = new Config();


/**
 * @name Help
 * @class
 * @description 
 * Help routing class.
 * Handles any message requests matching the help routes alias'.
 * 
 * @alias help, h
 * @function default - 
 * default route for messages not containing a secondary matching command.
 * Sends help pages to requested channel. Handled by Pager.
 * @default
 */
export class Help implements iRouteClass {
    Routes: iRoute[] =[];

    Message: String[];
    MessageRequest: Message;
    Client: Client;

    constructor(
        Message: String[], 
        MessageRequest: Message, 
        Client: Client) 
    {
        this.Message = Message;
        this.MessageRequest = MessageRequest;
        this.Client = Client;
    }

    default(context: Help) {

        var page = context.Message[1];
        if (page == undefined) {
            page = '1';
        }

        var HelpPage = new RichEmbed()
            .setColor(0xb5130f)
            .setAuthor(context.Client.user.username, context.Client.user.avatarURL)
            .setTitle("(( -+-+-+- { Help 1 } -+-+-+- ))") 
            .setDescription("Help page, a list of commands you can use. The reactions below can be used to scroll through pages!")
            .addField("Prefixs", config.prefixes.toString().replace(',', ', '))
            .addField("help (-h) <#>", "Prints this very help page!")
            .addField("hello (hi, hey, hoi)", "Says hello")
            .addField("github (git)", "Link to find me on GitHub")
            .addField("play [stop] | [<url>]", "Have me join your voice channel and play you some youtube audio")
            .setTimestamp(new Date())
            .setFooter("Requested by: " + context.MessageRequest.author.username + "#" + context.MessageRequest.author.discriminator + " | From: Help | Page: 1");

        var HelpPage2 = new RichEmbed()
            .setColor(0xb5130f)
            .setAuthor(context.Client.user.username, context.Client.user.avatarURL)
            .setTitle("(( -+-+-+- { Help 2 } -+-+-+- ))") 
            .addField("nhentai (n, nh) [gallery id] | <random>", "Share your favourite nhentai doujinshis")
            .setTimestamp(new Date())
            .setFooter("Requested by: " + context.MessageRequest.author.username + "#" + context.MessageRequest.author.discriminator + " | From: Help | Page: 2");

        var HelpPage3 = new RichEmbed()
            .setColor(0xb5130f)
            .setAuthor(context.Client.user.username, context.Client.user.avatarURL)
            .setTitle("(( -+-+-+- { Help 3 } -+-+-+- ))") 
            .setDescription("meow")
            .setTimestamp(new Date())
            .setFooter("Requested by: " + context.MessageRequest.author.username + "#" + context.MessageRequest.author.discriminator + " | From: Help | Page: 3");

        var embeds: Array<RichEmbed> = [HelpPage, HelpPage2, HelpPage3]

        var options = new PagingOptions();
        options.allowallreactions=true;
        options.timeout=100000;
        options.reactionremoval=true;
        options.startpage=1;
        options.timeoutdelete = false;


        Pager(context.MessageRequest, context.Client, embeds, options);
    }
}