"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ytdl = require('ytdl-core');
const __1 = require("../../../../");
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
    constructor() {
        this.Add = (Args, MessageRequest, Client) => {
            var options = new __1.PlayerOptions();
            options.url = Args[2] + '';
            __1.Player(MessageRequest, Client, __1.PlayerAction.add, options, (Promise) => {
                Promise.then((resolve) => {
                    if (resolve.message == 'added-to-queue') {
                        return MessageRequest.channel.send(`Added ${resolve.payload} to the queue.`);
                    }
                    if (resolve.message == 'not-a-video' || resolve.message == 'no-url') {
                        return MessageRequest.channel.send(`Invalid URL given`);
                    }
                    if (resolve.message == 'max-queue-size') {
                        return MessageRequest.channel.send('Queue is at max capacity (10). You can skip songs using `player skip` command or clear the queue using `player clear`');
                    }
                }).catch(console.error);
            });
        };
        this.Stop = (Args, MessageRequest, Client) => {
            __1.Player(MessageRequest, Client, __1.PlayerAction.stop, null);
            return MessageRequest.reply('Yes sir!');
        };
        this.Play = (Args, MessageRequest, Client) => {
            __1.Player(MessageRequest, Client, __1.PlayerAction.play, null);
        };
        this.Skip = (Args, MessageRequest, Client) => {
            __1.Player(MessageRequest, Client, __1.PlayerAction.skip, null);
        };
        this.Queue = (Args, MessageRequest, Client) => {
            __1.Player(MessageRequest, Client, __1.PlayerAction.queue, null);
        };
        this.Clear = (Args, MessageRequest, Client) => {
            __1.Player(MessageRequest, Client, __1.PlayerAction.clear, null);
        };
    }
}
exports.Play = new play();
