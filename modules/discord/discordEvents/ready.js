const { Events, Routes, SlashCommandBuilder, ContextMenuCommandBuilder } = require('discord.js');
const fs = require('fs');
const path = require('path');

module.exports = {
	name: Events.ClientReady,
	once: true,
	async execute(client) {
		const guilds = client.guilds;
		const Interactions = client.Interactions;
		const settingsPath = client.settingsPath;

		(async () => {
			await (async () => {
			// ギルドの設定を呼び出す。
				(async () => {
					const guildsPath = path.join(settingsPath, 'guilds');
					const defaultGuildSetting = client.defaultGuildSetting;

					for (const g of guilds.cache) {
						const guildid = g[0];
						const Guild = g[1];
						const guildfile = path.join(guildsPath, `${guildid}.js`);

						// 設定を読み込む
						if (fs.existsSync(guildfile)) {
							Guild.settings = JSON.parse(fs.readFileSync(guildfile, 'utf-8'));
						}
						// 設定ファイルを作成
						else {
							fs.writeFileSync(guildfile, JSON.stringify(defaultGuildSetting), 'utf-8');
							Guild.settings = defaultGuildSetting;
						}
						Guild.settingsfile = guildfile;
					}
					console.log('ギルドの設定をロードしました。');
				})();
				// コマンド登録
				(async () => {
					const rest = client.rest;
					const body = [];
					const commandPath = path.join(settingsPath, 'client', 'command', `${client.user.id}.js`);

					// コマンドを読み込む
					for (const interaction of Interactions) {
						const data = interaction[1].data;
						// コマンドならば
						if (data instanceof ContextMenuCommandBuilder ||
							data instanceof SlashCommandBuilder) {
							// リクエストボディーに入れる
							body.push(data.toJSON());
						}
						// キャッシュファイルを読み込む
						if (fs.existsSync(commandPath)) {
							const cache = fs.readFileSync(commandPath, 'utf-8');
							// キャッシュファイルとリクエストボディが一致したら
							if (cache == JSON.stringify(body)) {
								// 送信しない。
								return;
							}
						}
					}
					// コマンドを送信する。
					try {
						console.log('コマンドの変更を確認しました。');
						await rest.put(
							Routes.applicationCommands(client.user.id),
							{ body: body },
						);
					}
					catch (error) {
						console.error(error);
					}
					// 新しいキャッシュを保存する。
					fs.writeFileSync(commandPath, JSON.stringify(body), 'utf-8');
					console.log('コマンド情報を更新しました。');
				})();
			})();
			// ログインしたことを表示する。
			console.log(`【Discord】Login => ${client.user.tag}`);
		})();
	},
};