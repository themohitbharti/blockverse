
const oauthController = (req, res) => {
    passport.authenticate('google', { scope: ["profile", "email"] })(req, res);
};


const blockverseController = (req, res) => {
    passport.authenticate('google', {
      failureRedirect: "/login"
    })(req, res, () => {
      res.redirect("/blockverse");
    });
  };
  



const loginController = (req, res) => {
    res.render("login");
};

module.exports = {
    oauthController,
    blockverseController,
    loginController,
};



