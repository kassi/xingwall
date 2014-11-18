var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

var WallSchema = new Schema({
  profiles: [
    {
      _id: String,
      displayName: String,
      photoUrls: {
        size_64x64: String,
        size_256x256: String
      }
    }
  ]
});

mongoose.model('Wall', WallSchema);
