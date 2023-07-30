const { Events } = require('discord.js');

module.exports = {
	name: Events.InteractionCreate,
	once: false,
	async execute(interaction) {
		const client = interaction.client;
		const Interactions = client.Interactions;

		// インタラクションの種類
		// コマンドなら
		const name = (() => {
			if (interaction.isChatInputCommand()) {
				// コマンド名
				return interaction.commandName;
			}
			// モーダルなら
			else if (interaction.isModalSubmit()) {
				// モーダル名
				return interaction.customId;
			}
			else if (interaction.isContextMenuCommand()) {
				return interaction.commandName;
			}
			// その他
			else {
				return undefined;
			}
		})();

		if (name == undefined) {
			console.warn('インタラクションの種類が分かりません');
		}
		else {
			// インタラクションを呼び出す...
			const command = Interactions.get(name);
			// 見つからなかったら
			if (!command) {
				console.error(`コマンドが見つかりません:${name}`);
				return;
			}
			// 見つかったら
			try {
				// コマンドを実行する
				await command.execute(interaction);
			}
			catch (error) {
				// エラーが発生したら
				console.error(`コマンドが正常に動作しませんでした:${name}`);
				throw error;
			}
		}
	},
};