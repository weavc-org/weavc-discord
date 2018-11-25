import { Message, Client, MessageReaction, User, RichEmbed, VoiceConnection, VoiceChannel } from "discord.js";
const ytdl = require('ytdl-core');

export function Player(MessageRequest: Message, Client: Client, Action: PlayerAction, Options: PlayerOptions) {
    var Guild = MessageRequest.guild;
    GetQueueForGuild(Guild.id).then((Entry: QueueEntry) => {
        if (Action == PlayerAction.play) { Play(MessageRequest, Client, Action, Options, Entry); }
        if (Action == PlayerAction.join) { Join(MessageRequest, Client, Action, Options, Entry); }
        if (Action == PlayerAction.stop) { Stop(MessageRequest, Client, Action, Options, Entry); } 
    }, () => {
        var Entry: QueueEntry = {
            guild: Guild.id,
            queue: []
        };
        queue.queue.push(Entry);
        Player(MessageRequest, Client, Action, Options);
    }).catch((err) => { console.log(err) });
}

function Play(MessageRequest: Message, Client: Client, Action: PlayerAction, Options: PlayerOptions, Entry: QueueEntry) {
    if (Options.url != undefined || Options.url != '') {
        Entry.queue.push(Options.url);
        return MessageRequest.channel.send(`Added to queue.`)
    }
    else {
        console.log("No URL supplied");
        return;
    }   
}

function Join(MessageRequest: Message, Client: Client, Action: PlayerAction, Options: PlayerOptions, Entry: QueueEntry) {
    var voiceChannel = MessageRequest.member.voiceChannel;

    if (!voiceChannel) {
        return MessageRequest.reply('Join a voice channel first!');
    }

    voiceChannel.join()
        .then((connection: VoiceConnection) => { 
            return P(connection, Entry.queue[0].valueOf(), voiceChannel);
        })
        .catch(console.error);
}

function P(connection:VoiceConnection, URL: string, VoiceChannel: VoiceChannel) {
    var stream = ytdl(URL, { filter: 'audioonly' });
    stream.on('error', (err:any)=>{console.log(err)});
    var dispatcher = connection.playStream(stream, { seek: 0, volume: 1});

    dispatcher.on('error', (a) => { VoiceChannel.leave(); console.error; console.log(a) });
    dispatcher.on('end', (a) => { 
        GetQueueForGuild(VoiceChannel.guild.id).then(
            (Entry) => { 
                Entry.queue.unshift();
                if (Entry.queue.length == 0) { VoiceChannel.leave(); return; }
                P(connection, Entry.queue[0].valueOf(), VoiceChannel);
            }, () => {
                VoiceChannel.leave(); return;
            }
        ).catch(console.error);
    });
}

function Stop(MessageRequest: Message, Client: Client, Action: PlayerAction, Options: PlayerOptions, Entry: QueueEntry) {
    var channels = MessageRequest.guild.channels;
    
    channels.forEach((channel: VoiceChannel) => {
        if (channel.type == 'voice') {
            channel.leave();
        }
    });
}


export function GetQueueForGuild(ID: String) : Promise<QueueEntry> {
    return new Promise<QueueEntry> ((resolve, reject)=> {
        console.log(queue);
        if (queue.queue.length == 0) return reject();
        queue.queue.forEach((Entry) => {
            if (Entry.guild == ID) return resolve(Entry);
        }, () => {
            return reject()
        })
    })
}

export class PlayerOptions {
    url: string;
}

class Queue {
    queue: QueueEntry[] = [];
}

interface QueueEntry {
    guild: String;
    queue: String[];
}

export enum PlayerAction {
    play,
    stop,
    join
}

var queue = new Queue();