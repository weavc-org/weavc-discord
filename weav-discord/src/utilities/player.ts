import { Message, Client, MessageReaction, User, RichEmbed, VoiceConnection, VoiceChannel, StreamDispatcher } from "discord.js";
const ytdl = require('ytdl-core');

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
export function Player(MessageRequest: Message, Client: Client, Action: PlayerAction, Options: PlayerOptions) {
    var Guild = MessageRequest.guild;
    GetQueueForGuild(Guild.id).then((Entry: QueueEntry) => {
        if (Action == PlayerAction.play) { Play(MessageRequest, Client, Action, Options, Entry); }
        if (Action == PlayerAction.join) { Join(MessageRequest, Client, Action, Options, Entry); }
        if (Action == PlayerAction.stop) { Stop(MessageRequest, Client, Action, Options, Entry); } 
        if (Action == PlayerAction.skip) { Skip(MessageRequest, Client, Action, Options, Entry); } 
        if (Action == PlayerAction.queue) { QueueShow(MessageRequest, Client, Action, Options, Entry); } 
        if (Action == PlayerAction.clear) { Clear(MessageRequest, Client, Action, Options, Entry); } 
    }, () => {
        var Entry: QueueEntry = {
            guild: Guild.id,
            queue: []
        };
        queue.queue.push(Entry);
        Player(MessageRequest, Client, Action, Options);
    }).catch((err) => { console.log(err) });
}

/**
 * @name Play
 * @description Manages adding to guild queue
 */
function Play(MessageRequest: Message, Client: Client, Action: PlayerAction, Options: PlayerOptions, Entry: QueueEntry) {
    if (Options.url != undefined || Options.url != '') {
        if (Entry.queue.length < 10) {
            ytdl.getInfo(Options.url, { seek: 0, volume: 1}, (err:any, info:any)=> {
                if (err) return MessageRequest.channel.send(`Could not find video. Not added to queue.`);
                Entry.queue.push({ url: Options.url, title: info.player_response.videoDetails.title });
                return MessageRequest.channel.send(`Added ${info.player_response.videoDetails.title} to the queue.`);
            })
        }
        else {
            return MessageRequest.channel.send('Queue is at max capacity (10). You can skip songs using `player skip` command or clear the queue using `player clear`.');
        }
    }
    else {
        console.log("No URL supplied");
        return;
    }   
}

/**
 * @name QueueShow
 * @description Sends queue in list format back to guild channel
 */
function QueueShow(MessageRequest: Message, Client: Client, Action: PlayerAction, Options: PlayerOptions, Entry: QueueEntry) {
    if (Entry.queue.length <= 0) {
        MessageRequest.channel.send('You have nothing in the queue.')
    }
    else {
        var message = ''
        Entry.queue.forEach((index, i) => {
            message = message + `\n${i+1}. ${index.title}`
        });
        message = '```' + message + '```';
        MessageRequest.channel.send(message);
    }
}

/**
 * @name Join
 * @description Joins requesting users voice channel and starts playback of guild queue
 */
function Join(MessageRequest: Message, Client: Client, Action: PlayerAction, Options: PlayerOptions, Entry: QueueEntry) {
    var voiceChannel = MessageRequest.member.voiceChannel;

    if (!voiceChannel) {
        return MessageRequest.reply('Join a voice channel first!');
    }

    voiceChannel.join()
        .then((connection: VoiceConnection) => { 
            if (Entry.queue == undefined || Entry.queue.length <= 0) return;
            else return Playback(connection, Entry.queue[0].url.valueOf(), voiceChannel, Entry);
        })
        .catch(console.error);
}

/**
 * @name Playback
 * @description 
 * Handles to audio playback to given voice channel
 * Also manages the queue whilst the guild has an active dispatcher
 */
function Playback(connection:VoiceConnection, URL: string, VoiceChannel: VoiceChannel, Entry: QueueEntry) {
    var stream = ytdl(URL, { filter: 'audioonly' });
    stream.on('error', (err:any)=>{console.log(err)});
    Entry.dispatcher = connection.playStream(stream, { seek: 0, volume: 1});

    Entry.dispatcher.on('error', (a) => { Entry.dispatcher.emit('end'); console.error; });
    Entry.dispatcher.once('end', (a) => { 
        GetQueueForGuild(VoiceChannel.guild.id).then(
            (Entry) => { 
                Entry.queue.shift();
                if (Entry.queue.length <= 0) { Entry.dispatcher = null; VoiceChannel.leave(); return; }
                else { Entry.dispatcher = null; Playback(connection, Entry.queue[0].url.valueOf(), VoiceChannel, Entry); }
            }, () => {
                Entry.dispatcher = null; VoiceChannel.leave(); return;
            }
        ).catch(console.error);
    });
}

/**
 * @name Stop
 * @description Stops playback for guild, leaves voiceChannel
 */
function Stop(MessageRequest: Message, Client: Client, Action: PlayerAction, Options: PlayerOptions, Entry: QueueEntry) {
    var channels = MessageRequest.guild.channels;
    
    channels.forEach((channel: VoiceChannel) => {
        if (channel.type == 'voice') {
            channel.leave();
        }
    });
}

/**
 * @name Skip
 * @description Skips playback currently in progress or about to be played
 */
function Skip(MessageRequest: Message, Client: Client, Action: PlayerAction, Options: PlayerOptions, Entry: QueueEntry) {
    if (Entry.dispatcher != null || Entry.dispatcher != undefined) {
        if (Entry.queue.length > 1) {
            MessageRequest.channel.send(`Skipping song. Next up: ${Entry.queue[1].title}`);
        }
        Entry.dispatcher.emit('end');
    }
    else {
        Entry.queue.shift();
        if (Entry.queue.length >= 1) {
            MessageRequest.channel.send(`Skipping song. Next up: ${Entry.queue[0].title}`);
        }
    }
}

/**
 * @name Clear
 * @description Clears guild Queue
 */
function Clear(MessageRequest: Message, Client: Client, Action: PlayerAction, Options: PlayerOptions, Entry: QueueEntry) {
    Entry.queue = [];
    MessageRequest.channel.send('Queue cleared.');
    return Stop(MessageRequest, Client, Action, Options, Entry);
}

/**
 * @name GetQueueForGuild
 * @description 
 * Finds guild in this instance of the Queue class and returns The Queue entry for that guild
 * @param {String} ID 
 * 
 * @returns {Promise<QueueEntry>}
 */
export function GetQueueForGuild(ID: String) : Promise<QueueEntry> {
    return new Promise<QueueEntry> ((resolve, reject)=> {
        if (queue.queue.length == 0) return reject();
        queue.queue.forEach((Entry) => {
            if (Entry.guild == ID) return resolve(Entry);
        }, () => {
            return reject()
        })
    })
}

/**
 * @class
 * @name PlayerOptions
 * @description 
 * Outlines the options that can be passed into the player.
 * At a later date this will help allow volume and other settings per guild.
 * As of now it just contains the URL of the Youtube video 
 */
export class PlayerOptions {
    url: string;
}

/**
 * @class
 * @name Queue
 * @description Stores Queue entryies for each guild.
 */
class Queue {
    queue: QueueEntry[] = [];
}


/**
 * @interface
 * @name QueueEntry
 * @description 
 * Stores playback details needed per guild
 * Will also contain settings in the future
 */
interface QueueEntry {
    guild: String;
    queue: VideoLink[];
    dispatcher?: StreamDispatcher;
}

/**
 * @interface
 * @name VideoLink
 * @description
 * Stores details about the linked youtube video
 * Again I plan to expand this at a later date.
 */
interface VideoLink {
    url: String;
    title: String;
}

/**
 * @enum
 * @name PlayerAction
 * @description
 * Stores each of the actions the player function can perform with a request
 */
export enum PlayerAction {
    play,
    stop,
    join, 
    skip,
    queue, 
    clear
}

var queue = new Queue();