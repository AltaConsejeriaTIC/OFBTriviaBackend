'use strict';

const Video = require('../models/Video');
const helpers = require('../helpers/helpers');
const constants = require('../helpers/constants');
const imagesPath = require('../../config/paths').imagesPath;


function storeThumbnail(videoId, thumbnail){
  
  if (thumbnail){
    const fileName = 'thumbnail_video_' + videoId;
    helpers.storeFile(thumbnail, fileName);
  }
}

function formatVideoToSend(video){
  
  return {
    id: video.video_id,
    title: video.video_title,
    author: video.video_author,
    time: video.video_total_time,
    selected: video.video_selected,
    url: video.video_url,
    thumbnail: video.video_thumbnail || ''
  };
}

function updateVideo(video, res, isANewVideo = false){
  Video.query().
  where('video_id', video.id).
  update(helpers.formatData(video, constants.videoFields)).
  then(() => {
    // storeThumbnail(video.id, thumbnail);
    
    // if (isANewVideo)
    //   helpers.sendId(res)(video);
    
    // else
    res.status(200).send({id: parseInt(video.id)});
  }).
  catch((err) => {
    helpers.sendError(res)

  });
}

function insertVideo(params, res){
  Video.query().
  insert(helpers.formatData(params, constants.videoFields)).
  then(video => {
  //   const toUpdate = {
  //     id: video.id,
  //     thumbnail: `thumbnail_video_${video.id}.${thumbnail.name.split('.').slice(-1)}`
  //   };
  //   storeThumbnail(video.id, thumbnail);
  //   updateVideo(toUpdate, null, res, true);
    res.status(200).send({id: parseInt(video.id)});
  }).
  catch(() => helpers.sendError(res));
}

function manageVideoData(req, res){
  const videoOperation = (req.body.id > 0)? updateVideo : insertVideo;
  //const thumbnail = req.files.thumbnail || null;
  videoOperation(req.body, res);
}

function getVideos(req, res){
  Video.query().
  select().
  then(videos => res.status(200).send(videos.map(video => formatVideoToSend(video)))).
  catch(() => helpers.sendError(res));
}

function getThumbnail(req, res){
  Video.query().
  select('video_thumbnail as path').
  where('video_id', req.swagger.params.id.value).
  then(foundVideo => {
    
    if (foundVideo.length > 0)
      res.status(200).sendFile(`${imagesPath}/${foundVideo[0].path}`);
    
    else
      res.status(400).send({message: 'thumbnail not found'});
  }).
  catch(() => helpers.sendError(res));
}

function getVideo(req, res){
  Video.query().
  select().
  where('video_id', req.swagger.params.id.value).
  then(video => res.status(200).send(formatVideoToSend(video[0]))).
  catch(() => helpers.sendError(res));
}

function getVideoData(req, res){
    youtube.videos.list({
      id: youtube_parser(req.swagger.params.id.value), //req.swagger.params.id.value,
      part: 'contentDetails, snippet'
    })
    .then((response) => {
      res.status(200).send(response.data)
    })
    .catch((err) => {
      () => helpers.sendError(res)
    })
}

// Esta función extrae el ID de un video de youtube desde la URL: url soportadas:
// http://www.youtube.com/watch?v=0zM3nApSvMg&feature=feedrec_grec_index
// http://www.youtube.com/user/IngridMichaelsonVEVO#p/a/u/1/QdK8U-VIH_o
// http://www.youtube.com/v/0zM3nApSvMg?fs=1&amp;hl=en_US&amp;rel=0
// http://www.youtube.com/watch?v=0zM3nApSvMg#t=0m10s
// http://www.youtube.com/embed/0zM3nApSvMg?rel=0
// http://www.youtube.com/watch?v=0zM3nApSvMg
// http://youtu.be/0zM3nApSvMg
function youtube_parser(url){
    var regExp = /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#\&\?]*).*/;
    var match = url.match(regExp);
    return (match&&match[7].length==11)? match[7] : false;
}

module.exports = {
  manageVideoData: manageVideoData,
  getVideos: getVideos,
  getThumbnail: getThumbnail,
  getVideo: getVideo,
  getVideoData: getVideoData
};