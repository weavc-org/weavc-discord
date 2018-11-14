const ytdl = require('ytdl-core');
var buildresponse = require('../helpers/response');


class play {

    constructor(message, req, client) {
        this.message = message;
        this.req = req;
        this.client = client;
    }

    go(response) {
        var voiceChannel = this.req.member.voiceChannel;

        if (!voiceChannel) {
            return response(buildresponse('text', 'Join a voice channel'));
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