var Weav = require('../../lib');
var Discord = require('discord.js')

try {
	var config = require('../../config');
}
catch (err) {
	console.log("Could not find config. Run 'npm run config' to generate file, then fill out the values at examples/config.json")
	process.exit();
}


var Routes = [
    { name:'hello', controller: Hello, alias: ['hello', 'hi', 'hey', 'hoi'], children: [] },
    { name:'player', alias: ['p', 'player'], children: [
		{ name:'play', controller: Play, alias: [], children: [], default: true },
		{ name:'stop', controller: Stop, alias: ['stop', 's'], children: [] },
		{ name:'join', controller: Join, alias: ['join', 'j', 'p', 'play'], children: [] },
		{ name:'skip', controller: Skip, alias: ['skip'], children: [] },
		{ name:'queue', controller: Queue, alias: ['q', 'queue'], children: [] },
		{ name:'clear', controller: Clear, alias: ['c', 'clear'], children: [] }]}
]

const client = new Discord.Client();
var router;

client.on('ready', () => {
	config.prefixes.push('<@'+client.user.id+'>');
    router = new Weav.Router(Routes, config.prefixes);
    console.log(`Logged in as ${client.user.tag}!`);

	process.on('uncaughtException', function(err) {
		console.log('Caught exception: ' + err.toString());
	});
});

client.on('message', (msg) => {
	if (msg.content.toLowerCase() == "good bot") return msg.reply("good human");
	router.Go(msg, client);
});

client.login(config.token)

function Hello(Message, MessageRequest, Client) {
    MessageRequest.reply('hello');
}

function Play(Message, MessageRequest, Client) {
    var options = {};
    options.url = Message[1];
    Weav.Player(MessageRequest, Client, Weav.PlayerAction.play, options);
}

function Stop(Message, MessageRequest, Client) {
    Weav.Player(MessageRequest, Client, Weav.PlayerAction.stop, null); 
    return MessageRequest.reply('Yes sir!');
}

function Clear(Message, MessageRequest, Client) {
   Weav.Player(MessageRequest, Client, Weav.PlayerAction.clear, null);
}

function Queue(Message, MessageRequest, Client) {
    Weav.Player(MessageRequest, Client, Weav.PlayerAction.queue, null);
}

function Skip(Message, MessageRequest, Client) {
    Weav.Player(MessageRequest, Client, Weav.PlayerAction.skip, null);
}

function Join(Message, MessageRequest, Client) {
    Weav.Player(MessageRequest, Client, Weav.PlayerAction.join, null);
}