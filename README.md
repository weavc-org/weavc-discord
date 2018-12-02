# weav-discord-lite

[![NPM](https://nodei.co/npm/weav-discord-lite.png)](https://nodei.co/npm/weav-discord-lite/)

Note: This is the lite version of the package. It comes with everything except the audio playback from youtube and the dependancies that come with that. For the full verson, with Youtube playback etc follow the links below.
- [npm](https://www.npmjs.com/package/weav-discord)
- [github](https://github.com/ChrisWeaver1/weav-discord)

### Description

An Open source framework for helping to build common functionallity in discord bots. Builds off of discord.js to give developers access to common utilities that can be a pain to create yourself.

#### What does it do? 

The aim for version 1.0 is to provide users with common utilities that are often used in discord bots i.e. Audio playback, Paging embeds with reactions and routing messages to the correct function based on matching arguments inside a message, without having long lists of if statements.

### Components

#### Router

The Router is the core of the project, it handles the discord messages sent by users and selects the correct route to take through the program based on the content of the message. 

On creation of a new router instance it will expect to be passed an array of valid routes and also a array of valid prefixes for your bot. The routes given must follow the Route interface as defined below.

```
export interface Route {
    name: String,
    controller?: RouteController,
    alias: String[],
    children?: Route[],
    default?: Boolean,
}

export interface RouteController {
    (Message: String[], MessageRequest: Message, Client: Client): void,
}
```
 * name - Name of the route. Not used for anything. Might use it for routing in future.
 * controller - Function the request should be passed to if route matches.
 * alias - Array of alias' to match on. i.e. ['help', 'h']
 * children - Child routes. See examples/typescript for more detail. But matches parent, then looks to see if the next index matches any of the children. If not it will go to the default child route.
 * default - Defines the default child route. Will always use the first one if there are multiple.

The Router uses these routes to select the correct controller to pass the request on to, much like you will see in web frameworks like MVC or expressjs.

I have plans to expand this at a later date, possibly parsing variables from the request, allowing people to define variables in the route (again like express and mvc offer). Also prefixes might only be needed for certain routes, so I might revisit how these are used.

#### Pager 

The Pager is a simple way to handle paging embeds in discord. This is often functionality used in help pages for a bot or anything that requires more than just a single page of information. 

##### Usage

The pager is pretty simple to use, you generate your embeds using discord.js' RichEmbed builder, add them all to an array (In the correct order) then send them through to the Pager, alongside your Client Class instance and the Message that triggered it to handle to rest. The Pager also takes options allowing you to apply different controls from the default.

```
import { Message, Client, RichEmbed } from 'discord.js';
import { PagingOptions, Pager, RouteController } from '../../../../lib/';

var Page1 = new RichEmbed()
    .setColor(0xb5130f)
    .setTitle("This is Page 1")

var Page2 = new RichEmbed()
    .setColor(0xb5130f)
    .setTitle("This is Page 2")

var Page3 = new RichEmbed()
    .setColor(0xb5130f)
    .setTitle("This is Page 3") 

var embeds: Array<RichEmbed> = [Page1, Page2, Page3]

var options = new PagingOptions();
options.allowallreactions=true;
options.timeout=100000;
options.reactionremoval=true;
options.startpage=1;
options.timeoutdelete = false;

Pager(MessageRequest, Client, embeds, options);
```

##### PagingOptions

- allowallreactions ~ Allows all users to trigger pages if true, only the requesting user can trigger them otherwise. 
- timeout ~ The time it takes for the bot stop stop responding to reactions on this message.
- reactionremoval ~ Triggers the page event on both addition and removal of the reaction.
- timeoutdelete ~ Deletes the embed message once it has timed out.


Full example of paging usage can be found here: [examples/typescript/src/routes/help.ts](https://github.com/ChrisWeaver1/weav-discord/blob/master/examples/typescript/src/routes/help.ts)

### Can I use this?

At the moment this project is in rather early development, See note at top. However if you want to try.. go ahead. 

#### Installation

The lite version is simple to install at the moment, since we don't have to build any of the pesky depancies that come with audio/voice playback.
```
npm install weav-discord-lite
```

#### Examples

You can also use the [examples](https://github.com/ChrisWeaver1/weav-discord/tree/master/examples) from this project, the Typescript example is much more complete then the javascript one, so I recommend using that. They are just simple Discord bots using weav-discord to control routes, paging and audio playback. For the moment the examples are the best reference for a how-to on using weav-discord.

You will have to follow the same steps as above so you can build the depencies. Then:

```
git clone git@github.com:ChrisWeaver1/weav-discord.git
cd discord-bot
npm install
npm run config
[text-editor] examples/config.json 
*fill out token and prefixes. Windows users my also have to remove the quote marks at start and end of the json.*
npm start
```

##### Docker
```
run:
npm run docker

debugging: 
npm run docker:attached
```

You can edit the package.json commands to fit with your own needs for Docker, the one in there is what I use to host my bot. It will build the project, try to stop and remove the current instance of weav-discord, then run the new version.

-----

I don't think this will get too much traction, this project was mostly just something I wanted to do for myself and to help out a friend who has just started developing and was interested in creating a discord bot. If you are having any issues feel free to contact me via one of methods below or create an issue. Thanks (:

- Email: chris.weaver.work@gmail.com
- Discord: [Chris#7901](https://discordapp.com/users/206875427631923200)