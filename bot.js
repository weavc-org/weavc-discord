const Discord = require('discord.js');
const config = require('./config');
const router = require('./helpers/router');
const client = new Discord.Client();
const ytdl = require('ytdl-core');
const parsefooter = require('./helpers/parse-footer');

client.on('ready', () => {
	console.log(`Logged in as ${client.user.tag}!`);
});

client.on('message', msg => {

	var message = msg.content.split(' ');
	let prefix = message.shift();

	if (!config.prefixs.includes(prefix)) return;
	
	router(message, msg, client, (response) => {
		if (response.send == 'reply') {
			msg.reply(response.message);
		}
		else if (response.send == 'send') {
			msg.channel.send(response.message);
		}
		else if (response.send == 'page') {
			msg.channel.send(response.message)
				.then(function (message) {
					message.react("⬅").then(r => {
						message.react("➡");
					});

					var forwardreact = (reaction, user) => reaction.emoji.name === "➡" && user.id == msg.author.id;
					var backreact = (reaction, user) => reaction.emoji.name === "⬅" && user.id == msg.author.id;

					var back = message.createReactionCollector(backreact, { time: 600 });
					var forward = message.createReactionCollector(forwardreact, { time: 600 });

					back.on('collect', (r) => {
						var model = parsefooter(message.embeds[0].footer.text);
						message[1] = (parseInt(model.page) -1)+'';
						router(message, msg, client, (response) => {
							message.edit(response.message);
						})
					})

					forward.on('collect', (r) => {
						var model = parsefooter(message.embeds[0].footer.text);
						message[1] = (parseInt(model.page) +1)+'';
						router(message, msg, client, (response) => {
							message.edit(response.message);
						})
					})

					client.on('messageReactionRemove', (reaction, user) => { 
						if (user.id !== msg.author.id) { return; }
						if (reaction._emoji.name === "➡") { forward.emit('collect') }
						if (reaction._emoji.name === "⬅") { back.emit('collect'); }
						// if (user.id != msg.author.id) return; 
						// if (reaction.message.id !== message.id) return;
						// var number = 0;

						// var model = parsefooter(message.embeds[0].footer.text);
						// message[1] = (parseInt(model.page) +number)+'';
						// router(message, msg, client, (response) => {
						// 	message.edit(response.message);
						// })
					 });

				}).catch(function(err) {
					console.log(err);
				});
		}
		else {
			msg.reply(response.message);
		}
	});
});

client.login(config.token);