
const daysBetweenQuestions = 2;
const questionsPerPage = 4;
const errorMessage = {
	message: 'An error has ocurred.'
};
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
	audioFields: audioFields,
	daysBetweenQuestions: daysBetweenQuestions,
	questionsPerPage: questionsPerPage,
	errorMessage: errorMessage
};