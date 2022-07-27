const {
    existsSync
} = require("fs");
const {
    execSync
} = require("child_process");
const path = require('path');
const nodeModulesPath = path.join(__dirname, "node_modules");

function installDeps() {
    console.log("Installing dependencies, please wait...");
    execSync("npm install --only=prod", {
        cwd: __dirname,
        stdio: [null, null, null]
    });
    console.log("Dependencies successfully installed!");
    powercord.pluginManager.remount(__dirname);
}

if (!existsSync(nodeModulesPath)) {
    installDeps();
    return
}
const {
    Plugin
} = require("powercord/entities");
const {
    getModule
} = require("powercord/webpack");
const {
    getCurrentUser
} = getModule(["getCurrentUser"], false);
const {
    saveAccountChanges
} = getModule(["saveAccountChanges", "accountDetailsInit"], false);
module.exports = class Powercord_Minesweeper extends Plugin {
    startPlugin() {
        powercord.api.commands.registerCommand({
            command: 'minesweeper',
            description: 'Set your about me to a random minesweeper.',
            usage: '{c} [big / small]',
            executor: (args) => {
                const me = getCurrentUser()
                let output
                if (args.length < 1) {
                    //not specified whether its big or small
                    me.bio = `Minesweeper\n${getMinesweeper()}`
                    output = {
                        send: false,
                        result: 'Set your bio to a 5x5 minesweeper'
                    }
                } else {
                    switch (args[0]) {
                        case 'big':
                            me.bio = `Minesweeper\n${getMinesweeper()}`
                            output = {
                                send: false,
                                result: 'Set your bio to a 5x5 minesweeper'
                            }
                            break;
                        case 'small':
                            me.bio = `Minesweeper\n${getMinesweeper(4,4,5)}`
                            output = {
                                send: false,
                                result: 'Set your bio to a 4x4 minesweeper'
                            }
                            break;
                    }
                }
                saveAccountChanges(me)
                return output
            },
            autocomplete: (args) => {
                if (args.length !== 1) {
                    return false;
                }
                let options = {
                    small: 'Set a 4x4 minesweeper, takes up less characters',
                    big: 'Set a 5x5 minesweeper, takes up nearly all characters',
                }
                return {
                    commands: Object.keys(options)
                        .filter((option) => option.includes(args[0].toLowerCase()))
                        .map((option) => ({
                            command: option,
                            description: options[option],
                        })),
                    header: 'Quick Status',
                };
            }
        })
    }
  pluginWillUnload() {
      powercord.api.commands.unregisterCommand('minesweeper'); 
  }
}

function getMinesweeper(rows = 5, columns = 5, mines = 8) {
    const Minesweeper = require('discord.js-minesweeper')
    const minesweeper = new Minesweeper({
        rows,
        columns,
        mines,
        emote: 'boom',
        returnType: 'emoji',
    });
    let msg = minesweeper.start().replaceAll(' ', '').replaceAll(':one:', '1️⃣').replaceAll(':two:', '2️⃣').replaceAll(':three:', '3️⃣').replaceAll(':four:', '4️⃣').replaceAll(':five:', '5️⃣').replaceAll(':six:', '6️⃣').replaceAll(':seven:', '7️⃣').replaceAll(':eight:', '8️⃣').replaceAll(':nine:', '9️⃣').replaceAll(':zero:', '0️⃣').replaceAll(':boom:', '💥')
    return msg
}