var mongoose = require('mongoose'),
    Schema   = mongoose.Schema;

mongoose.model('Profile', new Schema({
  userId: String,
  displayName: String,
  photoUrls: {
    size_128x128: String,
    size_256x256: String
  },
  wants: String,
  haves: String,
  webProfiles: {
    amazon: Array,
    delicious: Array,
    digg: Array,
    doodle: Array,
    dopplr: Array,
    ebay: Array,
    facebook: Array,
    flickr: Array,
    foursquare: Array,
    github: Array,
    'google+': Array,
    homepage: Array,
    last_fm: Array,
    lifestream_fm: Array,
    mindmeister: Array,
    'mister wong': Array,
    other: Array,
    photobucket: Array,
    plazes: Array,
    qype: Array,
    reddit: Array,
    'second life': Array,
    sevenload: Array,
    slideshare: Array,
    sourceforge: Array,
    spreed: Array,
    'stumble upon': Array,
    twitter: Array,
    vimeo: Array,
    wikipedia: Array,
    yelp: Array,
    youtube: Array,
    zoominfo: Array
  }
}));
