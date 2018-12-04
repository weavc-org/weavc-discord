import { Router, Route } from '../../../lib';
import { Message, Client } from 'discord.js';
import { Routes } from './routes/'

try {
	var config = require('../../config');
}
catch (err) {
	console.log("Could not find config. Run 'npm run config' to generate file, then fill out the values at examples/config.json")
	process.exit();
}

const client = new Client();
var router:Router;

client.on('ready', () => {
	config.prefixes.push('<@'+client.user.id+'>');
	router = new Router(Routes);
	console.log(`Logged in as ${client.user.tag}!`);

	process.on('uncaughtException', function(err) {
		console.log('Caught exception: ' + err.toString());
	});
});

client.on('message', (msg: Message) => {
	if (msg.content.toLowerCase() == "good bot") return msg.reply("good human");
	router.Go(msg, client);
});


client.login(config.token.valueOf())
	.catch((err) => {
		console.log(err);
		console.log("\nWe had trouble logging in with the provided token or there is a connection issue between yourself and discord. "+
					"\nPlease add your bot token provided by discord to examples/config.json");
		process.exit();
	});