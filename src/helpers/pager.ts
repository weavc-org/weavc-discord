import { Message, Client, MessageReaction, User } from "discord.js";
import { ResponseModel } from "./response";
import { Router } from './router';

/**
 * @name pager
 * @description Handles embed paging via reactions 
 * 
 * @param {Object} msg - The command message sent by the requesting user
 * @param {Object} client - Discordjs client instance
 * @param {Object} response - The built response with the first embed
 * 
 */
export function Pager(msg: Message, client: Client, response: ResponseModel) {
    
    var m = msg.content.split(' ');
	let prefix = m.shift();
    msg.channel.send(response.embed)
        .then(function (message: Message) {

            message.react("⬅").then((r) => {
                message.react("➡");
            });

            var forwardreact = (reaction: MessageReaction, user: User) => reaction.emoji.name === "➡" && user.id == msg.author.id;
            var backreact = (reaction: MessageReaction, user: User) => reaction.emoji.name === "⬅" && user.id == msg.author.id;

            var back = message.createReactionCollector(backreact, { time: 60000 });
            var forward = message.createReactionCollector(forwardreact, { time: 60000 });

            back.on('collect', (r) => {
                var model: iParsedFooter = parsefooter(message.embeds[0].footer.text);
                m[1] = (parseInt(model.page) -1)+'';
                Router(m, msg, client, (response: ResponseModel) => {
                    message.edit(response.embed);
                })
            })

            forward.on('collect', (r) => {
                var model = parsefooter(message.embeds[0].footer.text);
                m[1] = (parseInt(model.page) +1)+'';
                Router(m, msg, client, (response: ResponseModel) => {
                    message.edit(response.embed);
                })
            })

            client.on('messageReactionRemove', (reaction, user) => { 
                if (!back.ended && back.filter(reaction, user)) { back.emit('collect'); }
                if (!forward.ended && forward.filter(reaction, user)) { forward.emit('collect'); }
            });

        }).catch(function(err) {
            console.log(err);
        });
}


function parsefooter(footer:String) : iParsedFooter {
    var model: iParsedFooter = {
        from: '',
        page: ''
    };
    var footersplit = footer.split(' | ');
    footersplit.forEach(element => {
        var elementsplit = element.split(': ');
        if (elementsplit[0].toLowerCase() == 'page') model.page = elementsplit[1];
        if (elementsplit[0].toLowerCase() == 'from') model.from = elementsplit[1];
    });
    return model;
}

interface iParsedFooter {
    from: string,
    page:  string
}