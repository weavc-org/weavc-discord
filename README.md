# discord-bot (discordjs)
### WORK IN PROGRESS
#### Description

Open source discord bot framework, with command routing, response builders, example uses and some other stuff.

#### Can I use this?

At the moment this project is in rather early development. However if you want to try.. go ahead. Notes on setup are below.

Please note you may have issue installing/compiling all of the dependancies - especially on windows. "node-opus" is usually the one that will cause people issues. I will add pointers for this at some point, just not now.

```
git clone git@github.com:ChrisWeaver1/discord-bot.git
cd discord-bot
npm install
[.....]
cp src/config-template.json src/config.json
[text editor] config.json
** Fill out variables & save ** (Writing a setup script for this is on the todo)
[.....]
npm start
```

With Docker (Do all steps above first) - good for getting around the dependancy issues mentioned above.
```
docker build . -t discord-bot:latest
docker run discord-bot <&>
```

#### TODO

In order of current priority

1. ~~Command: 'play stop' should leave voice channel regardless of if the user is in the channel~~
1. ~~Work out class routing, make it an extension of the router~~
1. ~~Paging on embeds with reactions~~
1. ~~Convert to typescript. Interfaces and models would be useful~~
1. ~~Config class that uses fs to get & create Config~~
1. ~~Better embed creation~~
1. ~~Private fork of my own project?~~ Thanks: http://deanmalone.net/post/how-to-fork-your-own-repo-on-github/
1. ~~Delete paging message that is no longer active (see if there is an event)~~
1. ~~Split models into their own folder?~~ I'm not sure this is the right thing to do.
1. Setup config script - entering keys and values etc
1. Implement Better error handling & filtering out incorrect values
1. More settings
    - Paging in particular (time, only requesting user can control etc).. Add these to responseModel or config?
1. More/extended Features/examples
1. Database handling (SQL, SQLite, MongoDB)
1. Turn it into an npm package?
1. Documentation
