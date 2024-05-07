const mongoose = require("mongoose");

const authorSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  uniqueId: {
    type: Number,
    default: 0,
  },
});

module.exports = mongoose.model("Author", authorSchema);
