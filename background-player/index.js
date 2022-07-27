const { Plugin } = require("powercord/entities");

var playing = [];
var loop = false;

const prefix = "bg";
const default_volume = 0.20;
const commands = ["pause", "play", "src", "loop", "pause", "vol"];

function p(s) { return prefix + s }

function n(s) {
    let random = prefix + "-" + (Math.random() + 1).toString(36).substring(7);
    powercord.api.notices.sendToast(random, {
        header: "background-player",
        content: s,
        timeout: 15e2,
    });
}

module.exports = class BackgroundPlayer extends Plugin {
    async startPlugin() {
        powercord.api.commands.registerCommand({
            command: p("play"),
            description: "Play file in background by link.",
            usage: "{c} <file>",
            executor: (args) => {
                for (var i = 0; i < args.length; i++) {
                    var audio = new Audio(args[0]);
                    audio.volume = default_volume;

                    if (loop) {
                        audio.loop = true;
                    }

                    playing = audio;
                    playing.play();
                    var filename = playing.src.split("/").pop().split("#")[0].split("?")[0];
                    n("Playing " + filename + " at volume " + audio.volume);
                }
            }
        });
        powercord.api.commands.registerCommand({
            command: p("pause"),
            description: "Pause current file playing.",
            usage: "{c}",
            executor: (args) => {
                playing.paused ? playing.play() : playing.pause();
                n(playing.paused ? "Paused file." : "Resumed file.")
            }
        });
        powercord.api.commands.registerCommand({
            command: p("loop"),
            description: "Loop current file playing.",
            usage: "{c}",
            executor: (args) => {
                var oldplaying = playing;
                loop = !playing.loop
                playing.loop = loop;
                n(oldplaying.loop ? "Looping file." : "Stopped looping file.");
            }
        });
        powercord.api.commands.registerCommand({
            command: p("src"),
            description: "Print current source link",
            usage: "{c}",
            executor: (args) => {
                return {
                    send: false,
                    result: playing.src
                }
            }
        });
        powercord.api.commands.registerCommand({
            command: p("vol"),
            description: "Set volume of current file playing.",
            usage: "{c} [volume]",
            executor: (args) => {
                if (Number(args[0])) {
                    playing.volume = args[0];
                    n("Set volume to " + playing.volume);
                } else if (args[0] == "default") {
                    playing.volume = default_volume;
                    n("Set volume to default. (" + default_volume + ")");
                } else {
                    n("Volume: " + playing.volume);
                }
            }
        });
        powercord.api.commands.registerCommand({
            command: p("elapsed"),
            description: "Print elapsed time of current file playing.",
            usage: "{c}",
            executor: (args) => {
                n("Elapsed time: " + Math.floor(playing.currentTime) + "s");
            }
        });
        powercord.api.commands.registerCommand({
            command: p("duration"),
            description: "Print duration of current file playing.",
            usage: "{c}",
            executor: (args) => {
                n("Duration: " + Math.floor(playing.duration) + "s");
            }
        });
        powercord.api.commands.registerCommand({
            command: p("replay"),
            description: "Replays current file playing.",
            usage: "{c}",
            executor: (args) => {
                playing.currentTime = 0;
                playing.pause();
                n("Replayed file.");
            }
        });
    }
    pluginWillUnload() {
        for (var i = 0; i < commands.length; i++) {
            powercord.api.commands.unregisterCommand(commands[i]);
        }
    }
};