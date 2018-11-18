var config:ConfigModel = undefined;
const fs = require('fs');

export function Setup(next: Function) {
    config = require('../config');
    if (config === undefined) { 
        CreateConfig(() => {
            config = require('../config');
            SetValues((setup:Boolean) => {
                next(setup)
            });
        }); 
    }

    else if (config.setup == false) { 
        SetValues((setup: Boolean) => {
            next(setup);
        });
    }

    if (config.token == undefined || config.token == '') {
        config.setup = false;
        console.log("You seem to be missing the token value in your configuration file. Please add it to the config file or start the bot again to go through the setup process.");
        fs.writeFile("../config.json", JSON.stringify(config), (err: any) => {
            if (err) { throw err; }    
            console.log("Updated config file. setup: false");
        }); 
        next(false);
    }
}

function SetValues(next: Function) {
    console.log(
        "It doesn't seem like your config file has been setup. Would you like to set it up now? "+
        "You could also edit the src/config.json file yourself, be sure to set the 'setup' value to true if you do!");
}

export function CreateConfig(callback: Function) {
    var DefaultConfig: ConfigModel;
    DefaultConfig.setup = false;
    DefaultConfig.token = '';
    DefaultConfig.prefixs = [];

    fs.writeFile("../config.json", JSON.stringify(DefaultConfig), (err: any) => {
        if (err) { throw err; }
        console.log("Created config file");
        callback();
    }); 

}

export interface ConfigModel {
    setup: Boolean;
    token: String;
    prefixs: Array<String>;
}