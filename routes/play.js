const ytdl = require('ytdl-core');
var res_helper = require('../helpers/response');
var class_router = require('../helpers/class_router');


class play {

    constructor(message, req, client) {
        this.message = message;
        this.req = req;
        this.client = client;
        this.routes = [
            { name: 'play', alias:[], match_case: false },
            { name: 'stop', alias:['stop'], match_case: false }
        ];
    }

    go(response) {
        var route = class_router(this.routes, this.message[1]);
        this[route](response);
    }

    stop(response) {
        var channels = this.req.member.guild.channels;
        channels.forEach((channel) => {
            if (channel.type == 'voice') {
                channel.leave();
            }
        });
        
        return response(
            res_helper.build(
                res_helper.types.text, 'Okay')
            );

    }

    play(response) {
        var voiceChannel = this.req.member.voiceChannel;

        if (!voiceChannel) {
            return response(
                res_helper.build(
                    res_helper.types.text, 'Join a voice channel')
                );
        }

        voiceChannel.join()
            .then(connection => {
                var stream = ytdl(this.message[1], { filter: 'audioonly' });
                stream.on('error', (err)=>{console.log(err)});
                return connection.playStream(stream, { seek: 0, volume: 1});
            })
            .then(dispatcher => {
                dispatcher.on('error', (a) => { voiceChannel.leave(); console.error; console.log(a) });
                dispatcher.on('end', (a) => { voiceChannel.leave(); console.log(a)});
            })
            .catch(console.error);
    }

}
module.exports = play;