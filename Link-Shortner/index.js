const { Plugin } = require('powercord/entities');
const { get } = require('powercord/http');
const { command } = require('../pc-commands/commands/echo');

module.exports = class Linkshortner extends Plugin {
    startPlugin () {
        powercord.api.commands.registerCommand({
            command: "Link Shortner is.gd",
            aliases: [ "Url Shortner", "Url Shortner", "UrlShortner", "is.gd" ],
            description: "Lets you shrink urls using is.gd",
            usage: "{c}LinkShortner <url>",
            executor: this.linkshortneris.bind(this)
        });
        powercord.api.commands.registerCommand({
            command: "Link Shortner v.gd",
            aliases: [ "Url Shortner", "Url Shortner", "v.gd" ],
            description: "Lets you shrink urls using v.gd",
            usage: "{c}LinkShortner <url>",
            executor: this.linkshortnerv.bind(this)
        });
    }
    pluginWillUnload() {
        powercord.pluginWillUnload('Linkshortner')
    }
    async linkshortneris(args) {
        const data = await get("https://is.gd/create.php?format=simple&url="+args[0]);
        return {
            send: true,
            result: `${data.body}`
        };
    }
    async linkshortnerv(args) {
        const data = await get("https://v.gd/create.php?format=simple&url="+args[0]);
        return {
            send: true,
            result: `${data.body}`
        };
    }
};
