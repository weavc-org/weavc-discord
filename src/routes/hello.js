"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const response_1 = require("../helpers/response");
class Hello {
    constructor(message, req, client) {
        this.Routes = [
            { name: 'hello2', route: this.hello2, alias: ['.'], matchcase: false }
        ];
        this.message = message;
        this.req = req;
        this.client = client;
    }
    default(context, response) {
        return response(response_1.Build('Hello!', response_1.ContentTypes.text, response_1.ResponseTypes.reply));
    }
    hello2(context, response) {
        return response(response_1.Build('Hi', response_1.ContentTypes.text, response_1.ResponseTypes.reply));
    }
}
exports.Hello = Hello;
