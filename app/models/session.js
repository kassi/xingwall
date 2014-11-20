var mongoose = require('mongoose'),
    Schema   = mongoose.Schema;

mongoose.model('Session', new Schema({
  _id: String,
  session: {
    lastActive: Date
  }
}));
