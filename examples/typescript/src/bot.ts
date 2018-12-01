import { Router, Route } from '../../../lib';
import { Message, Client } from 'discord.js';
import { Help } from '../src/routes/help';
import { Github } from '../src/routes/github';
import { Hello } from '../src/routes/hello';
import { Play } from '../src/routes/play';

try {
	var config = require('../../config');
}
catch (err) {
	console.log("Could not find config. Run 'npm run config' to generate file, then fill out the values at examples/config.json")
	process.exit();
}


/**
 * @name Routes
 * @description 
 * Array of valid class routes.
 * If one of the alias' matches the first index of Message, use matched class.
 * Defaults to index 0.
 */
var Routes: Route[] = [
	{ name:'hello', controller: Hello, alias: ['hello', 'hi', 'hey', 'hoi'], children: [] },
	{ name:'help', controller: Help, alias: ['help', '-h'], children: [] },
	{ name:'player', alias: ['p', 'player'], children: [
		{ name:'add', controller: Play.Add, alias: ['add'], children: [], default: true},
		{ name:'stop', controller: Play.Stop, alias: ['stop', 's'], children: [] },
		{ name:'play', controller: Play.Play, alias: ['join', 'j', 'p', 'play'], children: [] },
		{ name:'skip', controller: Play.Skip, alias: ['skip'], children: [] },
		{ name:'queue', controller: Play.Queue, alias: ['q', 'queue'], children: [] },
		{ name:'clear', controller: Play.Clear, alias: ['c', 'clear'], children: [] },
		{ name:'volume', controller: Play.Volume, alias: ['v', 'volume'], children: [] },
		{ name:'help', controller: Play.Help, alias: ['help', 'h'], children: [] }
	]},
	{ name:'github', controller: Github, alias: ['git', 'github'], children: [] },
]

const client = new Client();
var router:Router;

client.on('ready', () => {
	config.prefixes.push('<@'+client.user.id+'>');
	router = new Router(Routes, config.prefixes);
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