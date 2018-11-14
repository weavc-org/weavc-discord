const Discord = require('discord.js');
const config = require('./config');
const router = require('./helpers/router');
const client = new Discord.Client();

client.on('ready', () => {
	console.log(`Logged in as ${client.user.tag}!`);
});

client.on('message', msg => {

	var message = msg.content.split(' ');
	let prefix = message.shift();

	if (!config.prefixs.includes(prefix)) return;

	router(message, (response) => {
		msg.reply(response.message);
	});
});

client.login(config.token);