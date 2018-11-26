"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = require("fs");
const events_1 = require("events");
/**
 * @class Config
 * @extends EventEmitter
 * @implements {ConfigModel}
 * @description Handles the Configuration settings for the application
 */
class Config extends events_1.EventEmitter {
    constructor(argsetup = false) {
        super();
        this.triggered = false;
        this.reload();
        this.argSetup = argsetup;
    }
    reload() {
        if (fs_1.existsSync(__dirname + '/../config.json')) {
            this.read(() => {
                if (this.setup == false ||
                    this.token == undefined ||
                    this.token == '' || this.argSetup && !this.triggered) {
                    this.triggered = true;
                    this.emit('setup');
                }
                else {
                    if (!this.argSetup)
                        this.emit('ready');
                    else {
                        process.exit();
                    }
                }
            });
        }
        else {
            this.create();
        }
    }
    create() {
        this.setup = false;
        this.token = '';
        this.prefixes = [];
        this.write(() => {
            this.reload();
        });
    }
    read(callback) {
        fs_1.readFile(__dirname + '/../config.json', 'utf8', (err, data) => {
            if (err)
                throw err;
            var model = JSON.parse(data);
            this.setup = model.setup;
            this.token = model.token;
            this.prefixes = model.prefixes;
            callback();
        });
    }
    write(callback) {
        var model = {
            setup: this.setup,
            token: this.token,
            prefixes: this.prefixes,
        };
        fs_1.writeFile(__dirname + '/../config.json', JSON.stringify(model), (err) => {
            if (err)
                throw err;
            callback();
        });
    }
}
exports.Config = Config;
