var mongoose = require('mongoose');

// User Schema
var OwnerSchema = mongoose.Schema({
  name: {
    type: String,
    unique: true
  },
  publicName: String,
  message: String,
  created: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Owner', OwnerSchema);
