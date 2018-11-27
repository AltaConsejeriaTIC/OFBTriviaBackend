'use strict';

const Audio = require('../models/Audio');

function formatAudioToSend(audio){
	
	return {
		id: audio.id,
		title: audio.audio_title,
		artist: audio.audio_artist,
		url: audio.audio_url
	};
}

function getAudios(req, res){
	Audio.query().
	select().
	then(audios => res.status(200).send(audios.map(audio => formatAudioToSend(audio))));
}

module.exports = {
	getAudios: getAudios
};