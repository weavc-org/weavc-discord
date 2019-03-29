import { Message, Client, MessageReaction, User, RichEmbed, VoiceConnection, VoiceChannel, StreamDispatcher } from "discord.js";
import { PlayerResult, QueueEntry, PlayerOptions, PlayerAction } from '../';
const ytdl = require('ytdl-core');

/**
 * @class
 * @name Queue
 * @description Stores Queue entryies for each guild.
 */
class Queue {
    queue: QueueEntry[] = [];
}


//Change player to class, call individual functions indeividually
export class Player {
    constructor() {}
    queue = new Queue();
    
    /**
     * @name Add
     * @description Manages adding videos to guild queue
     * 
     * @returns Promise<PlayerResult> 
     * @returns added-to-queue', 'max-queue-size', 'invalid-url', 'no-url'
     * 
     */
    Add(MessageRequest: Message, Client: Client, Options: PlayerOptions) : Promise<PlayerResult> {
        return new Promise<PlayerResult> ((resolve, reject) => {
            var Guild = MessageRequest.guild;
            this.GetQueueForGuild(Guild.id).then((Entry: QueueEntry) => {
                if (Options.url != undefined || Options.url != '' || Options.url != null) {
                    if (Entry.queue.length < 10) {
                        ytdl.getInfo(Options.url, { seek: 0, volume: 1}, (err:any, info:any)=> {
                            if (err) { return resolve({ message: "invalid-url", guildentry: Entry}); }
                            Entry.queue.push({ url: Options.url, title: info.player_response.videoDetails.title });
                            return resolve({ message: "added-to-queue", payload: info.player_response.videoDetails.title, guildentry: Entry })
                        })
                    }
                    else {
                        return resolve({ message: "max-queue-size", payload: 10, guildentry: Entry })
                    
                    }
                }
                else {
                    return resolve({ message: "no-url", guildentry: Entry});
                }
            })
        })
    }

    /**
     * @name Queue
     * @description Returns requesting guilds queue back to controller
     * 
     * @returns 'no-queue', 'queue'
     */
    Queue(MessageRequest: Message, Client: Client, Options: PlayerOptions) : Promise<PlayerResult> {
        return new Promise<PlayerResult> ((resolve, reject) => {
            var Guild = MessageRequest.guild;
            this.GetQueueForGuild(Guild.id).then((Entry: QueueEntry) => {
                if (Entry.queue.length <= 0) {
                    return resolve({ message: 'no-queue', guildentry: Entry });
                }
                else {
                    return resolve({ message: 'queue', payload: Entry.queue, guildentry: Entry })
                }
            })
        })
    }

    /**
     * @name Play
     * @description Joins requesting users voice channel and starts playback of guild queue
     * 
     * @returns 'no-voice-channel', 'no-queue', 'playback-started'
     */
    Play(MessageRequest: Message, Client: Client, Options: PlayerOptions) : Promise<PlayerResult> {
        return new Promise<PlayerResult> ((resolve, reject)=>{
            var Guild = MessageRequest.guild;
            this.GetQueueForGuild(Guild.id).then((Entry: QueueEntry) => {
                var voiceChannel = MessageRequest.member.voiceChannel;
            
                if (!voiceChannel) {
                    return resolve({ message: 'no-voice-channel', guildentry: Entry})
                }
                if (Entry.queue == undefined || Entry.queue.length <= 0) {
                    return resolve({ message : 'no-queue', guildentry: Entry })
                }

                voiceChannel.join()
                    .then((connection: VoiceConnection) => { 
                        this.Playback(connection, Entry.queue[0].url.valueOf(), voiceChannel, Entry); 
                        return resolve({ message: 'playback-started', guildentry: Entry}); 
                    })
                    .catch(console.error);
            })
        })
    }



    /**
     * @name Stop
     * @description Stops playback for guild and leaves voiceChannel
     * 
     * @returns 'channel-left', 'no-channel'
     */
    Stop(MessageRequest: Message, Client: Client, Options: PlayerOptions)  : Promise<PlayerResult> {
        return new Promise<PlayerResult> ((resolve, reject)=> {
            var Guild = MessageRequest.guild;
            this.GetQueueForGuild(Guild.id).then((Entry: QueueEntry) => {
                var channels = MessageRequest.guild.channels;
                channels.forEach((channel: VoiceChannel) => {
                    if (channel.type == 'voice') {
                        channel.leave();
                        return resolve({message: 'channel-left' , guildentry: Entry})
                    }
                });
                return resolve({message: 'no-channel', guildentry: Entry });
            })
        })

    }

    /**
     * @name Skip
     * @description Skips playback currently in progress or about to be played
     * 
     * @returns 'skipped', 'skipped-no-queue'
     */
    Skip(MessageRequest: Message, Client: Client, Options: PlayerOptions)  : Promise<PlayerResult> {
        return new Promise<PlayerResult> ((resolve, reject)=>{
            var Guild = MessageRequest.guild;
            this.GetQueueForGuild(Guild.id).then((Entry: QueueEntry) => {
                if (Entry.dispatcher != null || Entry.dispatcher != undefined) {
                    const q = Entry.queue;
                    Entry.dispatcher.emit('end');
                    if (q.length > 1) {
                        var nextup = q[1].title;
                        return resolve({ message: 'skipped', payload: nextup, guildentry: Entry})
                    }
                    return resolve({ message: 'skipped-no-queue', guildentry: Entry})
                }
                else {
                    Entry.queue.shift();
                    if (Entry.queue.length >= 1) {
                        var nextup = Entry.queue[0].title;
                        return resolve({ message: 'skipped', payload: nextup, guildentry: Entry })
                    }
                    return resolve({ message: 'skipped-no-queue', guildentry: Entry})
                }
            })
        })

    }

    /**
     * @name Clear
     * @description Clears guild Queue
     * 
     * @returns 'cleared'
     */
    Clear(MessageRequest: Message, Client: Client, Options: PlayerOptions)  : Promise<PlayerResult> {
        return new Promise<PlayerResult> ((resolve, reject)=>{
            var Guild = MessageRequest.guild;
            this.GetQueueForGuild(Guild.id).then((Entry: QueueEntry) => {
                Entry.queue = [];
                this.Stop(MessageRequest, Client, Options);
                //MessageRequest.channel.send('Queue cleared.');
                return resolve({ message:'cleared', guildentry: Entry });
            })
        })
    }

    /**
     * @name Volume
     * @description sets volume to new values, 0 - 2
     * 
     * @returns 'volume-set', 'volume-invalid'
     */
    Volume(MessageRequest: Message, Client: Client, Options: PlayerOptions)  : Promise<PlayerResult> {
        return new Promise<PlayerResult> ((resolve, reject)=>{
            var Guild = MessageRequest.guild;
            this.GetQueueForGuild(Guild.id).then((Entry: QueueEntry) => {
                if (Options.volume >= 0 && Options.volume <= 2) {
                    if (Entry.dispatcher) Entry.dispatcher.setVolume(Options.volume);
                    Entry.settings.volume = Options.volume;
                    return resolve({message:"volume-set", guildentry: Entry});
                }
                else {
                    return resolve({ message:"volume-invalid", payload: "Value should be between or equal to 0 and 2", guildentry: Entry })
                }

            })
        })
    }

    /**
     * @name Playback
     * @description 
     * Handles audio playback to voice channel
     * Also manages the queue whilst the guild has an active dispatcher
     */
    private Playback(connection:VoiceConnection, URL: string, VoiceChannel: VoiceChannel, Entry: QueueEntry) {
        console.log('playback', URL)
        console.log('start queue', Entry.queue)
        var volume = 1;
        if (Entry.settings.volume != undefined || Entry.settings.volume >= 0 && Entry.settings.volume <= 2){
            volume = Entry.settings.volume;
        }

        var stream = ytdl(URL, { filter: 'audioonly' });
        stream.on('error', (err:any)=>{ console.log(err) });
        Entry.dispatcher = connection.playStream(stream, { seek: 0, volume: volume});
        Entry.dispatcher.on('debug', (a) => { console.log('dispatcher debug: ', a); });
        Entry.dispatcher.on('error', (a) => { console.log('dispatcher error', a); Entry.dispatcher.emit('end'); });
        Entry.dispatcher.once('end', (a) => { 
            console.log('end: ', a)
            this.GetQueueForGuild(VoiceChannel.guild.id).then(
                (e) => { 
                    console.log(e.guild);
                    console.log(e.queue);
                    e.queue.shift();
                    if (e.queue.length <= 0) { console.log('length 0'); e.dispatcher = null; VoiceChannel.leave(); return; }
                    else { e.dispatcher = null; console.log('playing next'); this.Playback(connection, e.queue[0].url.valueOf(), VoiceChannel, e); }
                }, () => {
                    console.log('didnt find guild?')
                    Entry.dispatcher = null; VoiceChannel.leave(); return;
                }
            ).catch(console.error);
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
    GetQueueForGuild(ID: String) : Promise<QueueEntry> {
        return new Promise<QueueEntry> ((resolve, reject)=> {
            //if (queue.queue.length == 0) return reject();
            this.queue.queue.forEach((Entry) => {
                if (Entry.guild == ID) return resolve(Entry);
            })
            var entry = {guild: ID, queue: [], settings: { volume: 1 }}
            this.queue.queue.push(entry);
            return resolve(entry);
        })
    }
}



