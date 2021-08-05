const Contact = require("../models/contactModel");
const User = require("../models/userModel");

module.exports = {
    showAll: async (req, res, next) => {
        const contacts = await Contact.find({});
        res.status(200).json(contacts);
    },

    postContact: async (req, res, next) => {
        //find the UserID of the Owner the Contact belongs to
        const owner = await User.findById(req.body.owner);
        if (!owner) {
            return res.status(403).json({ error: "Owner not found." });
        }
        const newContact = req.body;
        //  delete newContact.owner;         // delete the owner-ID out of newContact because i want to save the whole object
        const contact = new Contact(newContact);
        //   contact.owner = owner;           // add the owner as object 
        //TODO: dachte, so kann ich das gesamte objekt speichern, aber ist auch nur die ID
        await contact.save();
        owner.contacts.push(contact);   // add contact-object to the contacts field of the user
        await owner.save();
        res.status(201).json(contact._id);
    },

    getContact: async (req, res, next) => {
        const { id } = req.params;
        const contact = await Contact.findById(id);
        res.status(200).json(contact);
    },

    putContact: async (req, res, next) => {
        const { id } = req.params;
        const updatedContact = req.body;

        await Contact.findByIdAndUpdate(id, updatedContact);
        res.status(204).json();
    },

    deleteContact: async (req, res, next) => {
        const { id } = req.params;
        const contact = await Contact.findById(id);
        if (!contact) {
            return res.status(404).json({ error: "Contact not found." })
        }
        const ownerId = contact.owner;
        const owner = await User.findById(ownerId);

        await contact.remove();
        owner.contacts.pull(contact);
        await owner.save();
        res.status(204).json();
    },

    //TODO: still wrong? API: /adviz/contacts?userId=USERID not adviz/contacts/USERID
    /* 
    getUsersContacts: async (req, res, next) => {
        const {userId} = req.params;
        const user = await User.findById(userId).populate("contacts");
        res.status(200).json(user.contacts);
    }, 
    */

    getUsersContacts: async (req, res, next) => {
        const user = await User.findById(req.query.userId).populate("contacts");
        res.send(user.contacts);
    }

}; 