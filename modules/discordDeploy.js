'use strict';

const { ContextMenuCommandBuilder, SlashCommandBuilder, Routes } = require('discord.js');
const { statSync } = require('fs-extra');
const { Model, DataTypes } = require('sequelize');

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
			type: DataTypes.INTEGER,
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
		const dir = value.dir;
		const mtime = Math.floor(statSync(dir).mtimeMs * 1000);

		// 適切か
		if(data instanceof ContextMenuCommandBuilder||
		data instanceof SlashCommandBuilder){
			body.push(value.data.toJSON());
		}

		// profunc
		const profunc = async() => {
			const data = await table.findByPk(key);
			const last = data.dataValues.last;
			// データが存在するか
			if (data == null){
				table.create({
					name: key,
					last: mtime,
				});
				throw 0;
			}
			// 更新日が新しくなっていないか。
			else if (last != mtime) {
					data.update({
						last: mtime,
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