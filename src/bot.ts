import { Config, ConfigModel } from './helpers/config'
import { Router } from './helpers/router';
import { Message, Client } from 'discord.js';
//const Discord = require('discord.js');

const client = new Client();
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
	
	Router(message, msg, client);
});

config.on('ready', () => {
	client.login(config.token.valueOf());
})

config.on('setup', () => {
	console.log(
		"Setup error:\nI have created a config file for you, "+
		"but it needs some of the values to be filled out before I can function correctly. \n"+
		"Please edit the config file ( found at: 'src/config.json' ) so that the setup value is true and your bot token is filled out with the credentials given by discord. "+
		"\nYou setup an application and obtain a bot token from discord, here: https://discordapp.com/developers/applications/")
})
