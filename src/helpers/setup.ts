import { Config, ConfigModel } from './config'
var ReadLine = require('readline');
var config = new Config();

const rl = ReadLine.createInterface({
  input: process.stdin,
  output: process.stdout
});

export function setup(): Promise<Boolean> {
    return new Promise<Boolean> (
        function (resolve, reject) {
            rl.question('Would you like to enter config values now? [y/n] ', (answer: string) => {
                if (answer.toLowerCase() == 'y' || answer.toLowerCase() == 'yes') {
                    console.log('Leave values blank if you want to skip over it. Please note entering no value or incorrect values for required fields may cause you issues down the line.')
                    token()
                        .then(() => {
                            prefixes()
                                .then(()=> {
                                    config.setup = true;
                                    config.write(() => {
                                        return resolve(true);
                                    });
                                }, () => { return reject(false); })
                        }, () => { return reject(false); })
                }
                else {
                    return reject(false);
                }
            })
        }
    )
}

export function token() : Promise<Boolean> {
    return new Promise<Boolean> (
        function(resolve, reject) {
            rl.question('[Required] Bot Token: ', (answer: string) => {
                config.token = answer.replace(/ /g,'');
                config.write(() => {
                    return resolve(true);
                });
            })    
        }
    )
} 

export function prefixes() : Promise<Boolean> {
    return new Promise<Boolean> (
        function(resolve, reject) {
            rl.question('Prefixes (Comma Seperated): ', (answer: string) => {
                config.prefixes = answer.replace(/ /g,'').split(',');
                config.write(() => {
                    return resolve(true);
                });
            })    
        }
    )
} 