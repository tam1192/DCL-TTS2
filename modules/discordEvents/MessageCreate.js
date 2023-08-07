const { Events } = require('discord.js');
const { getVoiceConnection } = require('@discordjs/voice');
const { writeFileSync } = require('fs-extra');
const path = require('path').join;

module.exports = {
	name: Events.MessageCreate,
	once: false,
	async execute(message) {
		const guild = message.guild;
		const textlisten = guild.textlisten ?? '';
		const client = message.client;
		const vc = getVoiceConnection(guild.id);
		console.log(message);
		if(message.channelId == textlisten){
			const voice = await client.voicevox.createVoice(message.content, 1);
			const filename = message.content;
			writeFileSync(path(client.tempdir, `${message.content}.wav`), Buffer.from(voice));
		}
	},
};