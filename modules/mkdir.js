const fs = require('fs-extra');

module.exports = (dirPath) => {
	// 設定ファイル有無
	const Dir = fs.existsSync(dirPath);
	// 設定ファイルがなければ
	if (!Dir) {
		// 作成する
		fs.mkdirSync(dirPath);
	}
	return dirPath;
};