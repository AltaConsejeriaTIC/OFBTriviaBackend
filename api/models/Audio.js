'use strict';

const Model = require('../../config/triviaDBConnection').Model;


class Audio extends Model{
	
	static get tableName(){
		
		return 'audios';
	}
}


module.exports = Audio;