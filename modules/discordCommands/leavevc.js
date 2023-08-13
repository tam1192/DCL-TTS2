const { SlashCommandBuilder } = require('discord.js');
const { getVoiceConnection } = require('@discordjs/voice');
const wait = require('timers/promises').setTimeout;

const name = 'leavevc';

module.exports = {
	name: name,
	data: new SlashCommandBuilder()
		.setName(name)
		.setDescription('vcから退出します。'),
	async execute(interaction) {
		const guildId = interaction.guild.id;
		try{
			const vc = getVoiceConnection(guildId);
			if (vc != undefined) {
				vc.destroy();
				interaction.guild.textlisten = '';
				await interaction.reply({
					content: 'vcから退出しました。',
				});
			}
			else {
				await interaction.reply({
					content: 'vcに参加していません。',
				});
			}
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