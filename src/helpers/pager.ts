import { Message, Client, MessageReaction, User, RichEmbed } from "discord.js";
import { Router } from './router';

/**
 * @name pager
 * @description 
 * Handles embed paging via reactions 
 * 
 * @param {Object} msg - The command message sent by the requesting user
 * @param {Object} client - Discordjs client instance
 * @param {Object} response - The built response with the first embed
 * 
 */
export function Pager(msg: Message, Client: Client, Embeds: Array<RichEmbed>, Options: PagingOptions = null) {
    
    var m = msg.content.split(' ');
	let prefix = m.shift();

    if (Options == null || Options == undefined) {
        Options = new PagingOptions();
    }

    var page = Options.startpage.valueOf();

    msg.channel.send(Embeds[page-1])
        .then(function (message: Message) {
            
            message.react("⬅").then((r) => {
                message.react("➡");
            });

            if (!Options.allowallreactions) {
                var forwardreact = (reaction: MessageReaction, user: User) => reaction.emoji.name === "➡" && user.id == msg.author.id && message.id == reaction.message.id;
                var backreact = (reaction: MessageReaction, user: User) => reaction.emoji.name === "⬅" && user.id == msg.author.id && message.id == reaction.message.id;
            }
            else {
                var forwardreact = (reaction: MessageReaction, user: User) => reaction.emoji.name === "➡" && message.id == reaction.message.id && user.id != Client.user.id;
                var backreact = (reaction: MessageReaction, user: User) => reaction.emoji.name === "⬅" && message.id == reaction.message.id && user.id != Client.user.id;
            }

            var back = message.createReactionCollector(backreact, { time: Options.timeout.valueOf() });
            var forward = message.createReactionCollector(forwardreact, { time: Options.timeout.valueOf() });

            back.on('collect', (r) => {
                page--;
                if (page <= Embeds.length && page >= 1) { 
                    message.edit(Embeds[page-1]);
                }
                else {
                    page++;
                }
            })

            forward.on('collect', (r) => {
                page++;
                if (page <= Embeds.length && page >= 1) { 
                    message.edit(Embeds[page-1]);
                }
                else {
                    page--;
                }
            })

            // trigger 'collect' event on removal of reaction, if valid
            Client.on('messageReactionRemove', (reaction, user) => { 
                if (Options.reactionremoval) {
                    if (!back.ended && back.filter(reaction, user)) { back.emit('collect'); }
                    if (!forward.ended && forward.filter(reaction, user)) { forward.emit('collect'); }
                }
            });

            forward.on('end', (s, reason) => {
                if (Options.timeoutdelete) {
                    message.delete().then((m) => {
                        return;
                    }).catch((err)=> {
                        
                    });
                }
            })

            back.on('end', (s, reason) => {
                if (Options.timeoutdelete) {
                    message.delete().then((m) => {
                        return;
                    }).catch((err)=> {

                    });
                }
            })

        }).catch(function(err) {
            console.log(err);
        });
}

export class PagingOptions {
    timeout: Number = 600000;
    timeoutdelete: Boolean = false;
    allowallreactions: Boolean = false;
    reactionremoval: Boolean = true;
    startpage: Number = 1;
}