"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
const lib_1 = require("../../../../lib/");
/**
 * @name Help
 * @description
 * Help routing class.
 * Sends help pages back to the requesting channel.
 * Handled by Pager.
 *
 * @function
 */
exports.Help = (Args, MessageRequest, Client) => {
    var page = Args[1];
    if (page == undefined) {
        page = '1';
    }
    var HelpPage = new discord_js_1.RichEmbed()
        .setColor(0xb5130f)
        .setAuthor(Client.user.username, Client.user.avatarURL)
        .setTitle("(( -+-+-+- { Help 1 } -+-+-+- ))")
        .setDescription("Help page, a list of commands you can use. The reactions below can be used to scroll through pages!")
        .addField("Prefixs", "M:, m:")
        .addField("help (-h) <#>", "Prints this very help page!")
        .addField("hello (hi, hey, hoi)", "Says hello")
        .addField("github (git)", "Link to find me on GitHub")
        .addField("play [stop] | [<url>]", "Have me join your voice channel and play you some youtube audio")
        .setTimestamp(new Date())
        .setFooter("Requested by: " + MessageRequest.author.username + "#" + MessageRequest.author.discriminator + " | From: Help | Page: 1");
    var HelpPage2 = new discord_js_1.RichEmbed()
        .setColor(0xb5130f)
        .setAuthor(Client.user.username, Client.user.avatarURL)
        .setTitle("(( -+-+-+- { Help 2 } -+-+-+- ))")
        .setDescription("Player (player, play, p) - Youtube audio playback")
        .addField("<url>", "Adds youtube video to your guilds queue.")
        .addField("queue (q)", "Shows your guilds queue of videos")
        .addField("join (j, play, p)", "Joins the requesting guild members voice channel and starts playing queue.")
        .addField("stop (s)", "Halts playback and leaves voice channel.")
        .addField("clear (c)", "Clears your guilds queue.")
        .addField("skip", "Removes the song currently playing/ ready to play from the queue.")
        .setTimestamp(new Date())
        .setFooter("Requested by: " + MessageRequest.author.username + "#" + MessageRequest.author.discriminator + " | From: Help | Page: 2");
    var HelpPage3 = new discord_js_1.RichEmbed()
        .setColor(0xb5130f)
        .setAuthor(Client.user.username, Client.user.avatarURL)
        .setTitle("(( -+-+-+- { Help 3 } -+-+-+- ))")
        .setDescription("meow")
        .setTimestamp(new Date())
        .setFooter("Requested by: " + MessageRequest.author.username + "#" + MessageRequest.author.discriminator + " | From: Help | Page: 3");
    var embeds = [HelpPage, HelpPage2, HelpPage3];
    var options = new lib_1.PagingOptions();
    options.allowallreactions = true;
    options.timeout = 100000;
    options.reactionremoval = true;
    options.startpage = 1;
    options.timeoutdelete = false;
    lib_1.Pager(MessageRequest, Client, embeds, options);
};
