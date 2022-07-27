const { deprecationUrl } = require('./manifest.json');
const { Plugin } = require('powercord/entities');
const { React } = require('powercord/webpack');
const { open } = require('powercord/modal');
const { basename } = require('path');

const DeprecatedModal = require('./components/DeprecatedModal');

module.exports = class DEPRECATED extends Plugin {
   startPlugin() {
      this.loadStylesheet('style.css');
      open(e => React.createElement(DeprecatedModal, {
         name: basename(__dirname),
         url: deprecationUrl,
         ...e
      }));
   }

   pluginWillUnload() { }
};
