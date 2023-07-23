"use strict";

const requestkits = require('./requestkits')

module.exports = class {
	
	/**
	 * @property {voicevox_engine} engine voicevoxのエンジン情報
	 */
	#engine

	/**
	 * @property {string} text 読み上げ用テキスト
	 */
	#text

	/**
	 * @property {number} speaker 話手
	 */
	#speaker

	/**
	 * @property {boolean} enable_interrogative_upspeak 疑問系のテキストが与えられたら語尾を自動調整する
	 */
	#enable_interrogative_upspeak

	/**
	 * @property {object} query_data audio_queryメソッドより作成されたクエリ情報
	 */
	#query_data
	#query_being

	/**
	 * @property {arrayBuffer} voice_data synthesisメソッドより作成されたバイナリ情報
	 */
	#voice_data
	#voice_being

	constructor(voicevox_engine, text, speaker=1, enable_interrogative_upspeak=true){
		this.#engine = voicevox_engine;
		this.#text = text;
		this.#speaker = speaker;
		this.#enable_interrogative_upspeak = enable_interrogative_upspeak;
		this.#query_being = true;
		this.#voice_being = true;
	}

	getQuery = async() =>{
		// クエリを作成したか
		if(this.#query_being){
			// クエリ作成用データ
			const data = {
				text: this.#text,
				speaker: this.#speaker,
			}
			// クエリを作成する
			this.#query_data = await requestkits.createAudioquery(this.#engine, data);
			// クエリを作成したよ
			this.#query_being = false;
			console.info('クエリを作成しました。')
		}
		return this.#query_data;
	}

	/**
	 * クエリからボイス作成
	 * @returns {ArrayBuffer} wavファイル
	 */
	getVoice = async() =>{
		// クエリがない
		if(this.#query_being){
			throw {detail: ['【内部エラー】クエリを作成してください']};
		}
		// voiceを作成したか
		if(this.#voice_being){
			// voice作成用データ
			const data = {
				speaker: this.#speaker,
				enable_interrogative_upspeak: this.#enable_interrogative_upspeak,
			}
			// voice作成
			try{
				this.#voice_data=await requestkits.synthesisQuery(this.#engine, data, this.#query_data);
			} catch (error) {
				console.error('voiceの作成に失敗しました。')
				throw error;
			}
			console.info('voiceを作成しました。')
			// voice作成したよ
			this.#voice_being = false;
		} 
		return this.#voice_data;
	}

}