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

    argSetup: Boolean;
    triggered: Boolean = false;

    constructor(argsetup: Boolean = false) {
        super();
        this.reload();
        this.argSetup = argsetup;
    }

    reload() {
        if (existsSync(__dirname+'/../config.json')) {
            this.read(()=> {
                if (this.setup == false ||
                    this.token == undefined ||
                    this.token == '' || this.argSetup && !this.triggered) {
                        this.triggered = true;
                        this.emit('setup');
                }
                else {
                    if (!this.argSetup) this.emit('ready');
                    else { process.exit() }
                }
            })
        }
        else {
            this.create();
        }
    }

    private create() {
        this.setup = false;
        this.token = '';
        this.prefixes = [];

        this.write(() => {
            this.reload();
        })
    }

    private read(callback: Function) {
        readFile(__dirname+'/../config.json', 'utf8', (err, data) => {
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
