const { Plugin } = require('powercord/entities')
const { getModule } = require('powercord/webpack');
const { inject, uninject } = require('powercord/injector');

const steamHostnames = [
  'store.steampowered.com',
  'steamcommunity.com',
  'help.steampowered.com',
];
const spotifyHostnames = [
  'open.spotify.com'
];
const tidalHostnames = [
  'tidal.com',
  'listen.tidal.com'
]

module.exports = class OpenInApp extends Plugin {
  startPlugin() {
    const Anchor = getModule(m => m.default?.displayName == 'Anchor', false);
    inject('open-in-app', Anchor, 'default', this.openInApp);
    Anchor.default.displayName = "Anchor";
  }

  openInApp(_, res) {
    if (!res.props.href) {
      return res;
    }

    const hostname = (res.props.href?.hostname || new URL(res.props.href).hostname).toLowerCase();

    if (spotifyHostnames.includes(hostname)) {
      res.props.href = `spotify:${res.props.href}`;
    } else if (steamHostnames.includes(hostname)) {
      res.props.href = `steam://openurl/${res.props.href}`;
    } else if (tidalHostnames.includes(hostname.toLowerCase())) {
      res.props.href = `tidal://${res.props.href}`;
    }

    return res;
  }

  pluginWillUnload() {
    uninject('open-in-app');
  }
}
