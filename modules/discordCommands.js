'use strict';

const path = require('path').join;
const { Collection } = require('discord.js');
const { loadFiles } = require('dirtools');

module.exports = async(client) => {
	// Interactions 作成
	client.Commands = new Collection();
	const Interactions = client.Commands;
	await loadFiles(path(__dirname, 'discordCommands'), async file => {
		// コマンドを読み込む
		const command = {
			dir: file,
			...require(file),
		}
		// コマンドが適正か
		if ('name' in command && 'data' in command && 'execute' in command) {
			// コレクションに登録する。
			Interactions.set(command.name, command);
		}
	}, {
		subdir: true,
		filetype: '.js',
	});
	return;
};