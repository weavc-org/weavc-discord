const ytdl = require('ytdl-core');
import { Message, Client, RichEmbed } from 'discord.js';
import { Player, PlayerOptions, RouteController, PlayerResult } from  '../../../../'

var player = new Player();

/**
 * @name Play
 * @description 
 * Play routing class.
 * Handles any message requests matching the play routes alias'.
 * 
 * @alias play, p
 */
class play {

    constructor(){}

    Add: RouteController = (Args: String[], MessageRequest: Message, Client: Client) => {
        var options = new PlayerOptions();
        options.url = Args[Args.length-1]+'';
        player.Add(MessageRequest, Client, options).then(
            (resolve: PlayerResult) => {
                if (resolve.message == 'added-to-queue') {
                    return  MessageRequest.channel.send(`Added ${resolve.payload} to the queue.`);
                }
                if (resolve.message == 'invalid-url' || resolve.message == 'no-url') {
                    return  MessageRequest.channel.send(`Invalid URL given`);
                }
                if (resolve.message == 'max-queue-size') {
                    return MessageRequest.channel.send('Queue is at max capacity (10). You can skip songs using `player skip` command or clear the queue using `player clear`');
                }
            }
        ).catch(console.error);
    }

    Stop: RouteController = (Args: String[], MessageRequest: Message, Client: Client) => {
        player.Stop(MessageRequest, Client, null).then(
            (resolve: PlayerResult) => {
                if (resolve.message == 'channel-left') {
                    return  MessageRequest.channel.send(`Yes Sir!`);
                }
                if (resolve.message == 'no-channel') {
                    return  MessageRequest.channel.send(`Yes Sir!`);
                }
            }
        ).catch(console.error);
    }

    Play: RouteController = (Args: String[], MessageRequest: Message, Client: Client) => {
        player.Play(MessageRequest, Client, null).then(
            (resolve: PlayerResult) => {
                if (resolve.message == 'no-voice-channel') {
                    return  MessageRequest.reply(`Please join a voice channel first`);
                }
                if (resolve.message == 'playback-started') {
                    return  MessageRequest.channel.send(`Yes Sir!`);
                }
                if (resolve.message == 'no-queue') {
                    return MessageRequest.channel.send('There is nothing for me to play. Add videos to the queue first: `m: player add <url>`');
                }
            }
        ).catch(console.error);
    }
    
    Skip: RouteController = (Args: String[], MessageRequest: Message, Client: Client) => {
        player.Skip(MessageRequest, Client, null).then(
            (resolve: PlayerResult) => {
                if (resolve.message == 'skipped') {
                    return  MessageRequest.channel.send('Skipped, Next up: `'+resolve.payload+'`');
                }
                if (resolve.message == 'skipped-no-queue') {
                    return  MessageRequest.channel.send(`Skipped, nothing more to play`);
                }
            }
        ).catch(console.error);
    }

    Queue: RouteController = (Args: String[], MessageRequest: Message, Client: Client) => {
        player.Queue(MessageRequest, Client, null).then(
            (resolve: PlayerResult) => {
                if (resolve.message == 'queue') {
                    var message:string = '';
                    resolve.guildentry.queue.forEach((element, i) => {
                        var entry = `${i+1}. ${element.title}`;
                        message = message + entry + '\n';
                    });
                    message = '```'+message+'```';
                    return  MessageRequest.channel.send(message);
                }
                if (resolve.message == 'no-queue') {
                    return  MessageRequest.channel.send('There is nothing in your guilds queue. Add videos to the queue first: `m: player add <url>`');
                }
            }
        ).catch(console.error);
    }

    Clear: RouteController = (Args: String[], MessageRequest: Message, Client: Client) => {
        player.Clear(MessageRequest, Client, null).then(
            (resolve: PlayerResult) => {
                if (resolve.message == 'cleared') {
                    return  MessageRequest.channel.send(`Queue cleared`);
                }
            }
        ).catch(console.error);
    }

    Help: RouteController = (Args: String[], MessageRequest: Message, Client: Client) => {
        var HelpPagePlayer = new RichEmbed()
            .setColor(0xb5130f)
            .setAuthor(Client.user.username, Client.user.avatarURL)
            .setTitle("(( -+-+-+- { Help - Player } -+-+-+- ))") 
            .setDescription("Player (player, p) - Youtube audio playback")
            .addField("play (j, join, play, p)", "Joins the requesting guild members voice channel and starts playing through the queue.")
            .addField("add <url>", "Adds youtube video to your guilds queue.")
            .addField("queue (q)", "Shows your guilds queue of videos")
            .addField("stop (s)", "Halts playback and leaves voice channel.")
            .addField("clear (c)", "Clears your guilds queue.")
            .addField("skip", "Removes the song currently playing/ ready to play from the queue.")
            .setTimestamp(new Date())
            .setFooter("Requested by: " + MessageRequest.author.username + "#" + MessageRequest.author.discriminator + " | From: Player | Page: 1");
        return MessageRequest.channel.send(HelpPagePlayer);
    }

    Volume: RouteController = (Args: String[], MessageRequest: Message, Client: Client) => {
        var volume = parseFloat(Args[2].valueOf());
        if (volume == NaN || volume < 0 || volume > 2) return MessageRequest.channel.send(`Volume must be a number between or equal to 0 and 2`);
        player.Volume(MessageRequest, Client, { volume: volume }).then(
            (resolve: PlayerResult) => {
                if (resolve.message == 'volume-set') {
                    return  MessageRequest.channel.send(`Volume has been updated`);
                }
                if (resolve.message == 'volume-invalid') {
                    return  MessageRequest.channel.send(`Volume must be a number between or equal to 0 and 2`);
                }
            }
        ).catch(console.error);
    }
    
}

export var Play = new play();


