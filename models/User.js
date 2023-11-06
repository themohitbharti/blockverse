const mongoose = require("mongoose");
const session = require('express-session');
const passport = require("passport");
const passportLocalMongoose = require("passport-local-mongoose");
const findOrCreate = require('mongoose-findorcreate');





const userSchema = new mongoose.Schema({
    username:String,
    leader_name: String,
    leader_email: String,
    profile_photo_url: String,
    member_name: String,
    member_email: String,
    payment_amount: Number,
    googleId: String,
    email: String, 
  });
  

  userSchema.plugin(passportLocalMongoose);
  userSchema.plugin(findOrCreate);


  const User = new mongoose.model("User", userSchema);
  module.exports = User;