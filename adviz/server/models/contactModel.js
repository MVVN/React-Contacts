var mongoose = require("mongoose");

var Schema = mongoose.Schema;

var contactSchema = new Schema({
    vorname: { type: String, required: true },
    nachname: { type: String, required: true },
    adresse: { type: String, required: true },
    hausnummer: { type: Number, required: true },
    plz: { type: Number, required: true },
    stadt: { type: String, required: true },
    fedState: { type: String, required: false },
    land: { type: String, required: false },
    privat: { type: Boolean, required: true },
    owner: {
        type: Schema.Types.ObjectId,   //<-- used for normal ID but we use String-Username as ID
        // type: String,
        ref: "user"
    },
    lat: { type: String, required: true },
    lon: { type: String, required: true }
});

// create Model with singular name "contact" --> will be "contacts"-collection in MongoDB
const Contact = mongoose.model("contact", contactSchema);
module.exports = Contact;