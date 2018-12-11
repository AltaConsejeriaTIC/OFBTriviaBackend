
exports.up = function(knex, Promise) {
  
	return Promise.all([
		knex.schema.table('videos', videos => {
			videos.boolean('video_active').notNullable().defaultTo(true);
		}),
		knex.schema.table('audios', audios => {
			audios.boolean('audio_active').notNullable().defaultTo(true);
		})
	]);
};

exports.down = function(knex, Promise) {
  
};
