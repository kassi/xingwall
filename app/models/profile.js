// Example model

var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

var ProfileSchema = new Schema({
  displayName: String,
  photoUrls: {
    size_64x64: String,
    size_256x256: String
  }
});

//ArticleSchema.virtual('date')
//  .get(function(){
//    return this._id.getTimestamp();
//  });

mongoose.model('Profile', ProfileSchema);
