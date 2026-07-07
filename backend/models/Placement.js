const mongoose = require("mongoose");

const PlacementSchema = new mongoose.Schema({
  student: {
    type: String,
    required: true,
  },

  company: {
    type: String,
    required: true,
  },

  location: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model("Placement", PlacementSchema);