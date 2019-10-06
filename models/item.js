var mongoose = require('mongoose');

// User Schema
var ItemSchema = mongoose.Schema({
  name: {
    type: String
  },
  description: String,
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Owner'
  },
  print: {
    type: Boolean,
    default: false
  },
  created: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Item', ItemSchema);
