import { iRouteClass, iRoute } from '../helpers/router';
import { Message, Client } from 'discord.js';


export class Github implements iRouteClass {
    Routes: iRoute[] = [];

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

    default(context: Github, response: Function) {
        return context.req.channel.send('https://github.com/ChrisWeaver1/discord-bot');
    }
}