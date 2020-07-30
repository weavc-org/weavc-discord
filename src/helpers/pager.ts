import { Message, Client, MessageReaction, User, MessageEmbed, CollectorFilter } from "discord.js";

export function Pager(MessageRequest: Message, Client: Client, Embeds: Array<MessageEmbed>, Options: PagingOptions = null) {
    
    var m = MessageRequest.content.split(' ');

    if (Options == null || Options == undefined) {
        Options = new PagingOptions();
    }

    var page = Options.startpage.valueOf();

    MessageRequest.channel.send(Embeds[page-1])
        .then(function (message: Message) {
            
            message.react("⬅");
            message.react("➡");

            var react = (reaction, user) => message.id == reaction.message.id && user.id != Client.user.id;
            if (!Options.allowallreactions) {
                var react = (reaction, user) => user.id === MessageRequest.author.id && message.id == reaction.message.id;
            }

            var collector = message.createReactionCollector(react, { time: Options.timeout.valueOf() });

            let h = (r: MessageReaction, u: User) => {
                if (r.emoji.name == "➡") {
                    page++;
                    if (page <= Embeds.length && page >= 1) { 
                        r.message.edit(Embeds[page-1]);
                    }
                    else {
                        page--;
                    }
                }
                else if (r.emoji.name == "⬅") {
                    page--;
                    if (page <= Embeds.length && page >= 1) { 
                        r.message.edit(Embeds[page-1]);
                    }
                    else {
                        page++;
                    }
                }
            }

            collector.on('collect', h)

            // triggers 'collect' event on removal of reaction
            Client.on('messageReactionRemove', (reaction, user : User) => { 
                if (!collector.ended && collector.filter(reaction, user)) { h(reaction, user) }
                if (Options.reactionremoval) {
                }
            });

            collector.on('end', (s, reason) => {
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