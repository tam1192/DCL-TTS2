const { SlashCommandBuilder  } = require('discord.js');
const wait = require('timers/promises').setTimeout;

const name = 'chsp';

module.exports = {
	name: name,
	data: new SlashCommandBuilder()
		.setName(name)
		.setDescription('話者変更')
		.addStringOption(option =>
			option.setName('speakername')
			.setDescription('話者名を入力')
			.setRequired(true)
		)
		.addStringOption(option =>
			option.setName('styles')
			.setDescription('スタイル名')
		),
	async execute(interaction) {
		await interaction.reply({
			content: 'しばらくお待ちください。',
			ephemeral: true,
		});

		const speakername = interaction.options.getString('speakername');
		const styles = interaction.options.getString('styles') ?? 'ノーマル';

		const user = interaction.user;
		const client = interaction.client;

		const UserData = client.UserData;
		const userData = await UserData.findOne({
			where: {
				userid: user.id,
			}
		}) ?? await UserData.build({
			userid: user.id,
			speaker: 0,
		});
		await userData.save();

		try{
			const speaker = await client.voicevox.createSpeaker();
			const speakerid = speaker.searchId(speakername, styles);
			await UserData.update({ speaker:speakerid }, {
				where: {userid: user.id}
			});
			// userData.update({
			// 	speaker: speakerid
			// });
		}
		catch(e){
			if(e.message == 'not found'){
				await interaction.editReply('話者が存在しません\nスタイルも確認してください。\n`/speaker` で話者を確認できます。');
			}
		}

		await interaction.editReply('変更しました。');
		await wait(10000);
		await interaction.deleteReply();
	},
};