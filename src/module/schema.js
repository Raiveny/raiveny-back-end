const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  user_email: String,
  Name: String,
  medication: Array
});
module.exports = userSchema;
