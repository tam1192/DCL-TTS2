const { SlashCommandBuilder } = require('discord.js');
const { DataTypes } = require('sequelize');
const wait = require('timers/promises').setTimeout;

const columns = {
	userid: {
		type: DataTypes.INTEGER,
		primaryKey: true
	},
	speaker: {
		type: DataTypes.INTEGER,
		allowNull: false,
	},
}

const name = 'chsp';

module.exports = {
	name: name,
	data: new SlashCommandBuilder()
		.setName(name)
		.setDescription('話者変更')
		.addStringOption(option =>
			option.setName('speakername')
			.setDescription('話者名を入力')
			.setRequired(true)
		)
		.addStringOption(option =>
			option.setName('styles')
			.setDescription('スタイル名')
		),
	async execute(interaction) {
		await interaction.reply({
			content: 'しばらくお待ちください。',
			ephemeral: true,
		});
		const speakername = interaction.options.getString('speakername');
		const styles = interaction.options.getString('styles') ?? 'ノーマル';
		const user = interaction.user;
		const client = interaction.client;
		const db = client.db;

		try{
			const table = db.define('usersettings', columns);
			await db.sync();

			const speaker = await client.voicevox.createSpeaker();
			const speakerid = speaker.searchId(speakername, styles);

			const find = await table.findByPk(user.id);
			if (find == null){
				table.create({
					userid: user.id,
					speaker: speakerid,
				});
			}
			else {
				find.update({
					speaker: speakerid,
				});
			}

			await db.sync();
			// interaction.user.speakerid = speakerid;
			await interaction.editReply('変更しました。');
		}
		catch(e){
			if(e.message == 'not found'){
				await interaction.editReply('話者が存在しません\nスタイルも確認してください。\n`/speaker` で話者を確認できます。');
			}
			else{
				await interaction.editReply('変更できませんでした。');
				console.error(e);
			}
		}
		await wait(10000);
		await interaction.deleteReply();
	},
};