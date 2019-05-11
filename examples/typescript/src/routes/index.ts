
import { Route, RouteController, ArgParseOptions, ArgsModel } from '../../../../lib';
import { Message, Client } from 'discord.js';
import { Help } from './help';
import { Hello } from './hello';
import { Play } from './play';

try {
	var config = require('../../../config');
}
catch (err) {
	console.log("Could not find config. Run 'npm run config' to generate file, then fill out the values at examples/config.json")
	process.exit();
}

export var GoodBot : RouteController = (Args: String[], MessageRequest: Message, Client: Client) => {
    return MessageRequest.reply('good human!');
}

export var Github : RouteController = (Args: String[], MessageRequest: Message, Client: Client) => {
    return MessageRequest.channel.send('https://github.com/ChrisWeaver1/weav-discord');
}

export var Search : RouteController = (Args: String[], MessageRequest: Message, Client: Client, ArgModel: ArgsModel) => {
    console.log(ArgModel);
}

let TestArgsParse : ArgParseOptions[] = [];
let ArgsSearch : ArgParseOptions = {
    name: 'search',
    flags: ['-s', '--search', 'search'],
    getValue: true
};
let ArgsHelp : ArgParseOptions = {
    name: 'help',
    flags: ['-h', '--help']
};
TestArgsParse.push(ArgsSearch);
TestArgsParse.push(ArgsHelp);


export var Routes : Route[] = [
    { name:'prefix', alias: config.prefixes, children: [
        { name:'hello', controller: Hello, alias: ['hello', 'hi', 'hey', 'hoi'], children: [] },
        { name:'help', controller: Help, alias: ['help', 'h'], children: [] },
        { name:'player', alias: ['p', 'player'], children: [
            { name:'add', controller: Play.Add, alias: ['add', 'a'], children: [], default: true},
            { name:'stop', controller: Play.Stop, alias: ['stop', 's'], children: [] },
            { name:'play', controller: Play.Play, alias: ['join', 'j', 'play', 'p'], children: [] },
            { name:'skip', controller: Play.Skip, alias: ['skip'], children: [] },
            { name:'queue', controller: Play.Queue, alias: ['q', 'queue'], children: [] },
            { name:'clear', controller: Play.Clear, alias: ['c', 'clear'], children: [] },
            { name:'volume', controller: Play.Volume, alias: ['v', 'volume'], children: [] },
            { name:'help', controller: Play.Help, alias: ['help', 'h'], children: [] }
        ]},
        { name:'github', controller: Github, alias: ['git', 'github'], children: [] },
        { name: 'search', controller: Search, alias: ['search'], children: [], argOptions: TestArgsParse }
    ] },
    { name:"good", alias: ['good'], children: [{ name:"bot", alias: ['bot'], controller: GoodBot, children: []}]}
]