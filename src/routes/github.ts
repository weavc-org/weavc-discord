import { iRouteClass, iRoute } from '../helpers/router';
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
export class Github implements iRouteClass {
    Routes: iRoute[] = [];

    Message: String[];
    MessageRequest: Message;
    Client: Client;

    constructor(
        Message: String[],
        MessageRequest: Message,
        Client: Client) {
        this.Message = Message;
        this.MessageRequest = MessageRequest;
        this.Client = Client;
    }


    default(context: Github, response: Function) {
        return context.MessageRequest.channel.send('https://github.com/ChrisWeaver1/discord-bot');
    }
}