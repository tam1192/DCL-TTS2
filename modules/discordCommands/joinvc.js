const { SlashCommandBuilder } = require('discord.js');
const { joinVoiceChannel, createAudioPlayer } = require('@discordjs/voice');
const wait = require('timers/promises').setTimeout;

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
			const vc = joinVoiceChannel({
				channelId: channelId,
				guildId: guildId,
				adapterCreator: voiceAdapterCreator,
				selfDeaf: true,
			});
			if(interaction.guild.player == undefined){
				interaction.guild.player = createAudioPlayer();
			};
			vc.subscribe(interaction.guild.player);
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
		await wait(10000);
		await interaction.deleteReply();
	},
};