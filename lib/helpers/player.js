"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ytdl = require('ytdl-core');
/**
 * @class
 * @name Queue
 * @description Stores Queue entryies for each guild.
 */
class Queue {
    constructor() {
        this.queue = [];
    }
}
var queue = new Queue();
//Change player to class, call individual functions indeividually
class Player {
    constructor() { }
    /**
     * @name Add
     * @description Manages adding to guild queue
     */
    Add(MessageRequest, Client, Options) {
        return new Promise((resolve, reject) => {
            var Guild = MessageRequest.guild;
            this.GetQueueForGuild(Guild.id).then((Entry) => {
                if (Options.url != undefined || Options.url != '' || Options.url != null) {
                    if (Entry.queue.length < 10) {
                        ytdl.getInfo(Options.url, { seek: 0, volume: 1 }, (err, info) => {
                            Entry.queue.push({ url: Options.url, title: info.player_response.videoDetails.title });
                            return resolve({ message: "added-to-queue", payload: info.player_response.videoDetails.title, guildentry: Entry });
                        });
                    }
                    else {
                        return resolve({ message: "max-queue-size", payload: 10, guildentry: Entry });
                    }
                }
                else {
                    return resolve({ message: "no-url", guildentry: Entry });
                }
            });
        });
    }
    /**
     * @name Queue
     * @description Sends queue in list format back to guild channel
     */
    Queue(MessageRequest, Client, Options) {
        return new Promise((resolve, reject) => {
            var Guild = MessageRequest.guild;
            this.GetQueueForGuild(Guild.id).then((Entry) => {
                if (Entry.queue.length <= 0) {
                    return resolve({ message: 'no-queue', guildentry: Entry });
                }
                else {
                    return resolve({ message: 'queue', payload: Entry.queue, guildentry: Entry });
                }
            });
        });
    }
    /**
     * @name Play
     * @description Joins requesting users voice channel and starts playback of guild queue
     */
    Play(MessageRequest, Client, Options) {
        return new Promise((resolve, reject) => {
            var Guild = MessageRequest.guild;
            this.GetQueueForGuild(Guild.id).then((Entry) => {
                var voiceChannel = MessageRequest.member.voiceChannel;
                if (!voiceChannel) {
                    return resolve({ message: 'no-voice-channel', guildentry: Entry });
                }
                voiceChannel.join()
                    .then((connection) => {
                    if (Entry.queue == undefined || Entry.queue.length <= 0)
                        return resolve({ message: 'no-queue', guildentry: Entry });
                    else {
                        this.Playback(connection, Entry.queue[0].url.valueOf(), voiceChannel, Entry);
                        return resolve({ message: 'playback-started', guildentry: Entry });
                    }
                })
                    .catch(console.error);
            });
        });
    }
    /**
     * @name Stop
     * @description Stops playback for guild, leaves voiceChannel
     */
    Stop(MessageRequest, Client, Options) {
        return new Promise((resolve, reject) => {
            var Guild = MessageRequest.guild;
            this.GetQueueForGuild(Guild.id).then((Entry) => {
                var channels = MessageRequest.guild.channels;
                channels.forEach((channel) => {
                    if (channel.type == 'voice') {
                        channel.leave();
                        return resolve({ message: 'channel-left', guildentry: Entry });
                    }
                });
                return resolve({ message: 'no-channel', guildentry: Entry });
            });
        });
    }
    /**
     * @name Skip
     * @description Skips playback currently in progress or about to be played
     */
    Skip(MessageRequest, Client, Options) {
        return new Promise((resolve, reject) => {
            var Guild = MessageRequest.guild;
            this.GetQueueForGuild(Guild.id).then((Entry) => {
                if (Entry.dispatcher != null || Entry.dispatcher != undefined) {
                    if (Entry.queue.length > 1) {
                        var nextup = Entry.queue[1].title;
                    }
                    Entry.dispatcher.emit('end');
                    return resolve({ message: 'skipped', payload: nextup, guildentry: Entry });
                }
                else {
                    Entry.queue.shift();
                    if (Entry.queue.length >= 1) {
                        //MessageRequest.channel.send(`Skipping song. Next up: ${Entry.queue[0].title}`);
                        return resolve({ message: 'skipped', payload: nextup, guildentry: Entry });
                    }
                    return resolve({ message: 'skipped-no-queue', guildentry: Entry });
                }
            });
        });
    }
    /**
     * @name Clear
     * @description Clears guild Queue
     */
    Clear(MessageRequest, Client, Options) {
        return new Promise((resolve, reject) => {
            var Guild = MessageRequest.guild;
            this.GetQueueForGuild(Guild.id).then((Entry) => {
                Entry.queue = [];
                this.Stop(MessageRequest, Client, Options);
                //MessageRequest.channel.send('Queue cleared.');
                return resolve({ message: 'cleared', guildentry: Entry });
            });
        });
    }
    /**
     * @name Playback
     * @description
     * Handles to audio playback to given voice channel
     * Also manages the queue whilst the guild has an active dispatcher
     */
    Playback(connection, URL, VoiceChannel, Entry) {
        var stream = ytdl(URL, { filter: 'audioonly' });
        stream.on('error', (err) => { console.log(err); });
        Entry.dispatcher = connection.playStream(stream, { seek: 0, volume: 1 });
        Entry.dispatcher.on('error', (a) => { Entry.dispatcher.emit('end'); console.error; });
        Entry.dispatcher.once('end', (a) => {
            this.GetQueueForGuild(VoiceChannel.guild.id).then((Entry) => {
                Entry.queue.shift();
                if (Entry.queue.length <= 0) {
                    Entry.dispatcher = null;
                    VoiceChannel.leave();
                    return;
                }
                else {
                    Entry.dispatcher = null;
                    this.Playback(connection, Entry.queue[0].url.valueOf(), VoiceChannel, Entry);
                }
            }, () => {
                Entry.dispatcher = null;
                VoiceChannel.leave();
                return;
            }).catch(console.error);
        });
    }
    /**
     * @name GetQueueForGuild
     * @description
     * Finds guild in this instance of the Queue class and returns The Queue entry for that guild
     * @param {String} ID
     *
     * @returns {Promise<QueueEntry>}
     */
    GetQueueForGuild(ID) {
        return new Promise((resolve, reject) => {
            //if (queue.queue.length == 0) return reject();
            queue.queue.forEach((Entry) => {
                if (Entry.guild == ID)
                    return resolve(Entry);
            });
            queue.queue.push({ guild: ID, queue: [] });
            return this.GetQueueForGuild(ID);
        });
    }
}
exports.Player = Player;
/**
 * @name Player
 * @description
 * Player utility. Manages audio playback from youtube.
 *
 * @param {Message} MessageRequest
 * @param {Client} Client
 * @param {PlayerAction} Action
 * @param {PlayerOptions} Options
 */
// export function Player(MessageRequest: Message, Client: Client, Action: PlayerAction, Options: PlayerOptions, Callback: Function = null) {
//     if (Callback === null) { Callback = () => {} };
//     var Guild = MessageRequest.guild;
//     GetQueueForGuild(Guild.id).then((Entry: QueueEntry) => {
//         if (Action == PlayerAction.add) { Callback(Add(MessageRequest, Client, Action, Options, Entry)); }
//         if (Action == PlayerAction.play) { Callback(Play(MessageRequest, Client, Action, Options, Entry)); }
//         if (Action == PlayerAction.stop) { Callback(Stop(MessageRequest, Client, Action, Options, Entry)); } 
//         if (Action == PlayerAction.skip) { Callback(Skip(MessageRequest, Client, Action, Options, Entry)); } 
//         if (Action == PlayerAction.queue) { Callback(QueueShow(MessageRequest, Client, Action, Options, Entry)); } 
//         if (Action == PlayerAction.clear) { Callback(Clear(MessageRequest, Client, Action, Options, Entry)); } 
//     }, () => {
//         var Entry: QueueEntry = {
//             guild: Guild.id,
//             queue: []
//         };
//         queue.queue.push(Entry);
//         return Player(MessageRequest, Client, Action, Options, Callback);
//     }).catch((err) => { console.log(err); return null; });
// }
