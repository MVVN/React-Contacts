var mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

var Schema = mongoose.Schema;

var userSchema = new Schema({
    // _id: reqString,
    username: { type: String, lowercase: true, required: true, unique: true },
    password: { type: String, required: true },
    firstname: { type: String, required: true },
    lastname: { type: String, required: true },
    isAdmin: { type: Boolean, required: true },
    contacts: [{
        type: Schema.Types.ObjectId,
        ref: "contact"
    }],
});

// call this before User.save() to encode users password with bcryptjs
// userSchema.pre("save", async function (next) {
//     try {
//         //const saltCode = await bcrypt.genSalt(7);
//         //this equals the user
//         //const hashedPassword = await bcrypt.hash(this.password, saltCode);
//         this.password = this.password;
//         next();
//     } catch (error) {
//         next(error);
//     }
// });

userSchema.methods.checkPassword = async function (typedPassword) {
    try {
        return await typedPassword == this.password;
    } catch (error) {
        throw new Error(error);
    }
}

// create Model with singular name "user" --> will be "users"-collection in MongoDB
const User = mongoose.model("user", userSchema);
module.exports = User;