const { Plugin } = require("powercord/entities");
const { get } = require("powercord/http");

// Extend the Plugin class
module.exports = class Roblox extends Plugin {
  // Initialize the plugin
  startPlugin() {
    // Register the command
    powercord.api.commands.registerCommand({
      command: "roblox",
      description: "Search for a roblox user",
      usage: "{c} <username>",
      executor: async (args, channel) => {
        // try catch
        try {
          // Get the user
          const { body } = await get(
            `https://api.roblox.com/users/get-by-username?username=${args.join(" ")}`
          );
            console.log(body);
          // Check if the user exists
          if (body.Id != null) {
            const data = await get(
              `https://api.roblox.com/ownership/hasasset?userId=${body.id}&assetId=102611803`
            );
            const Verifiedcheck = data.body;

            // Send the user
            return {
              username: body.Username,
              avatar_url: `http://www.roblox.com/Thumbs/Avatar.ashx?x=250&y=250&Format=Png&username=${body.Username}`,
              result: {
                type: "rich",
                fields: [
                  {
                    name: "INFO:",
                    value: [
                      `Username: ${body.Username}`,
                      `ID: ${body.Id}`,
                      `Verified: ${Verifiedcheck ? "Yes" : "NOPE"}`,
                      `[Profile Link](https://web.roblox.com/users/${body.Id}/profile "Nothing SUS")`,
                    ].join("\n"),
                    inline: true,
                  },
                ],
                image: {
                  url: `https://www.roblox.com/Thumbs/Avatar.ashx?x=250&y=250&Format=Png&username=${body.Username}`,
                  width: 250,
                  height: 250,
                }
              },
            };
          } else {
            // Send the user
            return {
              username: "Roblox",
              avatar_url: "https://i.imgur.com/uRpvasp.png",
              result: "No user Found",
            };
          }
        } catch (err) {
          // Send the user
          return {
            username: "Roblox",
            avatar_url: "https://i.imgur.com/uRpvasp.png",
            result: `Error ${err.message}`,
          };
        }
      },
    });
  }

  pluginWillUnload() {
    powercord.api.commands.unregisterCommand("roblox");
  }
};
