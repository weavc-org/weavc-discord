# weav-discord (discordjs)
### WORK IN PROGRESS
#### Please note: 
Due to this project being in the early stages of development, I will likely be pushing breaking changes every now and again. This will include changes to variable names, interfaces and functionality. If you aren't wiling to deal with this, please hold tight and wait for an official release.

### Description

An Open source framework for helping to build discord bots/applications.

#### What does it do? 

The aim for version 1.0 is to provide users with common utilities that are often used in discord bots i.e. Audio playback, Paging embeds with reactions and routing messages to the correct function based on the given arguments, without having long lists of if statements.

At the moment these are the primary focus of the project.

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
 * default - The default child route. Will always use the first one if there are multiple.

The Router uses these routes to select the correct controller to pass the request on to, much like you will see in web frameworks like MVC or expressjs.

I have plans to expand this at a later date, possibly parsing variables from the request, allowing people to define variables in the route (again like express and mvc offer). Also prefixes might only be needed for certain routes, so I might revisit how these are used.

#### Pager 

Detail to come. See examples/typescript for now.

#### Player

Detail to come. See examples/typescript for now.

### Can I use this?

At the moment this project is in rather early development, See note at top. However if you want to try.. go ahead. 

#### Installation

To build the depenancies for this project, you will likely need to do afew things before installing this. This is mostly due to the Player (Audio playback from youtube) needing node-opus, ffmpeg and ytdl-core to run. I may split this into a seperate package at some date so these aren't required dependancies.

##### Windows - windows-build-tools
Note: Running the project from windows subsystem (Ubuntu) you will have issues with the Player. Run it from powershell instead.
```
Open an admin powershell and run the following: 

npm install -g windows-build-tools
npm install -g node-gyp
```

##### Linux 
```
apt-get install python make g++ gcc
```

At this point you _should_ be able compile all of the dependancies. Go ahead and install weav-discord.
```
npm install weav-discord
```

##### Windows follow-up

If you are having issues installing this, make sure the previous steps finished correctly without errors, if they didn't, try running them once again. It may also be worth closing all instances of Powershell (this includes VSCode or any other editor with built in PS) and restart them. 

If you are still struggling, it might be best to read through the help and installation sections on the following pages:

- [node-gyp](https://github.com/nodejs/node-gyp)
- [windows-build-tools](https://github.com/felixrieseberg/windows-build-tools)

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
