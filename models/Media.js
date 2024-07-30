const mongoose = require('mongoose');

const mediaSchema = new mongoose.Schema({
  mediaId: String,
  mediaUrl: String,
});

module.exports = mongoose.model('Media', mediaSchema);
