"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ytdl = require('ytdl-core');
const response_1 = require("../helpers/response");
class Play {
    constructor(message, req, client) {
        this.Routes = [
            { name: 'stop', route: this.stop, alias: ['stop', 's'], matchcase: false }
        ];
        this.message = message;
        this.req = req;
        this.client = client;
    }
    default(context, response) {
        var voiceChannel = context.req.member.voiceChannel;
        if (!voiceChannel) {
            return response(response_1.Build('Join a voice channel first!', response_1.ContentTypes.text, response_1.ResponseTypes.reply));
        }
        voiceChannel.join()
            .then((connection) => {
            var stream = ytdl(context.message[1], { filter: 'audioonly' });
            stream.on('error', (err) => { console.log(err); });
            return connection.playStream(stream, { seek: 0, volume: 1 });
        })
            .then(dispatcher => {
            dispatcher.on('error', (a) => { voiceChannel.leave(); console.error; console.log(a); });
            dispatcher.on('end', (a) => { voiceChannel.leave(); console.log(a); });
        })
            .catch(console.error);
    }
    stop(context, response) {
        var channels = context.req.member.guild.channels;
        //might throw
        channels.forEach((channel) => {
            if (channel.type == 'voice') {
                channel.leave();
            }
        });
        return response(response_1.Build('Yes sir!', response_1.ContentTypes.text, response_1.ResponseTypes.reply));
        ;
    }
}
exports.Play = Play;
