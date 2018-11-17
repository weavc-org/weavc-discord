
import { Build, ResponseModel, ResponseTypes, ContentTypes } from '../helpers/response';
import { iRouteClass, iRoute } from '../helpers/router';
import { Message, Client } from 'discord.js';

export class Hello implements iRouteClass {
    Routes: iRoute[] = [
        { name: 'hello2', route: this.hello2, alias:['.'], matchcase: false }
    ];

    message: String[];
    req: Message;
    client: Client;

    constructor(
        message: String[], 
        req: Message, 
        client: Client) 
    {
        this.message = message;
        this.req = req;
        this.client = client;
    }

    default(context: Hello, response: Function) {
        return response(
            Build('Hello!', ContentTypes.text, ResponseTypes.reply));
    }

    hello2(context: Hello, response: Function) {
        return response(
            Build('Hi', ContentTypes.text, ResponseTypes.reply));
    }
}