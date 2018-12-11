
exports.up = function(knex, Promise) {
  
	return Promise.all([
		knex.schema.table('videos', videos => {
			videos.string('video_total_time').notNullable().alter();
		})
	]);
};

exports.down = function(knex, Promise) {
  
};