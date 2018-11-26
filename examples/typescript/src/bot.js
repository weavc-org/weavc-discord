"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const lib_1 = require("../../../lib");
const discord_js_1 = require("discord.js");
const help_1 = require("../src/routes/help");
const github_1 = require("../src/routes/github");
const hello_1 = require("../src/routes/hello");
const play_1 = require("../src/routes/play");
try {
    var config = require('../../config');
}
catch (err) {
    console.log("Could not find config. Run 'npm run config' to generate file, then fill out the values at examples/config.json");
    process.exit();
}
/**
 * @name Routes
 * @description
 * Array of valid class routes.
 * If one of the alias' matches the first index of Message, use matched class.
 * Defaults to index 0.
 */
var Routes = [
    { name: 'hello', controller: hello_1.Hello, alias: ['hello', 'hi', 'hey', 'hoi'], children: [] },
    { name: 'help', controller: help_1.Help, alias: ['help', '-h'], children: [] },
    { name: 'player', alias: ['p', 'player'], children: [
            { name: 'play', controller: play_1.Play.Play, alias: [], children: [], default: true },
            { name: 'stop', controller: play_1.Play.Stop, alias: ['stop', 's'], children: [] },
            { name: 'join', controller: play_1.Play.Join, alias: ['join', 'j', 'p', 'play'], children: [] },
            { name: 'skip', controller: play_1.Play.Skip, alias: ['skip'], children: [] },
            { name: 'queue', controller: play_1.Play.Queue, alias: ['q', 'queue'], children: [] },
            { name: 'clear', controller: play_1.Play.Clear, alias: ['c', 'clear'], children: [] }
        ] },
    { name: 'github', controller: github_1.Github, alias: ['git', 'github'], children: [] },
];
const client = new discord_js_1.Client();
var router;
client.on('ready', () => {
    config.prefixes.push('<@' + client.user.id + '>');
    router = new lib_1.Router(Routes, config.prefixes);
    console.log(`Logged in as ${client.user.tag}!`);
    process.on('uncaughtException', function (err) {
        console.log('Caught exception: ' + err.toString());
    });
});
client.on('message', (msg) => {
    if (msg.content.toLowerCase() == "good bot")
        return msg.reply("good human");
    router.Go(msg, client);
});
client.login(config.token.valueOf())
    .catch((err) => {
    console.log(err);
    console.log("\nWe had trouble logging in with the provided token or there is a connection issue between yourself and discord. " +
        "\nPlease add your bot token provided by discord to examples/config.json");
    process.exit();
});
