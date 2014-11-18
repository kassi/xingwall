var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

var WallSchema = new Schema({
  profiles: [
    {
      _id: String,
      displayName: String,
      photoUrls: {
        size_128x128: String,
        size_256x256: String
      }
    }
  ]
});

mongoose.model('Wall', WallSchema);
