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
    { name:'hello', controller: Hello, alias: ['hello', 'hi', 'hey', 'hoi'], children: [] }]

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
