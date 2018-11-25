# weav-discord (discordjs)
### WORK IN PROGRESS
#### Description

Open source discord bot framework for nodejs.

#### What does it do? 

I am aiming to build a framework in which others can build up there own projects from. There are 2 core components that allow this to happen along with a number of utilities.

##### Router

The Router is the core of the project, it handles the discord messages sent by users and selects the correct route to take through the program based on the content of the messages. 
                                                                                                                                                                                                                   
When creating a new instance of the Router class, you will need to pass through your list of valid routes. It will use these to make decisions on what happens next.

##### Routes

A route is a function or class which can be triggered by the router. Functions act as end points, classes extend the functionallity of a route. More detail to follow at a later date.

#### Can I use this?

At the moment this project is in rather early development. However if you want to try.. go ahead. 

##### Please note: 

1. You may have issues installing/compiling all of the dependancies - especially on windows. "node-opus" is usually the one that will cause people issues.
1. Due to it being in an early stage of development I will likely be pushing breaking changes every now and again. 

##### ~~Setup~~ This has/is changing
```
git clone git@github.com:ChrisWeaver1/weav-discord.git
cd discord-bot
npm install
npm start
```

Run through the setup now, or fill out config.json in the src folder manually.

Docker:
```
npm run docker
```~~