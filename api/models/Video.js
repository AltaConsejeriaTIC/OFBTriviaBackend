'use strict';

const Model = require('../../config/triviaDBConnection').Model;


class Video extends Model{	
	
	static get tableName(){
		
		return 'videos';
	}
}


module.exports = Video;