import { Message, Client } from 'discord.js';

/**
 * @name Hello
 * @function
 * 
 * @description 
 * Hello route, sends a greeting as a reply
 * 
 * @param Message 
 * @param MessageRequest 
 * @param Client 
 */
export function Hello(Message: String[], MessageRequest: Message, Client: Client) {
    
    var Greetings = ['Hello!', 'Hi', 'Heya', 'o/', 'Hello ^-^'];
    return MessageRequest.reply(Greetings[Math.floor(Math.random() * (Greetings.length))]);

}