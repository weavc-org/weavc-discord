import { Message, Client, MessageReaction, User, RichEmbed, VoiceConnection, VoiceChannel, StreamDispatcher } from "discord.js";
import { Result, PlayerCallback } from '../';
import { rejects } from "assert";
import { resolve } from "path";
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
export function Player(MessageRequest: Message, Client: Client, Action: PlayerAction, Options: PlayerOptions, Callback: Function = null) {
    if (Callback === null) { Callback = () => {} };
    var Guild = MessageRequest.guild;
    GetQueueForGuild(Guild.id).then((Entry: QueueEntry) => {
        if (Action == PlayerAction.add) { Callback(Add(MessageRequest, Client, Action, Options, Entry)); }
        if (Action == PlayerAction.play) { Callback(Play(MessageRequest, Client, Action, Options, Entry)); }
        if (Action == PlayerAction.stop) { Callback(Stop(MessageRequest, Client, Action, Options, Entry)); } 
        if (Action == PlayerAction.skip) { Callback(Skip(MessageRequest, Client, Action, Options, Entry)); } 
        if (Action == PlayerAction.queue) { Callback(QueueShow(MessageRequest, Client, Action, Options, Entry)); } 
        if (Action == PlayerAction.clear) { Callback(Clear(MessageRequest, Client, Action, Options, Entry)); } 
    }, () => {
        var Entry: QueueEntry = {
            guild: Guild.id,
            queue: []
        };
        queue.queue.push(Entry);
        return Player(MessageRequest, Client, Action, Options, Callback);
    }).catch((err) => { console.log(err); return null; });
}

/**
 * @name Play
 * @description Manages adding to guild queue
 */
function Add(MessageRequest: Message, Client: Client, Action: PlayerAction, Options: PlayerOptions, Entry: QueueEntry) : Promise<Result> {
    return new Promise<Result> ((resolve, reject) => {
        if (Options.url != undefined || Options.url != '' || Options.url != null) {
            if (Entry.queue.length < 10) {
                ytdl.getInfo(Options.url, { seek: 0, volume: 1}, (err:any, info:any)=> {
                    if (err) return resolve({ message: "not-a-video" }) //MessageRequest.channel.send(`Could not find video. Not added to queue.`);
                    Entry.queue.push({ url: Options.url, title: info.player_response.videoDetails.title });
                    return resolve({ message: "added-to-queue", payload: info.player_response.videoDetails.title })
                    //return MessageRequest.channel.send(`Added ${info.player_response.videoDetails.title} to the queue.`);
                })
            }
            else {
                return resolve({ message: "max-queue-size", payload: 10 })
               
            }
        }
        else {
            return resolve({ message: "no-url" });
        }   
    })
}

/**
 * @name QueueShow
 * @description Sends queue in list format back to guild channel
 */
function QueueShow(MessageRequest: Message, Client: Client, Action: PlayerAction, Options: PlayerOptions, Entry: QueueEntry) : Promise<Result> {
    return new Promise<Result> ((resolve, reject) => {
        if (Entry.queue.length <= 0) {
            return reject({ message: 'no-queue' });
            //MessageRequest.channel.send('You have nothing in the queue.')
        }
        else {
            return resolve({ message: 'queue', payload: Entry.queue })
            // Entry.queue.forEach((index, i) => {
            //     message = message + `\n${i+1}. ${index.title}`
            // });
            // message = '```' + message + '```';
            // MessageRequest.channel.send(message);
        }
    })
}

/**
 * @name Join
 * @description Joins requesting users voice channel and starts playback of guild queue
 */
function Play(MessageRequest: Message, Client: Client, Action: PlayerAction, Options: PlayerOptions, Entry: QueueEntry) : Promise<Result> {
    return new Promise<Result> ((resolve, reject)=>{
        var voiceChannel = MessageRequest.member.voiceChannel;

        if (!voiceChannel) {
            return reject({ message: 'no-voice-channel'})
            //return MessageRequest.reply('Join a voice channel first!');
        }

        voiceChannel.join()
            .then((connection: VoiceConnection) => { 
                if (Entry.queue == undefined || Entry.queue.length <= 0) return reject({ message : 'no-queue' });
                else Playback(connection, Entry.queue[0].url.valueOf(), voiceChannel, Entry); return resolve({ message: 'playback-started' });
            })
            .catch(console.error);
    })
    

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
function Stop(MessageRequest: Message, Client: Client, Action: PlayerAction, Options: PlayerOptions, Entry: QueueEntry)  : Promise<Result> {
    return new Promise<Result> ((resolve, reject)=> {
        var channels = MessageRequest.guild.channels;
        channels.forEach((channel: VoiceChannel) => {
            if (channel.type == 'voice') {
                channel.leave();
                return resolve({message: 'channel-left'})
            }
        });
        return resolve();
    })

}

/**
 * @name Skip
 * @description Skips playback currently in progress or about to be played
 */
function Skip(MessageRequest: Message, Client: Client, Action: PlayerAction, Options: PlayerOptions, Entry: QueueEntry)  : Promise<Result> {
    return new Promise<Result> ((resolve, reject)=>{
        if (Entry.dispatcher != null || Entry.dispatcher != undefined) {
            if (Entry.queue.length > 1) {
                var nextup = Entry.queue[1].title;
            }
            Entry.dispatcher.emit('end');
            return resolve({ message: 'skipped', payload: nextup })
        }
        else {
            Entry.queue.shift();
            if (Entry.queue.length >= 1) {
                //MessageRequest.channel.send(`Skipping song. Next up: ${Entry.queue[0].title}`);
                return resolve({ message: 'skipped', payload: nextup })
            }
            return resolve({ message: 'skipped'})
        }
    })

}

/**
 * @name Clear
 * @description Clears guild Queue
 */
function Clear(MessageRequest: Message, Client: Client, Action: PlayerAction, Options: PlayerOptions, Entry: QueueEntry)  : Promise<Result> {
    return new Promise<Result> ((resolve, reject)=>{
        Entry.queue = [];
        Stop(MessageRequest, Client, Action, Options, Entry);
        //MessageRequest.channel.send('Queue cleared.');
        return resolve({message:'cleared'});
    })
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
        return reject();
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
    add, 
    skip,
    queue, 
    clear
}

var queue = new Queue();