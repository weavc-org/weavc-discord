
var router = require('./router');

/**
 * @name pager
 * @description Handles embed paging via reactions 
 * 
 * @param {Object} msg - The command message sent by the requesting user
 * @param {Object} client - Discordjs client instance
 * @param {Object} response - The built response with the first embed
 * 
 */
function pager(msg, client, response) {
    msg.channel.send(response.message)

        .then(function (message) {

            message.react("⬅").then(r => {
                message.react("➡");
            });

            var forwardreact = (reaction, user) => reaction.emoji.name === "➡" && user.id == msg.author.id;
            var backreact = (reaction, user) => reaction.emoji.name === "⬅" && user.id == msg.author.id;

            var back = message.createReactionCollector(backreact, { time: 60000 });
            var forward = message.createReactionCollector(forwardreact, { time: 60000 });

            back.on('collect', (r) => {
                var model = parsefooter(message.embeds[0].footer.text);
                message[1] = (parseInt(model.page) -1)+'';
                router(message, msg, client, (response) => {
                    message.edit(response.message);
                })
            })

            forward.on('collect', (r) => {
                var model = parsefooter(message.embeds[0].footer.text);
                message[1] = (parseInt(model.page) +1)+'';
                router(message, msg, client, (response) => {
                    message.edit(response.message);
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


function parsefooter(footer) {
    var model = {};
    var footersplit = footer.split(' | ');
    footersplit.forEach(element => {
        elementsplit = element.split(': ');
        model[elementsplit[0].toLowerCase()] = elementsplit[1].toLowerCase();
    });
    return model;
}

module.exports = pager;