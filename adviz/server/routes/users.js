const express = require("express");

// allows middleware to return promises; no try-catch needed
const router = require("express-promise-router")();
const passport = require("passport");

const passportConfig = require("../passport");
const UsersController = require("../controllers/usersController");

router.route("/all")
    .get(UsersController.showAll)

//used to create users with hashed password instead of plain text
router.route("/signup")
    .post(UsersController.signUp);

router.route("/login")
    // .get(UsersController.index)
    .post(passport.authenticate("local", { session: false }), UsersController.login);

router.route("/logout")
    .get(UsersController.logout);

module.exports = router;