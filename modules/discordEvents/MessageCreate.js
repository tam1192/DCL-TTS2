const { Events } = require('discord.js');
const { getVoiceConnection, createAudioResource } = require('@discordjs/voice');
const { writeFileSync } = require('fs-extra');
const path = require('path').join;
const { DataTypes } = require('sequelize');

const columns = {
	id: {
		type: DataTypes.INTEGER,
		autoIncrement: true,
		primaryKey: true
	},
	content: {
		type: DataTypes.STRING,
		allowNull: false,
	},
	speaker: {
		type: DataTypes.INTEGER,
		allowNull: false,
	},
	counter: {
		type: DataTypes.INTEGER,
	}
}

const spcu = {
	userid: {
		type: DataTypes.INTEGER,
		primaryKey: true
	},
	speaker: {
		type: DataTypes.INTEGER,
		allowNull: false,
	},
}

module.exports = {
	name: Events.MessageCreate,
	once: false,
	async execute(message) {
		const content = message.content;

		const guild = message.guild;
		const textlisten = guild.textlisten ?? '';

		const client = message.client;
		const player = guild.player;

		const db = client.db;

		try{
			if(message.channelId == textlisten &&
				content.length > 0){
				const table = db.define('MessageContent', columns);
				const table2 = db.define('usersettings', spcu);
				await db.sync();

				const spfind = await table2.findByPk(message.author.id);
				const speakerid = (()=>{
					if(spfind == null) {
						return 1;
					}
					else {
						return spfind.dataValues.speaker;
					}
				})();

				const voiceid = await(async() => {
					const exist = await table.findOne({where: {content: content, speaker: speakerid}});
					if(exist == null){
						const id = await table.create({content: content, speaker: speakerid, counter: 0});
						const voice = await client.voicevox.createVoice(content, speakerid);
						const voicepath = path(client.tempdir, `${id.dataValues.id}.wav`);
						writeFileSync(voicepath, Buffer.from(voice));
						await db.sync();
						return voicepath;
					}
					else {
						const voicepath = path(client.tempdir, `${exist.dataValues.id}.wav`);
						exist.update({
							counter: (exist.dataValues.counter + 1),
						});
						return voicepath
					}
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