
exports.up = function(knex, Promise) {
  
	return Promise.all([
		knex.schema.table('videos', videos => {
			videos.string('video_thumbnail').notNullable();
			videos.float('video_total_time').notNullable();
			videos.string('video_author').notNullable();
			videos.boolean('video_selected').notNullable().defaultTo(false);
		}),
		knex.schema.table('audios', audios => {
			audios.boolean('audio_selected').notNullable().defaultTo(false);
		})
	]);
};

exports.down = function(knex, Promise) {
  
};
