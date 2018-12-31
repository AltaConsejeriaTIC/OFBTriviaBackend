
exports.up = function(knex, Promise) {
  
  return Promise.all([
    knex.schema.table('questions', questions => {
      questions.boolean('question_selected_winners').notNullable().defaultTo(false);
			questions.enu('question_status',
								['Publicada', 'Terminada', 'Programada',
								 'Pendiente publicacion ganadores', 'Mostrando ganadores']).
				notNullable().defaultTo('Programada').alter();
    })
  ]);
};

exports.down = function(knex, Promise) {
  
};
