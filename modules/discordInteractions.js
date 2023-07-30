const path = require('path').join;
const { Collection } = require('discord.js');
const { loadFiles } = require('dirtools');

module.exports = async function() {
	const collection = new Collection();
	await loadFiles(path(__dirname, 'discordInteractions'), file => {
		// コマンドを読み込む
		const command = require(file);
		if ('name' in command && 'data' in command && 'execute' in command) {
			// コレクションに登録する。
			collection.set(command.name, command);
		}
	}, {
		subdir: true,
		filetype: '.js',
	});
	return collection;
};