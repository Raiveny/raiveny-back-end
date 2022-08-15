const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  user_email: String,
  Name: String,
  medication: Array,
  Date : String
});
module.exports = userSchema;
