const { SlashCommandBuilder } = require('discord.js');
/**
 * コマンドの例
 * dataには、コマンドビルダーを登録。
 * executeには、イベントが呼び出されたときの処理を書く。(※非同期処理です。)
 * コマンドは、client.Interactions(※map型)に登録されます。
 *
 * このフレームワークもどきでは、./modules/discordInteractions の内側に保存された.jsファイルは、
 * コマンド(SlashCommandBuilder、ContextMenuCommandBuilder、ModalBuilderで作られた物)として扱うようになっています。
 *
 * (※map型)
 * map型は、連想配列(dict、構造体)などと違って、反復可能な構造体として情報を保存できます。
 * map.set(<項目名>, <データ>)
 * map.get(<項目名>) => [<項目名>, <データ>]
 * map型は連想配列や配列と異なり,セッターやゲッターを使って情報を扱います。
 *
 * (※非同期処理)
 * async関数は、コルーチンとして関数を実行します。要するに、メインの処理とは時間軸を切り分けて処理します。
 * async関数の中ではawait句が使えて、awaitをつけて処理を行うとその処理が終了するまで実行されたコルーチン関数内の処理は停止し、
 * await処理が終了したら処理が続行されます。
 * promise系の処理、asyncがついた関数の処理の戻り値は、awaitで待たなければ値を取り出すことができません。
 * awaitをつけないで取れる処理は、thenと呼ばれるものです。
 * 詳しくはpromiseについての記事を参考にしてください。
 *
 * なんでここまで長々と書いたんだろう。
 * @author nikki9750
 */

// コマンド名
const name = 'ping';

module.exports = {
	name: name,
	data: new SlashCommandBuilder()
		.setName(name)
		// 説明
		.setDescription('botに生存確認しましょう'),
	async execute(interaction) {
		// replyでコマンド実行者にメッセージを返信します。
		// replyがなければ、正常であっても実行結果が表示されずにユーザーを戸惑わせます。
		// 必ずつけましょう。(modalsやcontextmenuも同様)
		await interaction.reply({
			content: 'pong!',
		});
	},
};