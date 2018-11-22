import { iRouteClass, iRoute } from '../helpers/router';
import { Message, Client } from 'discord.js';

/**
 * @name Hello
 * @class
 * @description 
 * Github routing class.
 * Handles any message requests matching the hello routes alias'.
 * 
 * @alias hello, hi, hey, hallo
 * @function default - 
 * default route for messages not containing a secondary matching command.
 * Sends link to github repo
 * @function hello2 - 
 * Testing function for secondary commands
 */
export class Hello implements iRouteClass {
    Routes: iRoute[] = [
        { name: 'hello2', route: this.hello2, alias:['.'], matchcase: false }
    ];

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


    default(context: Hello, response: Function) {
        return context.MessageRequest.reply(`Hello!`);
    }

    hello2(context: Hello, response: Function) {
        return context.MessageRequest.reply(`hi`);
    }
}