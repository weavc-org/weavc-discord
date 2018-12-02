import { Message, Client, MessageReaction, User, RichEmbed } from "discord.js";

/**
 * @name Pager
 * @description 
 * Handles embed paging, allowing the user to control which pages they are viewing via reactions
 * @param {Message} msg - Message Model from users request, content, channel, guild etc
 * @param {Client} Client - Bots client class, contains information about the logged in bot 
 * @param {Array<RichEmbed>} Embeds - Embeds to page through
 * @param {PagingOptions} Options - Options to allow control over certain aspects of Paging functionality 
 */
export function Pager(MessageRequest: Message, Client: Client, Embeds: Array<RichEmbed>, Options: PagingOptions = null) {
    
    var m = MessageRequest.content.split(' ');
	let prefix = m.shift();

    if (Options == null || Options == undefined) {
        Options = new PagingOptions();
    }

    var page = Options.startpage.valueOf();

    MessageRequest.channel.send(Embeds[page-1])
        .then(function (message: Message) {
            
            message.react("⬅").then((r) => {
                message.react("➡");
            });

            if (!Options.allowallreactions) {
                var forwardreact = (reaction: MessageReaction, user: User) => reaction.emoji.name === "➡" && user.id == MessageRequest.author.id && message.id == reaction.message.id;
                var backreact = (reaction: MessageReaction, user: User) => reaction.emoji.name === "⬅" && user.id == MessageRequest.author.id && message.id == reaction.message.id;
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

            // triggers 'collect' event on removal of reaction
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
export class PagingOptions {
    timeout: Number = 600000;
    timeoutdelete: Boolean = false;
    allowallreactions: Boolean = false;
    reactionremoval: Boolean = true;
    startpage: Number = 1;
}