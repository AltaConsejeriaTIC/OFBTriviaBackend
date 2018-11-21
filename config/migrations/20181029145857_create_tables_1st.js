
exports.up = function(knex, Promise) {
	
	return Promise.all([
		knex.schema.createTable('citizens', table => {
			table.increments('citizen_id').primary().unique();
			table.string('citizen_email').notNullable().unique();
			table.string('citizen_name').notNullable();
			table.string('citizen_last_name').notNullable();
			table.string('citizen_cellphone').notNullable().unique();
			table.enu('citizen_contact_media', ['email', 'SMS']).notNullable();
		}),
		knex.schema.createTable('questions', table => {
			table.increments('question_id').primary().unique();
			table.string('question_content').notNullable();
			table.timestamp('question_created_date').defaultTo(knex.fn.now()).notNullable();
			table.date('question_start_date').notNullable();
			table.date('question_end_date').notNullable();
			table.string('question_real_answer').notNullable();
		}),
		knex.schema.createTable('answers', table => {
			table.primary(['answer_citizen', 'answer_question']);
			table.integer('answer_citizen').unsigned().notNullable();
			table.integer('answer_question').unsigned().notNullable();
			table.foreign('answer_citizen').references('citizen_id').inTable('citizens');
			table.foreign('answer_question').references('question_id').inTable('questions');
			table.string('answer_content').notNullable();
			table.decimal('answer_score');
			table.boolean('answer_winner').defaultTo(false);
			table.timestamp('answer_date').defaultTo(knex.fn.now()).notNullable();
		}),
		knex.schema.createTable('admins', table => {
			table.increments('admin_id').primary().unique();
			table.string('admin_account_name').notNullable().unique();
			table.string('admin_email').notNullable().unique();
			table.string('admin_name').notNullable();
			table.string('admin_last_name').notNullable();
			table.string('admin_password').notNullable();
			table.boolean('admin_is_active').notNullable().defaultTo(true);
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
