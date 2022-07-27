const { Plugin } = require('powercord/entities');
const Settings = require('./Components/Settings');
var privacyEnabled = false;
let keybind;

module.exports = class PrivacyTab extends Plugin {
	constructor() {
		super();
		this.toggler = this.togglePrivacy.bind(this);
	}

	startPlugin() {
		this.loadStylesheet('style.scss');
		const { get, set } = this.settings;
		if (!get('blur-scale')) set('blur-scale', 2);
		if (!get('grayscale')) set('grayscale', false);
		if (!get('lock-app')) set('lock-app', true);
		if (!get('blurTiming')) set('blurTiming', 1);
		if (!get('keybind')) set('keybind', 'F6');
		keybind = get('keybind', 'F6');

		// init
		document.body.addEventListener('keyup', this.toggler);

		// register settings
		powercord.api.settings.registerSettings(this.entityID, {
			category: this.entityID,
			label: 'Privacy Tab',
			render: Settings,
		});
	}

	pluginWillUnload() {
		powercord.api.settings.unregisterSettings(this.entityID);
		document.body.removeEventListener('keyup', this.toggler);
		if (privacyEnabled) {
			document.getElementById('app-mount').classList.remove('blur-window');
		}
	}

	// toggle for privacy
	togglePrivacy(key) {
		// user safety #1 :P
		if (!document.hasFocus()) {
			return;
		}
		const { get } = this.settings;
		if (key.key.toUpperCase() === keybind) {
			const blurElement = document.getElementById('app-mount');
			privacyEnabled = !privacyEnabled;
			if (privacyEnabled) {
				// enable blur
				const grayscale = (get('grayscale')) ? '100%' :'0';
				const interaction = (get('lock-app')) ? 'none' : 'all';
				const timing = (get('blurTiming')) ? `${get('blurTiming')}s` : '1s';
				const blurAmount = get('blur-scale') * 3;
				blurElement.style.setProperty('--blur-window', `blur(${blurAmount}px) grayscale(${grayscale})`);
				blurElement.style.setProperty('--pointer', `${interaction}`);
				blurElement.style.setProperty('--blur-timing', `${timing}`);
				blurElement.classList.add('blur-window');
			} else {
				blurElement.classList.replace('blur-window', 'unblur');
				setTimeout(() => blurElement.classList.remove('unblur'), 1000);
			}
		}
		// if keybind gets changed
		if (keybind !== get('keybind')) keybind = get('keybind');
	}
};
