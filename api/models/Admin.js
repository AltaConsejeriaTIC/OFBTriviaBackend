'use strict';

const Model = require('../../config/triviaDBConnection').Model;


class Admin extends Model{	
	
	static get tableName(){
		
		return 'admins';
	}
}


module.exports = Admin;