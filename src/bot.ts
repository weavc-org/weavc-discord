import { Config, ConfigModel } from './helpers/config'
import { Router } from './helpers/router';
import { Message, Client } from 'discord.js';
import { setup } from './helpers/setup';
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
	client.login(config.token.valueOf()).catch((err) => {
		console.log(err);
		console.log('\nWe had trouble logging in with the provided token or there is a connection issue between yourself and discord.');
		process.exit();
	});
})

config.on('setup', () => {
	console.log(
		"Setup error:\nI have created a config file for you, "+
		"but it needs some of the values to be filled out before I can function correctly. \n"+
		"Please edit the config file ( found at: 'src/config.json' ) so that the setup value is true and your bot token is filled out with the credentials given by discord. "+
		"\nYou setup an application and obtain a bot token from discord, here: https://discordapp.com/developers/applications/\n")

		setup().then((value: Boolean) => {
			config.reload();
		}, (value: Boolean) => {
			console.log('Config not setup. Please run through the setup script or enter the values manually in src/config.json as detailed above.');
			process.exit();
		}).catch((err)=> {
			process.exit();
		});
})
