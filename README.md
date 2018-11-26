# weav-discord (discordjs)
### WORK IN PROGRESS

#### Description

An Open source framework for helping to build discord bots/applications.

#### What does it do? 

The aim for version 1.0 is to provide users with common utilities that are often used in discord bots i.e. Audio playback, Paging embeds with emoji reactions and routing requests to the correct method in your application, without having long lists of if statements.

At the moment these 3 things are the focus of the project.

##### Router

The Router is the core of the project, it handles the discord messages sent by users and selects the correct route to take through the program based on the content of the messages. 

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

The Router uses these routes to select the correct controller to pass the request on to. 

I have plans to expand this at a later date, possibly parsing variables from the request, much like get requests in web frameworks like ASP and expressjs, allow people to define variables in the url. Also prefixes might only be needed for certain routes, say you wanted to log all messages or something similar so I might add some addition settings to Routes.

#### Pager 

Detail to come. See examples/typescript for now.

#### Player

Detail to come. See examples/typescript for now.

#### Can I use this?

At the moment this project is in rather early development right now. However if you want to try.. go ahead. 

#### Installation

To build the depenancies for this project you will likely need to do afew things before installing this. This is mostly due to the Player (Audio playback from youtube) needing node-opus, ffmpeg and ytdl-core to run. I may split this into a seperate package for this reason.

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

##### Then
```
npm install weav-discord
```

#### Please note: 
Due to this project being in the early stages of development I will likely be pushing breaking changes every now and again, as well as changes to variable names among other things to the master branch. If you aren't wiling to deal with this, please hold tight and wait for the official release.

##### Examples

To use the examples in this project is just like you would most other nodejs projects. You will have to follow the same steps as above so you can build the depencies. Then:

```
git clone git@github.com:ChrisWeaver1/weav-discord.git
cd discord-bot
npm install
npm run config
[text-editor] examples/config.json (fill out token and prefixes. Windows users my also have to remove the quote marks at start and end of the json.)
npm start
```

Using with Docker:
```
npm run docker
```

You can edit the package.json commands to fit with you own needs for Docker, the setup one is what I use.