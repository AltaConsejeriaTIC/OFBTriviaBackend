
exports.up = function(knex, Promise) {
	
	return Promise.all([
		knex.schema.table('citizens', citizens => {
			citizens.enu('citizen_contact_media', ['email', 'SMS', 'email, SMS']).alter();
		})
	]);
};

exports.down = function(knex, Promise) {
  
};
