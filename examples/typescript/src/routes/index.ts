
import { Route, RouteController, ArgParseOptions, ArgsModel } from '../../../../lib';
import { Message, Client } from 'discord.js';
import { Help } from './help';
import { Hello } from './hello';

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
let Default : ArgParseOptions = {
    name: '!default',
    flags: [],
    getValue: true
};
let ArgsHelp : ArgParseOptions = {
    name: 'help',
    flags: ['-h', '--help']
};
let ArgValue : ArgParseOptions = {
    name: 'value',
    flags: ['-v', '--value'],
    getValue: true
};
TestArgsParse.push(Default);
TestArgsParse.push(ArgsHelp);
TestArgsParse.push(ArgValue);


export const Routes : Route[] = [
    { name:'prefix', alias: config.prefixes, children: [
        { name:'hello', controller: Hello, alias: ['hello', 'hi', 'hey', 'hoi'], children: [] },
        { name:'help', controller: Help, alias: ['help', 'h'], children: [] },
        { name:'github', controller: Github, alias: ['git', 'github'], children: [] },
        { name: 'search', controller: Search, alias: ['search'], children: [], argOptions: TestArgsParse }
    ] },
    { name:"good", alias: ['good'], children: [{ name:"bot", alias: ['bot'], controller: GoodBot, children: []}]}
]