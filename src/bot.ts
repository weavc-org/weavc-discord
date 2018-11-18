import { IncomingMessage } from "http";
import { ResponseModel, ResponseTypes } from "./helpers/response";


const config = require('./config');
import { Pager } from './helpers/pager';
import { Router } from './helpers/router';

const Discord = require('discord.js');
import { Message } from 'discord.js';
const client = new Discord.Client();

client.on('ready', () => {
	console.log(`Logged in as ${client.user.tag}!`);
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

client.login(config.token);

process.on('uncaughtException', function(err) {
  console.log('Caught exception: ' + err.toString());
});