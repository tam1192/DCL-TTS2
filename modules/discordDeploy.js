'use strict';

const { ContextMenuCommandBuilder, SlashCommandBuilder, Routes } = require('discord.js');
const { statSync } = require('fs-extra');
const { Model, DataTypes } = require('sequelize');
const crypto = require('crypto');

module.exports = async(client) => {
	// Interactions 作成
	/**
	 * @type {Collection}
	 */
	const commands = client.Commands;
	const db = client.db;
	const rest = client.rest;
	const user = client.user;
	const body = [];
	const promises = [];

	const columns = {
		name: {
			type: DataTypes.STRING,
			primaryKey: true,
		},
		last: {
			type: DataTypes.STRING,
			allowNull: false,
		}
	}
	/**
	 * @type {Model}
	 */
	const table = db.define('Interactions', columns);

	await db.sync();
	
	const cmdeach = (value, key) => {
		const data = value.data;
		// const dir = value.dir;
		const mtime = (()=>{
			return crypto.createHash('sha1')
					.update(JSON.stringify(data))
					.digest('hex');
			// const time = Math.floor(statSync(dir).mtimeMs * 1000);
		})();

		// 適切か
		if(data instanceof ContextMenuCommandBuilder||
		data instanceof SlashCommandBuilder){
			body.push(data.toJSON());
		}

		// profunc
		const profunc = async() => {
			const find = await table.findByPk(key);
			// データが存在するか
			if (find == null){
				table.create({
					name: key,
					last: mtime,
				});
				throw 0;
			} 
			else {
				const last = find.dataValues.last;
				// 更新日が新しくなっていないか。
				if (last != mtime) {
						find.update({
							last: mtime,
						});
					throw 0;
				}
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