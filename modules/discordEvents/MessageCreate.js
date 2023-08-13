const { Events } = require('discord.js');
const { createAudioResource } = require('@discordjs/voice');
const { writeFileSync } = require('fs-extra');
const path = require('path').join;

module.exports = {
	name: Events.MessageCreate,
	once: false,
	async execute(message) {
		const content = message.content;

		const guild = message.guild;
		const textlisten = guild.textlisten ?? '';

		const client = message.client;
		const player = guild.player;
		const VoiceCache = client.VoiceCache;
		const UserData = client.UserData;

		try{
			if(message.channelId == textlisten &&
				content.length > 0){

				const speakerid = await UserData.findByPk(message.author.id).speaker ?? 1;

				const voiceid = await(async() => {
					const voiceData = await VoiceCache.findOne({
						where: {content: content, speaker: speakerid}
					}) ?? await VoiceCache.build({
						content: content,
						speaker: speakerid,
						counter: 0,
					});
					await voiceData.save();

					const voicepath = path(client.tempdir, `${voiceData.id}.wav`);

					if(voiceData.counter==0){
						const sound = await client.voicevox.createVoice(content, speakerid);
						writeFileSync(voicepath, Buffer.from(sound));
					}

					voiceData.counter++;
					await voiceData.save();
					return voicepath;
				})();
				const audio = createAudioResource(voiceid, {inlineVolume: true});
				player.play(audio);
			}
		}
		catch(e){
			console.error(e);
		}
	},
};