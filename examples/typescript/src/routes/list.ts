import { Route, RouteController } from '../../../../lib';
import { Message, Client } from 'discord.js';
import * as fs from 'fs';

class DataModel {
    constructor() {}
    Guilds: IData[] = [];
}

interface IData {
    guild: String;
    channel: String;
    lists: IList[];
}

interface IList {
    name: string;
    list: string[];
}

class list {

    Data: DataModel;

    constructor() {
        this.__Read();
    }

    Create: RouteController = (Args: String[], MessageRequest: Message, Client: Client) => {
        this.__GetGuildLists(MessageRequest.guild.id).then((result) => {
            var newList : IList = { name: Args[2].toString(), list: [] };
            if (Args[3]) {
                newList.list = Args[3].split(',');
            }
            result.lists.push(newList);
            this.__Update();
        });
    }

    Delete: RouteController = (Args: String[], MessageRequest: Message, Client: Client) => {
        
    }

    AddTo: RouteController = (Args: String[], MessageRequest: Message, Client: Client) => {
        
    }

    DeleteFrom: RouteController = (Args: String[], MessageRequest: Message, Client: Client) => {
        
    }

    Clear: RouteController = (Args: String[], MessageRequest: Message, Client: Client) => {
        
    }

    private __Update() {
        console.log(this.Data);
        fs.writeFile('./data.json', JSON.stringify(this.Data), {encoding: 'utf8'}, (err) => {
            if (err) {
                console.log(err);
                throw err;
            }
        })
    }

    private __Read() {
        if (!fs.existsSync('./data.json')) {
            this.Data = new DataModel();
            this.__Update();
        }
        else {
            fs.readFile('./data.json', 'utf8', (err, data) => {
                if (err) {
                    console.log(err);
                    throw err;
                }
                this.Data = JSON.parse(data);
            })
        }
    }

    private __GetGuildLists(reqGuild: string) : Promise<IData> {
        return new Promise<IData>((resolve, reject) => {
            if (this.Data.Guilds == undefined) {
                this.Data.Guilds = [];
                var guild = this.__CreateNewGuild(reqGuild);
                return resolve(guild);
            }
            this.Data.Guilds.forEach((guild) => {
                if (guild.guild == reqGuild) {
                    return resolve(guild);
                }
            }) 
            var guild = this.__CreateNewGuild(reqGuild);
            return resolve(guild);
        });
    }

    private __CreateNewGuild(reqGuild: string) : IData {
        var newguild : IData = {
            guild: reqGuild,
            channel: '',
            lists: []
        };
        this.Data.Guilds.push(newguild);
        this.__Update();
        return newguild;
    }

}

export var List = new list();

