import { Message, Client } from 'discord.js';

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
export function Github (Message: String[], MessageRequest: Message, Client: Client) {
    return MessageRequest.channel.send('https://github.com/ChrisWeaver1/discord-bot');
}