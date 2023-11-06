


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
const Razorpay = require('razorpay');
const nodemailer = require("nodemailer");

const connectDB = require("./config/db");
const sendEmail = require("./utils/email.js");
const homeRoutes = require("./routes/homeRoutes.js");
const authRoutes = require("./routes/authRoutes.js");
const User = require("./models/User.js");




connectDB();


const app =express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


app.use(express.static("public"));
app.set('views','views');
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(session({
  secret: process.env.SECRET,
  resave: false,
  saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());

mongoose.connect(process.env.MONGODB_URL);



 

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
      
        const newUser = new User({
          username:profile.displayName,
          googleId: profile.id,
          email: email,
          leader_name: profile.displayName,
          leader_email: email,
          profile_photo_url: profile.photos[0].value,
        });
  
        await newUser.save();
        return cb(null, newUser);
      } else {
        
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
  

  app.get("/auth/google",
  passport.authenticate('google', { scope: ["profile","email"] })
);

app.get("/auth/google/blockverse",
  passport.authenticate('google', { failureRedirect: "/login" }),
  function(req, res) {
    res.redirect("/blockverse");
  });



const PORT = process.env.PORT || 4000;



const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_ID_KEY,
    key_secret: process.env.RAZORPAY_SECRET_KEY,
})


app.post("/payment", (req,res)=>{
    let options = {
        amount : 2000,
        currency: "INR",
    };

    razorpay.orders.create(options , function(err,order){
        console.log(order);
        res.json(order);
    })
})




app.post("/payment/callback", (req, res) => {
  const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

  const paymentStatus = "transaction successful";

  res.render("verification", {
    paymentStatus,
    razorpay_order_id,
    razorpay_payment_id,
    razorpay_signature,
  });
});





app.post("/sendRegistrationConfirmationEmail", (req, res) => {
  const userEmail = req.user.email || req.user.leader_email;
  
  sendEmail({
    email: userEmail,
    subject: "blockverse registration",
    message: "your registration for blockverse is successful",
  });

  res.status(200).json({
    status: "success",
    message: "verification mail sent to the user's email",
  });
});





 app.use("/",homeRoutes);
 
  





app.listen(PORT,()=>{
    console.log(`server started at ${PORT}`);
})


