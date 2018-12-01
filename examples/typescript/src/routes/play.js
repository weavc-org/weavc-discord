"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ytdl = require('ytdl-core');
const __1 = require("../../../../");
var player = new __1.Player();
/**
 * @name Play
 * @description
 * Play routing class.
 * Handles any message requests matching the play routes alias'.
 *
 * @alias play, p
 * @function default -
 * default route for messages not containing a secondary command.
 * Takes a youtube link, joins the requesting users voice channel and playsback audio of linked video.
 * @function stop -
 * Leaves voice channels in requesting server
 */
class play {
    //Player will always resolve with a 'PlayerResult'. You can use the attached message, payload and guild entry to decided what to do next
    // note: Payload is of type any and returns very different values dependant on what action is performed.
    constructor() {
        this.Add = (Args, MessageRequest, Client) => {
            var options = new __1.PlayerOptions();
            options.url = Args[Args.length - 1] + '';
            player.Add(MessageRequest, Client, options).then((resolve) => {
                if (resolve.message == 'added-to-queue') {
                    return MessageRequest.channel.send(`Added ${resolve.payload} to the queue.`);
                }
                if (resolve.message == 'invalid-url' || resolve.message == 'no-url') {
                    return MessageRequest.channel.send(`Invalid URL given`);
                }
                if (resolve.message == 'max-queue-size') {
                    return MessageRequest.channel.send('Queue is at max capacity (10). You can skip songs using `player skip` command or clear the queue using `player clear`');
                }
            }).catch(console.error);
        };
        this.Stop = (Args, MessageRequest, Client) => {
            player.Stop(MessageRequest, Client, null).then((resolve) => {
                if (resolve.message == 'channel-left') {
                    return MessageRequest.channel.send(`Yes Sir!`);
                }
                if (resolve.message == 'no-channel') {
                    return MessageRequest.channel.send(`Yes Sir!`);
                }
            }).catch(console.error);
        };
        this.Play = (Args, MessageRequest, Client) => {
            player.Play(MessageRequest, Client, null).then((resolve) => {
                if (resolve.message == 'no-voice-channel') {
                    return MessageRequest.reply(`Please join a voice channel first`);
                }
                if (resolve.message == 'playback-started') {
                    return MessageRequest.channel.send(`Yes Sir!`);
                }
                if (resolve.message == 'no-queue') {
                    return MessageRequest.channel.send('There is nothing for me to play. Add videos to the queue first: `m: player add <url>`');
                }
            }).catch(console.error);
        };
        this.Skip = (Args, MessageRequest, Client) => {
            player.Skip(MessageRequest, Client, null).then((resolve) => {
                if (resolve.message == 'skipped') {
                    return MessageRequest.channel.send('Skipped, Next up: `' + resolve.payload + '`');
                }
                if (resolve.message == 'skipped-no-queue') {
                    return MessageRequest.channel.send(`Skipped, nothing more to play`);
                }
            }).catch(console.error);
        };
        this.Queue = (Args, MessageRequest, Client) => {
            player.Queue(MessageRequest, Client, null).then((resolve) => {
                if (resolve.message == 'queue') {
                    var message = '';
                    resolve.guildentry.queue.forEach((element, i) => {
                        var entry = `${i + 1}. ${element.title}`;
                        message = message + entry + '\n';
                    });
                    message = '```' + message + '```';
                    return MessageRequest.channel.send(message);
                }
                if (resolve.message == 'no-queue') {
                    return MessageRequest.channel.send('There is nothing in your guilds queue. Add videos to the queue first: `m: player add <url>`');
                }
            }).catch(console.error);
        };
        this.Clear = (Args, MessageRequest, Client) => {
            player.Clear(MessageRequest, Client, null).then((resolve) => {
                if (resolve.message == 'cleared') {
                    return MessageRequest.channel.send(`Queue cleared`);
                }
            }).catch(console.error);
        };
    }
}
exports.Play = new play();
