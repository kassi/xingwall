var mongoose = require('mongoose'),
    Schema   = mongoose.Schema;

mongoose.model('Profile', new Schema({
  userId: String,
  displayName: String,
  photoUrls: {
    size_128x128: String,
    size_256x256: String
  }
}));
