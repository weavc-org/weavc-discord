import { Config, ConfigModel } from './helpers/config'
import { Router, iRoute } from '../../../lib';
import { Message, Client } from 'discord.js';
import { setup } from './helpers/setup';
import { Help } from '../src/routes/help';
import { Github } from '../src/routes/github';
import { Hello } from '../src/routes/hello';
import { Play } from '../src/routes/play'; 

/**
 * @name Routes
 * @description 
 * Array of valid class routes.
 * If one of the alias' matches the first index of Message, use matched class.
 * Defaults to index 0.
 */
var Routes: iRoute[] = [
	{ name:'hello', controller: Hello, alias: ['hello', 'hi', 'hey', 'hoi'], children: [] },
	{ name:'help', controller: Help, alias: ['help', '-h'], children: [] },
	{ name:'player', alias: ['p', 'player'], children: [
		{ name:'play', controller: Play.Play, alias: [], children: [], default: true },
		{ name:'stop', controller: Play.Stop, alias: ['stop', 's'], children: [] },
		{ name:'join', controller: Play.Join, alias: ['join', 'j', 'p', 'play'], children: [] },
		{ name:'skip', controller: Play.Skip, alias: ['skip'], children: [] },
		{ name:'queue', controller: Play.Queue, alias: ['q', 'queue'], children: [] },
		{ name:'clear', controller: Play.Clear, alias: ['c', 'clear'], children: [] }
	]},
	{ name:'github', controller: Github, alias: ['git', 'github'], children: [] },
]

const client = new Client();
var config = new Config(process.argv[2] == '--setup');
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
