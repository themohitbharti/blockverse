


require('dotenv').config();
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");
const session = require('express-session');
const passport = require("passport");
const passportLocalMongoose = require("passport-local-mongoose");
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const findOrCreate = require('mongoose-findorcreate');

const connectDB = require("./config/db");




connectDB();


const app =express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


app.use(express.static("public"));
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(session({
  secret: "Our little secret.",
  resave: false,
  saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());

mongoose.connect(process.env.MONGODB_URL);



  const userSchema = new mongoose.Schema({
    leader_name: String,
    leader_email: String,
    profile_photo_url: String,
    member_name: String,
    member_email: String,
    payment_amount: Number,
    googleId: String, // Keep the Google ID for OAuth
    email: String, // Keep the email for OAuth
  });
  

  userSchema.plugin(passportLocalMongoose);
  userSchema.plugin(findOrCreate);

  const User = new mongoose.model("User", userSchema);

  passport.use(User.createStrategy());

  passport.serializeUser(function(user, done) {
    done(null, user.id);
  });
  


  passport.deserializeUser(async function(id, done) {
    try {
      const user = await User.findById(id);
      done(null, user);
    } catch (error) {
      done(error, null);
    }
  });
  











passport.use(new GoogleStrategy({
    clientID: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET,
    callbackURL: "http://localhost:4000/auth/google/blockverse",
    userProfileURL: "https://www.googleapis.com/oauth2/v3/userinfo"
  },
  async function(accessToken, refreshToken, profile, cb) {
    const email = profile.emails[0].value;
    
    try {
      const user = await User.findOne({ googleId: profile.id, email: email });
  
      if (!user) {
        // User doesn't exist, create a new user with the desired structure
        const newUser = new User({
          googleId: profile.id,
          email: email,
          leader_name: profile.displayName,
          leader_email: email,
          profile_photo_url: profile.photos[0].value,
        });
  
        await newUser.save();
        return cb(null, newUser);
      } else {
        // Update additional fields for the existing user
        user.leader_name = profile.displayName;
        user.leader_email = email;
        user.profile_photo_url = profile.photos[0].value;
  
        await user.save();
        return cb(null, user);
      }
    } catch (err) {
      return cb(err);
    }
  }));
  
  
  




  
  
  


  app.get("/", function(req, res){
    res.render("home");
  });







  app.get("/auth/google",
  passport.authenticate('google', { scope: ["profile","email"] })
);

app.get("/auth/google/blockverse",
  passport.authenticate('google', { failureRedirect: "/login" }),
  function(req, res) {
    // Successful authentication, redirect to secrets.
    res.redirect("/blockverse");
  });











  app.get("/login", function(req, res){
    res.render("login");
  });

  app.get("/register", function(req, res){
    res.render("register");
  });

  app.get("/blockverse", function(req, res){
    if (req.isAuthenticated()){
        console.log(req.user);
      res.render("blockverse");
     
    } else {
      res.redirect("/login");
    }
  });



  app.get("/logout", function(req, res){
    req.logout(function(err) {
      if (err) {
        console.log(err);
      }
      res.redirect("/");
    });
  });
  





app.post("/register", function (req, res) {
    console.log(req.body);
    const { username, leader_email, profile_photo_url, member_name, member_email, password } = req.body;
  
    const user = new User({
        username,
      leader_email,
      profile_photo_url,
      member_name,
     member_email,
      
    });
  
    User.register(user, password, function (err, user) {
      if (err) {
        console.error(err);
        return res.status(500).json({ error: "Registration failed" });
      }
      passport.authenticate("local")(req, res, function () {
        res.redirect("/blockverse");
      });
    });
  });
  
  



  app.post("/login", function(req, res){
    const user = new User({
      username: req.body.username,
      password: req.body.password
    });
    req.login(user, function(err){
      if (err) {
        console.log(err);
      } else {
        passport.authenticate("local")(req, res, function(){
          res.redirect("/blockverse");
        });
      }
    });
  });
  


const PORT = process.env.PORT || 4000;



app.listen(PORT,()=>{
    console.log(`server started at ${PORT}`);
})