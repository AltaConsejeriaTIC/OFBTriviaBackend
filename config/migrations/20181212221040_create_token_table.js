exports.up = function(knex, Promise) {
  return Promise.all([
    knex.schema.createTable('tokens', table => {
      table.increments('id').primary();
      table.string('token',500);
      table.timestamp('created_at').defaultTo(knex.fn.now());
    })
  ]);
};

exports.down = function(knex, Promise) {
  return Promise.all([
    knex.schema.dropTable('tokens')
  ])
};
