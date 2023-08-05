const { SlashCommandBuilder } = require('discord.js');
const { joinVoiceChannel } = require('@discordjs/voice');

const name = 'joinvc';

module.exports = {
	name: name,
	data: new SlashCommandBuilder()
		.setName(name)
		.setDescription('vcに参加します.'),
	async execute(interaction) {
		await interaction.reply({
			content: 'vcに参加します。',
		});
		try {
			const channelId = interaction.member.voice.channelId;
			const channelname = interaction.member.voice.channel.name;
			const guildId = interaction.guild.id;
			const voiceAdapterCreator = interaction.guild.voiceAdapterCreator;
			joinVoiceChannel({
				channelId: channelId,
				guildId: guildId,
				adapterCreator: voiceAdapterCreator,
				selfDeaf: true,
			});
			interaction.guild.textlisten = interaction.channelId;
		await interaction.editReply(`参加しました：${channelname}\n読み上げます：${interaction.channel.name}`);
		} catch (error) {
			if(error instanceof TypeError){
				await interaction.editReply('VCに参加してください。');
			}
			else{
				await interaction.editReply('参加できません\n権限は大丈夫ですか？');
			}
		}
	},
};