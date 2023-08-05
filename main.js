'use strict';
const config = require('./config.json');

const path = require('path').join;
const {mkdirSync} = require('fs-extra');

const {Sequelize} = require('sequelize');
const voxClient = require('voxclient').Client;
const { Client, GatewayIntentBits } = require('discord.js');

const discordEvents = require('./modules/discordEvents');
const discordInteractions = require('./modules/discordCommands');

// Ctrl+Cでexitするようにする。
process.once('SIGINT', () => process.exit(0));
// exit
process.once('exit', () => {
	console.log('end');
});

// クライアントインスタンスの作成
const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildVoiceStates, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent] });

client.db = new Sequelize({
	dialect: 'sqlite',
	storage: path(__dirname, 'db.sqlite'),
});

try{
	client.tempdir = mkdirSync(path(__dirname, 'tmp'));
}
catch(e){
	if(e.code!='EEXIST'){
		console.error(e);
		process.exit(1);
	}
}

client.voicevox = new voxClient(config.voicevox.address);
client.query = [];
discordInteractions(client);

(async () => {
	await Promise.all([
		discordEvents(client),
		discordInteractions(client),
	]);

	// discordにログインする。
	await client.login(config.Discord.token);
})();