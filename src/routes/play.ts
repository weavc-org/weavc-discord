const ytdl = require('ytdl-core');
import { Build, ResponseModel, ResponseTypes, ContentTypes } from '../helpers/response';
import { iRouteClass, iRoute } from '../helpers/router';
import { Message, Client, VoiceConnection, VoiceChannel } from 'discord.js';

export class Play implements iRouteClass {
    Routes: iRoute[] = [
        { name: 'stop', route: this.stop, alias:['stop', 's'], matchcase: false }
    ];

    message: String[];
    req: Message;
    client: Client;

    constructor(
        message: String[], 
        req: Message, 
        client: Client) 
    {
        this.message = message;
        this.req = req;
        this.client = client;
    }

    default(context: Play, response: Function) {
        var voiceChannel = context.req.member.voiceChannel;

        if (!voiceChannel) {
            return response(
                Build('Join a voice channel first!', ContentTypes.text, ResponseTypes.reply));
        }

        voiceChannel.join()
            .then((connection: VoiceConnection) => {
                var stream = ytdl(context.message[1], { filter: 'audioonly' });
                stream.on('error', (err:any)=>{console.log(err)});
                return connection.playStream(stream, { seek: 0, volume: 1});
            })
            .then(dispatcher => {
                dispatcher.on('error', (a) => { voiceChannel.leave(); console.error; console.log(a) });
                dispatcher.on('end', (a) => { voiceChannel.leave(); console.log(a)});
            })
            .catch(console.error);
    }

    stop(context: Play, response: Function) {
        var channels = context.req.member.guild.channels;
        //might throw
        channels.forEach((channel: VoiceChannel) => {
            if (channel.type == 'voice') {
                channel.leave();
            }
        });
        
        return response(
            Build('Yes sir!', ContentTypes.text, ResponseTypes.reply));;
    }

}