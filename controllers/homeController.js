const homeController = (req, res) => {
    res.render("home");
};

const registerController = (req, res) => {
    res.render("register");
};

const loginController = (req, res) => {
    res.render("login");
};

module.exports = {
    homeController,
    registerController,
    loginController,
};
