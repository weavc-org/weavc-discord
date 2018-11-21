import { Message, Client, MessageReaction, User } from "discord.js";
import { ResponseModel } from "./response";
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
export function Pager(msg: Message, Client: Client, Response: ResponseModel) {
    
    var m = msg.content.split(' ');
	let prefix = m.shift();
    
    var page = 1;
    var startPage = parseInt(Response.message);
    if (startPage != NaN && startPage >= 1 && startPage <= Response.embeds.length) {
        page = startPage;
    }

    msg.channel.send(Response.embeds[page-1])
        .then(function (message: Message) {
            
            message.react("⬅").then((r) => {
                message.react("➡");
            });

            var forwardreact = (reaction: MessageReaction, user: User) => reaction.emoji.name === "➡" && user.id == msg.author.id && message.id == reaction.message.id;
            var backreact = (reaction: MessageReaction, user: User) => reaction.emoji.name === "⬅" && user.id == msg.author.id && message.id == reaction.message.id;

            var back = message.createReactionCollector(backreact, { time: 60000 });
            var forward = message.createReactionCollector(forwardreact, { time: 60000 });

            back.on('collect', (r) => {
                page--;
                if (page <= Response.embeds.length && page >= 1) { 
                    message.edit(Response.embeds[page-1]);
                }
                else {
                    page++;
                }
            })

            forward.on('collect', (r) => {
                page++;
                if (page <= Response.embeds.length && page >= 1) { 
                    message.edit(Response.embeds[page-1]);
                }
                else {
                    page--;
                }
            })

            // trigger 'collect' event on removal of reaction, if valid
            Client.on('messageReactionRemove', (reaction, user) => { 
                if (!back.ended && back.filter(reaction, user)) { back.emit('collect'); }
                if (!forward.ended && forward.filter(reaction, user)) { forward.emit('collect'); }
            });

            forward.on('end', (s, reason) => {
                message.delete().then((m) => {
                    return;
                }).catch((err)=> {
                    
                });
            })

            back.on('end', (s, reason) => {
                message.delete().then((m) => {
                    return;
                }).catch((err)=> {

                });
            })

        }).catch(function(err) {
            console.log(err);
        });
}