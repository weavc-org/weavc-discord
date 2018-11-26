"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const config_1 = require("./config");
var ReadLine = require('readline');
var config = new config_1.Config();
const rl = ReadLine.createInterface({
    input: process.stdin,
    output: process.stdout
});
function setup(error = false) {
    return new Promise(function (resolve, reject) {
        if (error) {
            console.log("Setup error:\nI have created a config file for you, " +
                "but it needs some of the values to be filled out before I can function correctly. \n" +
                "Please run through the setup script or edit the config file ( found at: 'src/config.json' ) " +
                "changing setup value to true and adding the token provided by discord, here: https://discordapp.com/developers/applications/\n");
        }
        rl.question('Would you like to enter config values now? [y/n] ', (answer) => {
            if (answer.toLowerCase() == 'y' || answer.toLowerCase() == 'yes') {
                console.log('Leave values blank if you want to skip over it. Please note entering no value or incorrect values for required fields may cause you issues down the line.');
                token()
                    .then(() => {
                    prefixes()
                        .then(() => {
                        config.setup = true;
                        config.write(() => {
                            return resolve(true);
                        });
                    }, () => { return reject(false); });
                }, () => { return reject(false); });
            }
            else {
                return reject(false);
            }
        });
    });
}
exports.setup = setup;
function token() {
    return new Promise(function (resolve, reject) {
        rl.question('[Required] Bot Token: ', (answer) => {
            config.token = answer.replace(/ /g, '');
            config.write(() => {
                return resolve(true);
            });
        });
    });
}
exports.token = token;
function prefixes() {
    return new Promise(function (resolve, reject) {
        rl.question('Prefixes (Comma Seperated): ', (answer) => {
            config.prefixes = answer.replace(/ /g, '').split(',');
            config.write(() => {
                return resolve(true);
            });
        });
    });
}
exports.prefixes = prefixes;
