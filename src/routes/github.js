"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const response_1 = require("../helpers/response");
class Github {
    constructor(message, req, client) {
        this.Routes = [];
        this.message = message;
        this.req = req;
        this.client = client;
    }
    default(context, response) {
        return response(response_1.Build('https://github.com/ChrisWeaver1/discord-bot', response_1.ContentTypes.text, response_1.ResponseTypes.reply));
    }
}
exports.Github = Github;
