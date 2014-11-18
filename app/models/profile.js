var mongoose = require('mongoose'),
    Schema   = mongoose.Schema;

var ProfileSchema = new Schema({
  _id: String,
  displayName: String,
  photoUrls: {
    size_64x64: String,
    size_256x256: String
  }
});

mongoose.model('Profile', ProfileSchema);
