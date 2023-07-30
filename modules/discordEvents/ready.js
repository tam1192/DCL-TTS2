const { Events, Routes, SlashCommandBuilder, ContextMenuCommandBuilder } = require('discord.js');
const { existsSync, writeFile, readFile } = require('fs-extra');
const path = require('path').join;

module.exports = {
	name: Events.ClientReady,
	once: true,
	async execute(client) {
		// ギルド
		const guilds = client.guilds;
		// インタラクション
		const Interactions = client.Interactions;
		// 設定ファイル
		const settingsPath = client.settingsPath;
		// promise登録
		const promises = [];
		promises.push((async () => {
			// ギルドの設定を呼び出す。
			const guildsPath = path(settingsPath, 'guilds');
			// クライアントのデフォルト設定
			const defaultGuildSetting = client.defaultGuildSetting;
			// promise登録
			const promises2 = [];
			for (const g of guilds.cache) {
				const guildid = g[0];
				const Guild = g[1];
				const guildfile = path(guildsPath, `${guildid}.js`);

				// ファイルの有無を確認する
				if (existsSync(guildfile)) {
					promises2.push(new Promise((resolve, reject) => {
						// 設定を読み込む
						readFile(guildfile, 'utf-8').then(value => {
							// ギルド設定を読み込む
							Guild.settings = JSON.parse(value);
							// ギルド設定のパスを書き込む
							Guild.settingsfile = guildfile;
							resolve(0);
						}).catch((err) => reject(err));
					}));
				}
				else {
					promises2.push(new Promise((resolve, reject) => {
						// 設定ファイルを作成
						writeFile(guildfile, JSON.stringify(defaultGuildSetting), 'utf-8').then(() => {
							// ギルド設定を書き込む
							Guild.settings = defaultGuildSetting;
							// ギルド設定のパスを書き込む
							Guild.settingsfile = guildfile;
							resolve(0);
						}).catch((err) => reject(err));
					}));
				}
			}
			await Promise.all(promises2);
			console.log('ギルドの設定をロードしました。');
			return 0;
		})());

		// コマンド登録
		promises.push((async () => {
			// restクライアント
			const rest = client.rest;
			// コマンド(json)
			const body = [];
			// コマンドキャッシュのパス
			const commandPath = path(settingsPath, 'client', 'command', `${client.user.id}.js`);
			// コマンドを読み込む
			for (const interaction of Interactions) {
				const data = interaction[1].data;
				// コマンドならば
				if (data instanceof ContextMenuCommandBuilder ||
						data instanceof SlashCommandBuilder) {
					// リクエストボディーに入れる
					body.push(data.toJSON());
				}
			}
			// キャッシュファイルを読み込む
			if (existsSync(commandPath)) {
				const cache = await readFile(commandPath, 'utf-8');
				// キャッシュファイルとリクエストボディが一致したら
				if (cache == JSON.stringify(body)) {
					// 送信しない。
					return 0;
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
			await writeFile(commandPath, JSON.stringify(body), 'utf-8');
			console.log('コマンド情報を更新しました。');
			return 0;
		})());
		// 処理を待つ
		await Promise.all(promises);
		// ログインしたことを表示する。
		console.log(`【Discord】Login => ${client.user.tag}`);
	},
};