"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const help_1 = require("../routes/help");
const github_1 = require("../routes/github");
const hello_1 = require("../routes/hello");
const play_1 = require("../routes/play");
var Routes = [
    { name: 'default', route: help_1.Help, alias: [], matchcase: false },
    { name: 'hello', route: hello_1.Hello, alias: ['hello', 'hi', 'hey', 'hoi'], matchcase: false },
    { name: 'help', route: help_1.Help, alias: ['help', '-h'], matchcase: false },
    { name: 'play', route: play_1.Play, alias: ['play'], matchcase: false },
    { name: 'github', route: github_1.Github, alias: ['git', 'github'], matchcase: false },
];
function Router(message, req, client, res) {
    var ClassRoute = undefined;
    var InnerRoute = undefined;
    /**
     * initial command
     * cycles through the routes defined at top of this document.
     * matches first arg of user message to an alias of the route.
     * defaults to first index of routes (routes[0])
     */
    if (message[0]) {
        Routes.forEach((r) => {
            let initial_command = message[0];
            if (!r.matchcase) {
                r.alias = matchcase_false(r.alias);
                initial_command = initial_command.toLowerCase();
            }
            if (r.alias.some(x => x === initial_command)) {
                ClassRoute = new r.route(message, req, client);
            }
        });
    }
    if (ClassRoute == undefined) {
        ClassRoute = new Routes[0].route(message, req, client);
    }
    /**
     * secondary command
     * cycles through routes in matched route class
     * matches second arg of user message to an alias in class routes
     * defaults to route.default function
     */
    if (message[1]) {
        ClassRoute.Routes.forEach((r) => {
            let secondary_command = message[1];
            if (!r.matchcase) {
                r.alias = matchcase_false(r.alias);
                secondary_command = secondary_command.toLowerCase();
            }
            if (r.alias.some(x => x === secondary_command)) {
                InnerRoute = r.route;
            }
        });
    }
    if (InnerRoute == undefined) {
        InnerRoute = ClassRoute.default;
    }
    //execute matched route, wait for response
    InnerRoute(ClassRoute, (response) => {
        res(response);
    });
}
exports.Router = Router;
function matchcase_false(array) {
    for (var x = 0; x < array.length; x++) {
        array[x] = array[x].toLowerCase();
    }
    return array;
}
