const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  user_email: String,
  med_name: String,
  Medication: Array
});
module.exports = userSchema;
