const { Events } = require('discord.js');
const deploy = require('../discordDeploy');

module.exports = {
	name: Events.ClientReady,
	once: true,
	async execute(client) {
		// コマンド登録
		await deploy(client);
		// ログインしたことを表示する。
		console.log(`【Discord】Login => ${client.user.tag}`);
	},
};