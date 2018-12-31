
exports.up = function(knex, Promise) {
  
	return Promise.all([
    knex.schema.table('audios', audios => {
      audios.dropColumn('audio_selected');
    }),
		knex.schema.table('videos', videos => {
      videos.dropColumn('video_selected');
    })
  ]);
};

exports.down = function(knex, Promise) {
  
};
