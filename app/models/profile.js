var mongoose       = require('mongoose'),
    Schema         = mongoose.Schema,
    webProfilesDef = {},
    webProfiles    = [
      'amazon', 'delicious', 'digg', 'doodle', 'ebay', 'facebook', 'flickr', 'foursquare', 'github', 'google+',
      'homepage', 'last_fm', 'other', 'photobucket', 'reddit', 'slideshare', 'stumble upon', 'twitter', 'vimeo',
      'wikipedia', 'yelp', 'youtube'
    ];

webProfiles.forEach(function (profile) {
  webProfilesDef[profile] = Array;
});

var profileSchema = new Schema({
  userId: String,
  displayName: String,
  photoUrls: {
    size_128x128: String,
    size_256x256: String
  },
  wants: String,
  haves: String,
  webProfiles: webProfilesDef
});

profileSchema.statics.getLabelForWebProfile = function(webProfile) {
  return webProfilesDef[webProfile];
};

mongoose.model('Profile', profileSchema);
