"use strict";

/**
 * @class voicevoxと通信するための関数たちよ。
 * @constant DEBUG debug=trueにすると、スピードとか表示します。
 */

module.exports= class {

	/**
	 * クエリを作成します。 query.queryに代入されます。
	 * @param {voicevox_engine} engine
	 * @param {{text:string,speaker:number}} data 
	 * @returns {string} クエリ
	 */
	static createAudioquery;

	/**
	 * 合成します。 
	 * @param {voicevox_engine} engine 
	 * @param {{spekaer:string,enable_interrogative_upspeak:boolean}} data
	 * @returns {arrayBuffer,json} wav音源
	 */
	static synthesisQuery;

	/**
	 * 話者のリストを取ります。
	 * @param {voicevox_engine} engine voicevoxエンジン
	 */
	static getSpeaker;

	/**
	 * ユーザー辞書に登録されている単語の一覧を返します。 単語の表層形(surface)は正規化済みの物を返します。
	 * @param {voicevox_engine} engine voicevoxエンジン
	 */
	static getUserdict;

	/**
	 * ユーザー辞書に言葉を追加します。
	 * @param {voicevox_engine} engine voicevoxエンジン
	 * @param {string} surface 言葉の表層形
	 * @param {string} pronunciation 言葉の発音（カタカナ） 
	 * @param {number} accent_type アクセント型
	 * @param {['PROPER_NOUN','COMMON_NOUN','VERB','ADJECTIVE', 'SUFFIX']} word_type PROPER_NOUN（固有名詞）、COMMON_NOUN（普通名詞）、VERB（動詞）、ADJECTIVE（形容詞）、SUFFIX（語尾）
	 * @param {number} priority 単語の優先度
	 */
	static setUserdict;

	/**
	 * ユーザー辞書に登録されている言葉を削除します。
	 * @param {voicevox_engine} engine サーバーエンジン
	 * @param {string} uuid 削除する言葉のUUID
	 * @returns {Response}
	 */
	static deleteUserdict;

	/**
	 * URLを処理します
	 * @param {voicevox_engine} engine voicevoxのエンジン
	 * @param {string} path パス
	 * @param {object} param パラメーター
	 * @returns アドレスを返します
	 */
	static generateURLparams = (engine, path, param) => {
		//paramが空でなければ
		if(param!=undefined){
			// パラメータをurl用に置き換える
			const urls = new URLSearchParams(param);
			return `${engine.toString()}/${path}?${urls.toString()}`;
		} else {
			return `${engine.toString()}/${path}`;
		}
	}

	/**
	 * speakerのlistを使いやすくしました。
	 * @param {speaker} data 
	 * @returns 使いやすいspeakerlist
	 */
	static formatSpeakerlist = (data) => {
		let formatlist = []
		for(const speaker of data){
			for(const styles of speaker.styles){
				formatlist[parseInt(styles.id)] = [speaker.name, styles.name];
			}
		}
		return formatlist;
	}

	/**
	 * サーバーからデータを取得するためのゲッター
	 * @param {string} address 
	 * @param {string} getdata 
	 * @returns {Response}
	 */
	static serverGetter = async(engine, getdata) => {
		return await fetch(this.generateURLparams(engine, getdata),{
			method: 'get',
			headers: {
				'accept': 'application/json'
			},
		});
	}

/*
　クエリ処理
*/

	static createAudioquery = async(engine, data) => {
		const responseFetch = await fetch(this.generateURLparams(engine ,'audio_query', data),{
			method: 'POST',
			headers: {
				'accept': 'application/json'
			}
		})
		switch (responseFetch.status) {
			case 200:
				return responseFetch.json();
			case 422:
				console.error("voicevoxエンジンでエラーが発生しています。");
				console.error("メソッド名:createAudioquery");
				throw await responseFetch.json();
			case 404:
				throw new Error('voicevoxエンジンに接続できません。 エンジンを確認してください。');
			default:
				throw new Error('想定しないエラーが発生しました。')
		}
	}

	static synthesisQuery = async(engine, data, query) => {
		const responseFetch = await fetch(this.generateURLparams(engine ,'synthesis', data),{
			method: 'POST',
			headers: {
				'accept': 'application/wav',
				'Content-Type': 'application/json'
			},
			body: JSON.stringify(query),
		});
		switch (responseFetch.status) {
			case 200:
				return await responseFetch.arrayBuffer();
			case 422:
				console.error("voicevoxエンジンでエラーが発生しています。");
				console.error("メソッド名:synthesisQuery");
				throw await responseFetch.json();
			case 404:
				throw new Error('voicevoxエンジンに接続できません。 エンジンを確認してください。');
			default:
				throw new Error('想定しないエラーが発生しました。')
		}
	}

/*
サーバー処理
*/	
	
	static getSpeaker = async(engine) => {
		const responseFetch = await this.serverGetter(engine,'speakers');
		switch (responseFetch.status) {
			case 200:
				return responseFetch.json();
			case 422:
				console.error("voicevoxエンジンでエラーが発生しています。");
				console.error("メソッド名:getSpeaker");
				throw await responseFetch.json();
			case 404:
				throw new Error('voicevoxエンジンに接続できません。 エンジンを確認してください。');
			default:
				throw new Error('想定しないエラーが発生しました。')
		}
	}

	static getUserdict = async(engine) => {
		const responseFetch = await this.serverGetter(engine,'user_dict');
		switch (responseFetch.status) {
			case 200:
				return responseFetch.json();
			case 422:
				console.error("voicevoxエンジンでエラーが発生しています。");
				console.error("メソッド名:getUserdict");
				throw await responseFetch.json();
			case 404:
				throw new Error('voicevoxエンジンに接続できません。 エンジンを確認してください。');
			default:
				throw new Error('想定しないエラーが発生しました。')
		}
	}

	static setUserdict = async(
		engine, 
		surface, 
		pronunciation,
		accent_type,
		word_type,
		priority=0) => {
		const data = {
			surface: surface,
			pronunciation: pronunciation,
			accent_type: accent_type,
			word_type: word_type,
			priority: priority,
		}
		const responseFetch = await fetch(this.generateURLparams(engine, 'user_dict_word',{
			method: 'POST',
			headers: {
				'accept': 'application/json'
			},
		}));
		switch (responseFetch.status) {
			case 200:
				return responseFetch.json();
			case 422:
				console.error("voicevoxエンジンでエラーが発生しています。");
				console.error("メソッド名:setUserdict");
				throw await responseFetch.json();
			case 404:
				throw new Error('voicevoxエンジンに接続できません。 エンジンを確認してください。');
			default:
				throw new Error('想定しないエラーが発生しました。')
		}
	}

	static deleteUserdict = async(engine, uuid) => {
		const responseFetch = await fetch(this.generateURLparams(engine, `user_dict_word/${uuid}`),{
			method: 'DELETE',
			headers: {
				'accept': '*/*'
			},
		});
		switch (responseFetch.status) {
			case 200:
				return responseFetch.json();
			case 422:
				console.error("voicevoxエンジンでエラーが発生しています。");
				console.error("メソッド名:deleteUserdict");
				throw await responseFetch.json();
			case 404:
				throw new Error('voicevoxエンジンに接続できません。 エンジンを確認してください。');
			default:
				throw new Error('想定しないエラーが発生しました。')
		}
	}
}