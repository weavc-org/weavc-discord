const ytdl = require('ytdl-core');
var res_helper = require('../helpers/response');


class play {

    constructor(message, req, client) {
        this.message = message;
        this.req = req;
        this.client = client;
        this.routes = [
            { name: 'stop', alias:['stop', 's'], match_case: false }
        ];
    }

    default(response) {
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

}
module.exports = play;