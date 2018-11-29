"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
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
exports.Github = (Args, MessageRequest, Client) => {
    return MessageRequest.channel.send('https://github.com/ChrisWeaver1/weav-discord');
};
