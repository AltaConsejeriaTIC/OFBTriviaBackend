'use strict';

const Model = require('../../config/triviaDBConnection');


class Admin extends Model{	
	
	static get tableName(){
		
		return 'admins';
	}
}


module.exports = Admin;