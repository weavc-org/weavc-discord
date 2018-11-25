const ytdl = require('ytdl-core');
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
class play {

    constructor(){}

    Play(Message: String[], MessageRequest: Message, Client: Client) {
        var voiceChannel = MessageRequest.member.voiceChannel;

        if (!voiceChannel) {
            return MessageRequest.reply('Join a voice channel first!');
        }
        voiceChannel.join()
            .then((connection: VoiceConnection) => {
                var stream = ytdl(Message[1], { filter: 'audioonly' });
                stream.on('error', (err:any)=>{console.log(err)});
                return connection.playStream(stream, { seek: 0, volume: 1});
            })
            .then(dispatcher => {
                dispatcher.on('error', (a) => { voiceChannel.leave(); console.error; console.log(a) });
                dispatcher.on('end', (a) => { voiceChannel.leave(); console.log(a)});
            })
            .catch(console.error);
    }

    Stop(Message: String[], MessageRequest: Message, Client: Client) {
        var channels = MessageRequest.member.guild.channels;
        
        channels.forEach((channel: VoiceChannel) => {
            if (channel.type == 'voice') {
                channel.leave();
            }
        });
        
        return MessageRequest.reply('Yes sir!');
    }
}

export var Play = new play();


// class Deep {
//     constructor() {

//     }
//     Deeper (Message: String[], MessageRequest: Message, Client: Client) {
//         MessageRequest.reply('Deeper');
//     }
// }

// class Play2 {

//     constructor() {

//     }

//     Play (Message: String[], MessageRequest: Message, Client: Client) {
//         MessageRequest.reply('Play');
//     }

//     Stop (Message: String[], MessageRequest: Message, Client: Client) {
//         MessageRequest.reply('Stop');
//     }

//     Deep: Deep = new Deep();
// }
// // var Playx = new Play2()


