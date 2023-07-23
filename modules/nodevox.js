'use strict';

const requestkits = require('./nodevox/nodevoxRequestkits');
const query = require('./nodevox/nodevoxQuery');

module.exports = class {
	/**
	 * @property {string} address サーバーアドレス
	 */
	#address;
	/**
	 * @property {Array} speakerlist_data 話者のリスト
	 */
	#speakerlist_data;
	#speakerlist_being;

	/**
	 * voicevox互換エンジンの設定
	 * @param {boolean} https 暗号化有無
	 * @param {string} address IP or ドメイン
	 * @param {number} port ポート
	 */
	constructor(https,address,port){
		const http = https ? 'https' : 'http';
		this.#address = `${http}://${address}:${port}`;
		this.#speakerlist_being = true;
	}

	/**
	 * サーバーアドレスを返すゲッター
	 * @returns {string} アドレス
	 */
	toString = ()=>{
		return this.#address;
	}

	/**
	 * 話者のリストを取ります。
	 * @param {boolean} raw 元の情報を取得します。
	 */
	getspeaker = async(raw) => {
		// 話者リストを作成したか
		if(this.#speakerlist_being){
			// 話者リスト作成
			this.#speakerlist_data=await requestkits.getSpeaker(this.#address);
			// 話者リスト作成したよ
			this.#speakerlist_being = false;
			console.info('話者リストを作成しました。')
		}
		return raw ? this.#speakerlist_data : 
		requestkits.formatSpeakerlist(this.#speakerlist_data);
	}

	/**
	 * 辞書を取得します
	 */
	getUserdict = async() => {
		return await requestkits.getUserdict(this.#address);
	}

	/**
	 * クエリを作成します。
	 * @param {String} text 
	 * @param {Number} speaker 
	 * @param {Boolean} enable_interrogative_upspeak 
	 * @returns {query}
	 */
	toQuery = (text, speaker=1, enable_interrogative_upspeak=true) => {
		return new query(this, text, speaker, enable_interrogative_upspeak)
	}
}