const path = require('path').join;
const { loadFiles } = require('dirtools');

module.exports = async function(client) {
	await loadFiles(path(__dirname, 'discordEvents'), file => {
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
	return 0;
};
