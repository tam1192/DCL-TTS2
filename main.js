'use strict';
const discord = require('./modules/discord');
const config = require('./config.json');
const path = require('path');
const mkdir = require('./modules/mkdir');

// 設定ファイルを作成・ロードする。:w
const settingsPath = mkdir(path.join(__dirname, 'settings'));

// discord用
// settings/guilds
mkdir(path.join(settingsPath, 'guilds'));
// settings/client
const clientPath = mkdir(path.join(settingsPath, 'client'));
// settings/client/command
mkdir(path.join(clientPath, 'command'));

// Ctrl+Cでexitするようにする。
process.once('SIGINT', () => process.exit(0));
// exit
process.once('exit', () => {
	console.log('end');
});

discord(config.Discord, settingsPath);