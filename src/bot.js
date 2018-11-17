"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const response_1 = require("./helpers/response");
const config = require('./config');
const pager_1 = require("./helpers/pager");
const router_1 = require("./helpers/router");
const Discord = require('discord.js');
const client = new Discord.Client();
client.on('ready', () => {
    console.log(`Logged in as ${client.user.tag}!`);
});
client.on('message', (msg) => {
    var message = msg.content.split(' ');
    let prefix = message.shift();
    if (!config.prefixs.some((p) => p === prefix))
        return;
    router_1.Router(message, msg, client, (response) => {
        if (response.responsetype == response_1.ResponseTypes.reply)
            msg.reply(response.message);
        if (response.responsetype == response_1.ResponseTypes.send)
            msg.channel.send(response.message);
        if (response.responsetype == response_1.ResponseTypes.page)
            pager_1.Pager(msg, client, response);
    });
});
client.login(config.token);
