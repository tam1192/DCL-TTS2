'use strict';

const path = require('path');
const loadDirectory = require('../loadDirectory');

module.exports = function(client) {
	loadDirectory(path.join(__dirname, 'discordEvents'), file => {
		const event = require(file);
		if (event.once) {
			client.once(event.name, (...args) => event.execute(...args));
		}
		else {
			client.on(event.name, (...args) => event.execute(...args));
		}
	}, {
		subdir: false,
		filetype: '.js',
	});
};
