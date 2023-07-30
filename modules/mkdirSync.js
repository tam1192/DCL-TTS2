const { existsSync, mkdirSync } = require('fs-extra');

/**
 * ディレクトリがなければ作成する。
 * @param {String} dirPath
 * @returns {String}
 */
module.exports = (dirPath) => {
	// 設定ファイル有無
	const Dir = existsSync(dirPath);
	// 設定ファイルがなければ
	if (!Dir) {
		// 作成する
		mkdirSync(dirPath);
	}
	return dirPath;
};