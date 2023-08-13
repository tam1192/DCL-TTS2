'use strict';

const { ContextMenuCommandBuilder, SlashCommandBuilder, Routes } = require('discord.js');
const { statSync } = require('fs-extra');
const crypto = require('crypto');

module.exports = async(client) => {
	// Interactions 作成
	/**
	 * @type {Collection}
	 */
	const commands = client.Commands;
	const db = client.db;
	const CommandsData = client.CommandsData;
	const rest = client.rest;
	const user = client.user;
	const body = [];
	const promises = [];

	await db.sync();
	
	const cmdeach = (value, key) => {
		const data = value.data;
		// const dir = value.dir;
		const mtime = (()=>{
			return crypto.createHash('sha1')
					.update(JSON.stringify(data))
					.digest('hex');
		})();

		// 適切か
		if(data instanceof ContextMenuCommandBuilder||
		data instanceof SlashCommandBuilder){
			body.push(data.toJSON());
		}

		// profunc
		const profunc = async() => {
			const commandsData = await CommandsData.findByPk(key) ?? CommandsData.build({
				name: key,
				last: '',
			});
			const last = commandsData.last;
			// 更新日が新しくなっていないか。
			if (last != mtime) {
				CommandsData.update({
					last: mtime,
				}, {
					where: {name: key}
				});
				throw 0;
			}
			return 0;
		}

		promises.push(profunc());
		return;
	}

	commands.forEach(cmdeach);

	try{
		await Promise.all(promises);
	}
	catch(e){
		try {
			console.log('update');
			await rest.put(Routes.applicationCommands(user.id), {body: body});
			await db.sync();
			console.log('done.')
		} catch (error) {
			console.error(error);
		}
	}
};