const ytdl = require('ytdl-core');
import { Message, Client, VoiceConnection, VoiceChannel } from 'discord.js';
import { Player, PlayerAction, PlayerOptions, RouteController, Result } from  '../../../../'


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

    Add: RouteController = (Args: String[], MessageRequest: Message, Client: Client) => {
        var options = new PlayerOptions();
        options.url = Args[2]+'';
        Player(MessageRequest, Client, PlayerAction.add, options, (promise: Promise<Result>) => {
            promise.then((resolve) => {
                if (resolve.message == 'added-to-queue') {
                    return  MessageRequest.channel.send(`Added ${resolve.payload} to the queue.`);
                }
                if (resolve.message == 'not-a-video' || resolve.message == 'no-url') {
                    return  MessageRequest.channel.send(`Invalid URL given`);
                }
                if (resolve.message == 'max-queue-size') {
                    return MessageRequest.channel.send('Queue is at max capacity (10). You can skip songs using `player skip` command or clear the queue using `player clear`');
                }
            }).catch(console.error)
        });
    }

    Stop: RouteController = (Args: String[], MessageRequest: Message, Client: Client) => {
        Player(MessageRequest, Client, PlayerAction.stop, null); 
        return MessageRequest.reply('Yes sir!');
    }

    Play: RouteController = (Args: String[], MessageRequest: Message, Client: Client) => {
        Player(MessageRequest, Client, PlayerAction.play, null);
    }
    
    Skip: RouteController = (Args: String[], MessageRequest: Message, Client: Client) => {
        Player(MessageRequest, Client, PlayerAction.skip, null);
    }

    Queue: RouteController = (Args: String[], MessageRequest: Message, Client: Client) => {
        Player(MessageRequest, Client, PlayerAction.queue, null);
    }

    Clear: RouteController = (Args: String[], MessageRequest: Message, Client: Client) => {
        Player(MessageRequest, Client, PlayerAction.clear, null);
    }
}

export var Play = new play();


