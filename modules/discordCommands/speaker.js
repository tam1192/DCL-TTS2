const { SlashCommandBuilder } = require('discord.js');
const wait = require('timers/promises').setTimeout;

const name = 'speaker';

module.exports = {
	name: name,
	data: new SlashCommandBuilder()
		.setName(name)
		.setDescription('話者一覧を表示'),
	async execute(interaction) {
		await interaction.reply({
			content: 'しばらくお待ちください。',
			ephemeral: true,
		});
		const client = interaction.client;
		const msg = [];
		try{
			const speaker = await client.voicevox.createSpeaker();
			const list = await speaker.get();
			msg.push('# 話者一覧')
			list.forEach((val, key) => {
				msg.push(`## ${key}`);
				const styles = [];
				val.forEach((_, key1) => {
					styles.push(`\`${key1}\``);
				});
				msg.push(`${styles.join(',\t')}`);
			});

			await interaction.editReply(msg.join('\n'));
		}
		catch(e){
			await interaction.reply({
				content: 'エラーが発生しました。',
			});
			console.error(e);
		}
		await wait(10000);
		await interaction.deleteReply();
	},
};