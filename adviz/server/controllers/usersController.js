const jwt = require("jsonwebtoken");
const User = require("../models/userModel");
const { JWT_ENCODEWORD } = require("../configuration/configuration");


//create token with issuer, subject, issuedAt,expiration time
createToken = (user) => {
    return token = jwt.sign({
        iss: "AdViz",
        sub: user._id,
        iat: new Date().getTime(),  // get time of login
        exp: new Date().setDate(new Date().getDate() + 1) // set expiration date 1 day ahead
    }, JWT_ENCODEWORD);
}

module.exports = {
    /* 
        index: async (req, res, next) => {
            const users = await User.find({});
            res.status(200).json(users);
        },
         */
    showAll: async (req, res, next) => {
        const users = await User.find({});
        res.status(200).json(users);
    },
    signUp: async (req, res, next) => {
        const { username, password, isAdmin, contacts, firstname, lastname } = req.body;
        const foundUser = await User.findOne({ username });
        // throw error when username is already in database
        if (foundUser) {
            return res.status(403).json({ error: "Username already in use." });
        }
        const newUser = new User(req.body);
        await newUser.save();
        res.json({ user: "User " + username + " created." });
    },

    login: async (req, res, next) => {
        const user = req.user;
        const token = createToken(user);
        res.status(200).json({ user });
    },

    logout: async (req, res, next) => {
        req.logout();
        res.status(200).json("Logout Successful.");
    }
}; 