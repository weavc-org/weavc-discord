import { IncomingMessage } from "http";
import { ResponseModel, ResponseTypes } from "./helpers/response";
import { Config, ConfigModel } from './helpers/config'
import { Pager } from './helpers/pager';
import { Router } from './helpers/router';

import { Message } from 'discord.js';
const Discord = require('discord.js');
const client = new Discord.Client();
var config = new Config();

client.on('ready', () => {
	config.prefixes.push('<@'+client.user.id+'>');
	console.log(`Logged in as ${client.user.tag}!`);

	process.on('uncaughtException', function(err) {
		console.log('Caught exception: ' + err.toString());
	});
});

client.on('message', (msg: Message) => {
	var message = msg.content.split(' ');
	let prefix = message.shift();

	if (!config.prefixes.some((p:string) => p === prefix)) return;
	
	Router(message, msg, client, (response: ResponseModel) => {
		if (response.responsetype == ResponseTypes.reply) msg.reply(response.message);
		if (response.responsetype == ResponseTypes.send) msg.channel.send(response.message);
		if (response.responsetype == ResponseTypes.page) Pager(msg, client, response)
	});
});

config.on('ready', () => {
	client.login(config.token);
})

config.on('setup', () => {
	console.log(
		"Setup error:\nI have created a config file for you, "+
		"it needs some of the values to be filled out before I can function correctly. \n"+
		"Please edit the config file ( found at: 'src/config.json' ) so that the setup value is true and your bot token is filled out with the credentials given by discord. "+
		"\nYou can obtain a bot token and setup an application for discord here: https://discordapp.com/developers/applications/")
})
