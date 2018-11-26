"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * @name Pager
 * @description
 * Handles embed paging, allowing the user to control which pages they are viewing via reactions
 * @param {Message} msg - Message Model from users request, content, channel, guild etc
 * @param {Client} Client - Bots client class, contains information about the logged in bot
 * @param {Array<RichEmbed>} Embeds - Embeds to page through
 * @param {PagingOptions} Options - Options to allow control over certain aspects of Paging functionality
 */
function Pager(msg, Client, Embeds, Options = null) {
    var m = msg.content.split(' ');
    let prefix = m.shift();
    if (Options == null || Options == undefined) {
        Options = new PagingOptions();
    }
    var page = Options.startpage.valueOf();
    msg.channel.send(Embeds[page - 1])
        .then(function (message) {
        message.react("⬅").then((r) => {
            message.react("➡");
        });
        if (!Options.allowallreactions) {
            var forwardreact = (reaction, user) => reaction.emoji.name === "➡" && user.id == msg.author.id && message.id == reaction.message.id;
            var backreact = (reaction, user) => reaction.emoji.name === "⬅" && user.id == msg.author.id && message.id == reaction.message.id;
        }
        else {
            var forwardreact = (reaction, user) => reaction.emoji.name === "➡" && message.id == reaction.message.id && user.id != Client.user.id;
            var backreact = (reaction, user) => reaction.emoji.name === "⬅" && message.id == reaction.message.id && user.id != Client.user.id;
        }
        var back = message.createReactionCollector(backreact, { time: Options.timeout.valueOf() });
        var forward = message.createReactionCollector(forwardreact, { time: Options.timeout.valueOf() });
        back.on('collect', (r) => {
            page--;
            if (page <= Embeds.length && page >= 1) {
                message.edit(Embeds[page - 1]);
            }
            else {
                page++;
            }
        });
        forward.on('collect', (r) => {
            page++;
            if (page <= Embeds.length && page >= 1) {
                message.edit(Embeds[page - 1]);
            }
            else {
                page--;
            }
        });
        // trigger 'collect' event on removal of reaction, if valid
        Client.on('messageReactionRemove', (reaction, user) => {
            if (Options.reactionremoval) {
                if (!back.ended && back.filter(reaction, user)) {
                    back.emit('collect');
                }
                if (!forward.ended && forward.filter(reaction, user)) {
                    forward.emit('collect');
                }
            }
        });
        forward.on('end', (s, reason) => {
            if (Options.timeoutdelete) {
                message.delete().then((m) => {
                    return;
                }).catch((err) => {
                });
            }
        });
        back.on('end', (s, reason) => {
            if (Options.timeoutdelete) {
                message.delete().then((m) => {
                    return;
                }).catch((err) => {
                });
            }
        });
    }).catch(function (err) {
        console.log(err);
    });
}
exports.Pager = Pager;
/**
 * @name PagingOptions
 * @description
 * Allows for custom settings/options to be set for each paging instance
 * @var timeout - Period of time to track reactions for
 * @var timeoutdelete - deletes embed after timeout
 * @var allowallreactions - Allows everyone to control the paging, not just the requesting user
 * @var reactionremoval - Removing a reaction also triggers 'collect' event
 * @var startpage - page that user will start on
 */
class PagingOptions {
    constructor() {
        this.timeout = 600000;
        this.timeoutdelete = false;
        this.allowallreactions = false;
        this.reactionremoval = true;
        this.startpage = 1;
    }
}
exports.PagingOptions = PagingOptions;