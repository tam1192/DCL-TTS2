const fs = require('fs');
const path = require('path');

/**
 * ディレクトリを走査し、ファイルを見つけます。
 * @param {String} dir 走査するディレクトリ
 * @param {Function} callback 見つけたとき
 * @param {{subdir: boolean, filetype: string}} options オプション
 */
module.exports = function loadDirectory(dir, callback,
	options = { subdir: true, filetype: undefined }) {

	/**
	 * @type {String[]} ディレクトリの内容
	 */
	const dirfiles = fs.readdirSync(dir);
	for (const file of dirfiles) {
		// ファイル名
		const filepath = path.join(dir, file);
		// ファイルのstatを読み込み
		const filestat = fs.statSync(filepath);
		// ディレクトリならば
		if (options.subdir == true && filestat.isDirectory()) {
			// 再帰関数
			loadDirectory(filepath, callback);
		}
		else if (
			options.filetype == undefined ||
			filepath.endsWith(options.filetype)) {
			// コールバックする
			callback(filepath);
		}
	}
};
