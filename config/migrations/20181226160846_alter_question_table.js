
exports.up = function(knex, Promise) {
  return Promise.all([
    knex.schema.table('questions', videos => {
      videos.boolean('notified').notNullable().defaultTo(false);
    })
  ]);

};

exports.down = function(knex, Promise) {
  
};
