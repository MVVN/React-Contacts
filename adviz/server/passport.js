const passport = require("passport");
const localStrategy = require("passport-local").Strategy;
const User = require("./models/userModel");


passport.use(new localStrategy({
    usernameField: "username"
}, async (username, password, done) => {
    try {
        const user = await User.findOne({ username });
        if (!user) {
            // if user doesnt exist return no error and false for user
            return done(null, false);   
        }
        const isCorrect = await user.checkPassword(password);
        if (!isCorrect) {
             // password doesnt match, return no error and false for user
            return done(null, false);
        } 
        // user and pw matches -> return no error and the user
        done(null, user);
    } catch (error) {
        done(error, false);
    }
}));