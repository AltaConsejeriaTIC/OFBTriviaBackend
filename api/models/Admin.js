'use strict';

const Model = require('../../config/triviaDBConnection').Model;


class Admin extends Model{	
	
	static get tableName(){
		
		return 'admins';
	}
	
	static get jsonSchema(){
		
		return {
			type: 'object',
			required: ['email', 'name', 'lastName'],
			
			properties: {
				id: {type: 'integer'},
				email: {type: 'string'},
				name: {type: 'string'},
				lastName: {type: 'string'},
				password: {type: 'string'}
			}
		};
	}
}


module.exports = Admin;