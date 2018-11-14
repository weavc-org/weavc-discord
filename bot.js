const Discord = require('discord.js');
const client = new Discord.Client();

client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`);
});

client.on('message', msg => {
  if (msg.content === '!play') {
    const voiceChannel = msg.member.voiceChannel;

    if (!voiceChannel) {
      return msg.reply('Join a voice channel')
    }

    voiceChannel.join();

  } 
});

client.login('NDA4NjY1OTQ4Mjc5Nzk5ODI4.Dsxhuw.ormr3W0Y2eqtYfcYzWAuTer1ejI');