
const daysBetweenQuestions = 2;
const questionsPerPage = 4;
<<<<<<< HEAD
=======
const errorMessage = {
	message: 'An error has ocurred.'
};
>>>>>>> 446dd7b6132837798d7cc823ce1e809a08b2834c
const adminFields = {
	email: 'admin_email',
	name: 'admin_name',
	lastName: 'admin_last_name',
	password: 'admin_password',
	userName: 'admin_account_name',
	active: 'admin_is_active'
};
const videoFields = {
	title: 'video_title',
	url: 'video_url',
	id: 'video_id'
};
const audioFields = {
	title: 'audio_title',
	artist: 'audio_artist',
	url: 'audio_url',
	id: 'audio_id'
};

module.exports = {
	videoFields: videoFields,
	adminFields: adminFields,
<<<<<<< HEAD
	daysBetweenQuestions: daysBetweenQuestions,
	questionsPerPage: questionsPerPage
=======
	audioFields: audioFields,
	daysBetweenQuestions: daysBetweenQuestions,
	questionsPerPage: questionsPerPage,
	errorMessage: errorMessage
>>>>>>> 446dd7b6132837798d7cc823ce1e809a08b2834c
};