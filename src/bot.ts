import { Config, ConfigModel } from './helpers/config'
import { Router } from './helpers/router';
import { Message, Client } from 'discord.js';
import { setup } from './helpers/setup';
//const Discord = require('discord.js');

const client = new Client();
var config = new Config(process.argv[2] == '--setup');


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
	client.login(config.token.valueOf())
		.catch((err) => {
			console.log(err);
			console.log("\nWe had trouble logging in with the provided token or there is a connection issue between yourself and discord. "+
						"\nTo run through setup again, run the bot using 'npm run setup'.");
			process.exit();
		});
})

config.on('setup', () => {
	setup(!(process.argv[2] == '--setup')).then((value: Boolean) => {
		config.reload();
	}, (value: Boolean) => {
		console.log('Config not setup. Please run through the setup script or enter the values manually in src/config.json as detailed above.');
		process.exit();
	}).catch((err)=> {
		console.log(err);
		process.exit();
	});
})
