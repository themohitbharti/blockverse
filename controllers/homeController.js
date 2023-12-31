

const User = require('../models/User');
const passport = require("passport");


const homeController = (req, res) => {
    res.render("home");
};

const memberController = (req, res) => {
    res.render("member_details");
};


const registerController = (req, res) => {
    res.render("register");
};

const loginController = (req, res) => {
    res.render("login");
};




const blockverseController = (req, res) => {
    if (req.isAuthenticated()) {
      console.log(req.user);
      const user = req.user;
      res.render("blockverse", {
        RAZORPAY_ID_KEY: process.env.RAZORPAY_ID_KEY,
        paid: user.paid,
      });
    } else {
      res.redirect("/login");
    }
  };


  const logoutController = (req, res) => {
    req.logout((err) => {
      if (err) {
        console.log(err);
      }
      res.redirect("/");
    });
  };




const registerPostController = async (req, res) => {
    const { username, leader_email, profile_photo_url, member_name, member_email, password } = req.body;

    if (!username) {
        return res.status(400).json({ error: "Username is required" });
    }
    try {
        const existingUser = await User.findOne({
    $or: [{ username }, { leader_email }]
        });

    if (existingUser) {
  return res.status(400).json({ error: "Username or leader_email is already taken" });
        }

        const user = new User({
            username,
            leader_email,
              profile_photo_url,
            member_name,
            member_email,
        });

        User.register(user, password, (err, user) => {
            if (err) {
                console.error(err);
                       return res.status(500).json({ error: "Registration failed" });
            }

     passport.authenticate("local")(req, res, () => {
                res.redirect("/blockverse");
            });
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: "Registration failed" });
    }
};


  const loginPostController = (req, res) => {
    const user = new User({
      username: req.body.username,
      password: req.body.password
    });
  
    req.login(user, function(err) {
      if (err) {
        console.log(err);
      } else {
        passport.authenticate("local")(req, res, function() {
          res.redirect("/blockverse");
        });
      }
    });
  };




const updateMemberDetailsController = async (req, res) => {
    if (req.isAuthenticated()) {
      const userId = req.user.id;
      const user = await User.findById(userId);
  
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }
  
      // Check if the provided member_email is already in the database
      const newMemberEmail = req.body.member_email;
      const isEmailUsed = await User.findOne({
        $or: [{ leader_email: newMemberEmail }, { member_email: newMemberEmail }],
      });
  
      if (isEmailUsed) {
        return res.status(400).json({ error: "This member is already registered for Blockverse." });
      }
  
      // Update the user's member-related fields
      user.member_name = req.body.member_name;
      user.member_email = newMemberEmail;
      user.payment_amount = req.body.payment_amount || 0;
  
      await user.save();
  
      res.redirect("/blockverse");
    } else {
      res.redirect("/login");
    }
  };
  
  
  
  
  
  
  

module.exports = {
    homeController,
    registerController,
    loginController,
    blockverseController,
    logoutController,
    registerPostController,
    loginPostController,
    memberController,
    updateMemberDetailsController,
    
};
