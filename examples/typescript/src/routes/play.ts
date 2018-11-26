const ytdl = require('ytdl-core');
import { Message, Client, VoiceConnection, VoiceChannel } from 'discord.js';
import { Player, PlayerAction, PlayerOptions, RouteController } from  '../../../../'


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

    Play: RouteController = (Message: String[], MessageRequest: Message, Client: Client) => {
        var options = new PlayerOptions();
        options.url = Message[1].valueOf();
        Player(MessageRequest, Client, PlayerAction.play, options);
    }

    Stop: RouteController = (Message: String[], MessageRequest: Message, Client: Client) => {
        Player(MessageRequest, Client, PlayerAction.stop, null); 
        return MessageRequest.reply('Yes sir!');
    }

    Join: RouteController = (Message: String[], MessageRequest: Message, Client: Client) => {
        Player(MessageRequest, Client, PlayerAction.join, null);
    }
    
    Skip: RouteController = (Message: String[], MessageRequest: Message, Client: Client) => {
        Player(MessageRequest, Client, PlayerAction.skip, null);
    }

    Queue: RouteController = (Message: String[], MessageRequest: Message, Client: Client) => {
        Player(MessageRequest, Client, PlayerAction.queue, null);
    }

    Clear: RouteController = (Message: String[], MessageRequest: Message, Client: Client) => {
        Player(MessageRequest, Client, PlayerAction.clear, null);
    }
}

export var Play = new play();


