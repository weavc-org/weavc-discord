import { IncomingMessage } from "http";
import { ResponseModel, ResponseTypes } from "./helpers/response";
import { ConfigModel, CreateConfig } from './helpers/setup';

import { Pager } from './helpers/pager';
import { Router } from './helpers/router';

import { Message } from 'discord.js';
const Discord = require('discord.js');
const client = new Discord.Client();

client.on('ready', () => {
	config.prefixs.push('<@'+client.user.id+'>');
	console.log(`Logged in as ${client.user.tag}!`);

	process.on('uncaughtException', function(err) {
		console.log('Caught exception: ' + err.toString());
	});
});

client.on('message', (msg: Message) => {
	var message = msg.content.split(' ');
	let prefix = message.shift();

	if (!config.prefixs.some((p:string) => p === prefix)) return;
	
	Router(message, msg, client, (response: ResponseModel) => {
		if (response.responsetype == ResponseTypes.reply) msg.reply(response.message);
		if (response.responsetype == ResponseTypes.send) msg.channel.send(response.message);
		if (response.responsetype == ResponseTypes.page) Pager(msg, client, response)
	});
});

var config: ConfigModel = require('./config');
client.login(config.token);