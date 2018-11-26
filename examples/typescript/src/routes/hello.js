"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
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
exports.Hello = (Message, MessageRequest, Client) => {
    var Greetings = ['Hello!', 'Hi', 'Heya', 'o/', 'Hello ^-^'];
    return MessageRequest.reply(Greetings[Math.floor(Math.random() * (Greetings.length))]);
};
