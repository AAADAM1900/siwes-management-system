const mongoose = require("mongoose");

const LogbookSchema = new mongoose.Schema({
  studentId: String,
  content: String,
  date: Date,
  status: String,
});

module.exports = mongoose.model("Logbook", LogbookSchema);