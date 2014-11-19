var mongoose = require('mongoose'),
    Schema   = mongoose.Schema,
    Profile  = mongoose.model('Profile');

mongoose.model('Wall', new Schema({
  name: String,
  profiles: [{ type: Schema.Types.ObjectId, ref: 'Profile' }]
}));
