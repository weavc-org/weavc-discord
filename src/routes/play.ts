const ytdl = require('ytdl-core');
import { iRouteClass, iRoute } from '../helpers/router';
import { Message, Client, VoiceConnection, VoiceChannel } from 'discord.js';


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
export class Play implements iRouteClass {
    Routes: iRoute[] = [
        { name: 'stop', route: this.stop, alias:['stop', 's'], matchcase: false }
    ];

    Message: String[];
    MessageRequest: Message;
    Client: Client;

    constructor(
        Message: String[],
        MessageRequest: Message,
        Client: Client) {
        this.Message = Message;
        this.MessageRequest = MessageRequest;
        this.Client = Client;
    }


    default(context: Play) {
        var voiceChannel = context.MessageRequest.member.voiceChannel;

        if (!voiceChannel) {
            return context.MessageRequest.reply('Join a voice channel first!');
        }
        voiceChannel.join()
            .then((connection: VoiceConnection) => {
                var stream = ytdl(context.Message[1], { filter: 'audioonly' });
                stream.on('error', (err:any)=>{console.log(err)});
                return connection.playStream(stream, { seek: 0, volume: 1});
            })
            .then(dispatcher => {
                dispatcher.on('error', (a) => { voiceChannel.leave(); console.error; console.log(a) });
                dispatcher.on('end', (a) => { voiceChannel.leave(); console.log(a)});
            })
            .catch(console.error);
    }

    stop(context: Play) {
        var channels = context.MessageRequest.member.guild.channels;
        
        channels.forEach((channel: VoiceChannel) => {
            if (channel.type == 'voice') {
                channel.leave();
            }
        });
        
        return context.MessageRequest.reply('Yes sir!');
    }

}