
exports.up = function(knex, Promise) {
	
	return Promise.all([
		knex.schema.
		createTable('citizens', table => {
			table.increments('citizen_id').primary().unique();
			table.string('citizen_email').unique();
			table.string('citizen_name');
			table.string('citizen_last_name');
			table.boolean('citizen_allows_contact');
			table.string('citizen_cellphone').unique();
		}),
		knex.schema.createTable('questions', table => {
			table.increments('question_id').primary().unique();
			table.string('question_content');
			table.timestamp('question_published_date').defaultTo(knex.fn.now());
			table.date('question_start_date');
			table.date('question_end_date');
			table.string('question_real_answer');
		}),
		knex.schema.createTable('answers', table => {
			table.primary(['answer_citizen', 'answer_question']);
			table.integer('answer_citizen').unsigned().notNullable();
			table.integer('answer_question').unsigned().notNullable();
			table.foreign('answer_citizen').references('citizen_id').inTable('citizens');
			table.foreign('answer_question').references('question_id').inTable('questions');
			table.string('answer_content');
			table.decimal('answer_score');
			table.boolean('answer_winner');
			table.timestamp('answer_date').defaultTo(knex.fn.now());
		}),
		knex.schema.
		createTable('admins', table => {
			table.increments('admin_id').primary().unique();
			table.string('admin_email');
			table.string('admin_name');
			table.string('admin_last_name');
			table.string('admin_password');
		})
	]);
};

exports.down = function(knex, Promise) {
  
	return Promise.all([
		knex.schema.dropTable('answers'),
		knex.schema.dropTable('citizens'),
		knex.schema.dropTable('questions'),
		knex.schema.dropTable('admins'),
	]);
};
