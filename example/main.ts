import { RouteHandler, Router, Route, ArgParser, Pager } from '../lib/';
import { Message, Client, MessageEmbed } from 'discord.js';


let grettingsHandler : RouteHandler = (message, client) => {
    let m = `Logged in as ${client.user.tag}!`;
    console.log(m)
    return message.reply('hello!');
}

let githubHandler : RouteHandler = (message, client) => {
    return message.reply('https://github.com/weavc/weavc-discord');
}

let codeHandler : RouteHandler = (message, client, args) => {
    
    // example message: 'weavc code 'console.log('hello world')' -t javascript'
    
    // using small subset of actual valid types
    let validTypes = ['css', 'javascript', 'html', 'python']
    
    if (!args.getExists('type') || !args.getExists('[default]')) {
        return codeUsage(message, client, args);
    }  

    let dVal = args.getValue('[default]');
    let cVal = args.getValue('type');

    if (validTypes.indexOf(cVal) == -1) {
        return codeUsage(message, client, args);
    }

    let bTicks = '```'

    return message.channel.send(`${bTicks}${cVal}\n${dVal}\n${bTicks}`)
}

let codeUsage : RouteHandler = (message, client, args) => {
    return message.reply("```Usage:\nweavc code '<code body>' -t <type>"+
        "\nvalid types: css, javascript, html, python```")
}

let pagerHandler : RouteHandler = (message, client, args) => {
    let m1: MessageEmbed = new MessageEmbed()
        .setTitle('Page 1')
        .setColor(0xb5130f)
        .addField('test field', 'just a field for testing!')
        .setAuthor(client.user.username, client.user.avatarURL())
        .setTimestamp(new Date())

    let m2: MessageEmbed = new MessageEmbed()
        .setTitle('Page 2')
        .setColor(0xb5130f)
        .setDescription('Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor '+
            'incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation '+
            'ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in '+
            'reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint '+
            'occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.')
        .setAuthor(client.user.username, client.user.avatarURL())
        .setTimestamp(new Date())

    let m3: MessageEmbed = new MessageEmbed()
        .setTitle('Page 3')
        .setColor(0xb5130f)
        .setAuthor(client.user.username, client.user.avatarURL())
        .setTimestamp(new Date())

    return Pager(message, client, [m1, m2, m3]);
}

let codeArgs : ArgParser[] = [
    { name: 'type', flags: ['-t', '--type'], getValue: true },
    { name: '[default]', flags: [], getValue: true }
]

let routes : Route[] = [
    { name: 'prefix', alias: ['weav', 'weavc'], children: [
        { name: 'welcome', alias: ['hello', 'hi', 'welcome'], handler: grettingsHandler },
        { name: 'github', alias: ['github', 'git'], handler: githubHandler },
        { name: 'pager', alias: ['pager'], handler: pagerHandler },
        { name: 'code', alias: ['c', 'code'], args: codeArgs, handler: codeHandler, children: [
            { name: 'code-help', alias: ['help', '--help', '?'], handler: codeUsage },
        ] }
    ] }
]

async function start() {

    let token = process.env.DISCORD_TOKEN;
    let userid = process.env.DISCORD_USER;

    if (!token) {
        throw 'Discord bot token is required.' +
            '\nSet environment variable DISCORD_TOKEN with the bot token found here: ' +
            'https://discordapp.com/developers/applications/';
    }

    if (!userid) {
        throw 'Discord User ID is required.' +
            '\nSet environment variable DISCORD_USER';
    }
    
    let router = new Router(routes);
    let client = new Client();

    
    client.login(token)
    .catch((err) => { throw err; });

    client.on('message', (message) => { router.Go(message) });
    client.on('ready', async () => { 
        let m = `Logged in as ${client.user.tag}!`;
        console.log(m)
        let chan = await client.users.fetch(userid);
        if (!chan) return;
		chan.send(m);
    });
}

start();