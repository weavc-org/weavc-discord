## mogo-discord

Works inline with `discord.js` to provide some helpers preform some common tasks when writing discord bots. 

#### Usage

```
npm install @mogolade/mogo-discord@0.0.1
```

#### Examples 

Can be used to route messages that match specific criteria to a handler function by defining routes:
```javascript
let routes : Route[] = [
    { name: 'prefix', alias: ['mogo', 'mogolade'], children: [
        { name: 'welcome', alias: ['hello', 'hi', 'welcome'], handler: grettingsHandler },
        { name: 'github', alias: ['github', 'git'], handler: githubHandler },
        { name: 'code', alias: ['c', 'code'], args: codeArgs, handler: codeHandler, children: [
            { name: 'code-help', alias: ['help', '--help', '?'], handler: codeUsage },
        ] }
    ] }
]

let router = new Router(routes);
let client = new Client();

client.login(<token>)
    .catch((err) => { throw err; });

client.on('message', (message: Message) => { router.Go(message) });
```

Define and get flags & values from messages:
```javascript
// define flags and values
// [default] gets the first parameter after the matching route. 
// [default] only works when parsing through the router & calling ParseArgs directly
let args : ArgParseOptions[] = [
    { name: 'type', flags: ['-t', '--type'], getValue: true },
    { name: '[default]', flags: [], getValue: true }
]

// add 'argOptions: args' to the route model
let routes : Route[] = [
    { name: 'test', alias: ['t', 'test'], argOptions: args, handler: handler }
    ...
]

let handler : RouteHandler = (message, client, args) => {
    // incoming message: 'test 'hello world' - t TYPE_1'

    let dVal = args.getValue('!default');
    let cVal = args.getValue('type');

    // dVal: 'hello world'
    // cVal: 'TYPE_1'

    ...
}
```

Page through embeds using ⬅ ➡ reactions:
```javascript
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
```

full context & example found in `example/main.ts`
