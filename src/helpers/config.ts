import { existsSync, readFile, writeFile } from "fs";
import { EventEmitter } from "events";


/**
 * @class Config
 * @extends EventEmitter
 * @implements {ConfigModel}
 * @description Handles the Configuration settings for the application
 */
export class Config extends EventEmitter implements ConfigModel {
    
    setup: Boolean;
    token: String;
    prefixes: Array<String>;

    constructor() {
        super();
        this.reload();
    }

    reload() {
        if (existsSync('src/config.json')) {
            this.read(()=> {
                if (this.setup == false ||
                    this.token == undefined ||
                    this.token == '') {
                        this.emit('setup');
                }
                else {
                    this.emit('ready')
                }
            })
        }
        else {
            this.create();
        }
    }

    private create() {
        var model: ConfigModel = {
            setup: false,
            token: '',
            prefixes: []
        };

        this.write(() => {
            this.reload();
        })
    }

    private read(callback: Function) {
        readFile('src/config.json', 'utf8', (err, data) => {
            if (err) throw err;
            
            var model: ConfigModel = JSON.parse(data);
            this.setup = model.setup;
            this.token = model.token;
            this.prefixes = model.prefixes;

            callback();
        })
    }

    write(callback: Function) {

        var model: ConfigModel = {
            setup: this.setup,
            token: this.token,
            prefixes: this.prefixes,
        }

        writeFile('src/config.json', JSON.stringify(model), (err) => {
            if (err) throw err;
            callback();
        })
    }

}

/**
 * @interface ConfigModel
 * @description Configuration model
 */
export interface ConfigModel {
    setup: Boolean;
    token: String;
    prefixes: Array<String>;
}


export function Setup() {
    

}
