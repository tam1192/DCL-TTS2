'use strict';
const discordEvents = require('./discordEvents');
const discordInteractions = require('./discordInteractions');
const { Client, GatewayIntentBits } = require('discord.js');

module.exports = async (config, settingsPath) => {
	// クライアントインスタンスの作成
	const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildVoiceStates] });
	// 設定ファイルの場所を登録
	client.settingsPath = settingsPath;
	// musicbot用
	// // サウンドファイルの場所を登録
	// client.soundPath = sound;
	// ギルドの初期設定
	client.defaultGuildSetting = config.defaultGuildSetting;
	const promises = [];
	promises.push(new Promise((resolve, reject) => {
		// インタラクション情報登録
		discordInteractions().then(value => {
			client.Interactions = value;
			resolve(0);
		}).catch(value => reject(value));
	}));
	// イベント登録
	promises.push(discordEvents(client));
	await Promise.all(promises);
	// discordにログインする。
	await client.login(config.token);

	return client;
};
