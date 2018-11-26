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
        this.Play = (Message, MessageRequest, Client) => {
            var options = new __1.PlayerOptions();
            options.url = Message[1].valueOf();
            __1.Player(MessageRequest, Client, __1.PlayerAction.play, options);
        };
        this.Stop = (Message, MessageRequest, Client) => {
            __1.Player(MessageRequest, Client, __1.PlayerAction.stop, null);
            return MessageRequest.reply('Yes sir!');
        };
        this.Join = (Message, MessageRequest, Client) => {
            __1.Player(MessageRequest, Client, __1.PlayerAction.join, null);
        };
        this.Skip = (Message, MessageRequest, Client) => {
            __1.Player(MessageRequest, Client, __1.PlayerAction.skip, null);
        };
        this.Queue = (Message, MessageRequest, Client) => {
            __1.Player(MessageRequest, Client, __1.PlayerAction.queue, null);
        };
        this.Clear = (Message, MessageRequest, Client) => {
            __1.Player(MessageRequest, Client, __1.PlayerAction.clear, null);
        };
    }
}
exports.Play = new play();
