import { Message, Client } from 'discord.js';
import { RouteController } from '../../../../lib'
/**
 * @name Github
 * @class
 * @description 
 * Github routing class.
 * Handles any message requests matching the github routes alias'.
 * 
 * @alias github, git
 * @function default - 
 * default route for messages not containing a secondary matching command.
 * Sends link to github repo
 */
export var Github : RouteController = (Args: String[], MessageRequest: Message, Client: Client) => {
    return MessageRequest.channel.send('https://github.com/ChrisWeaver1/weav-discord');
}