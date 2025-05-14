const ContactUs = require('../models/ContactUs');

const createContact = (req, res) => {
    const { email, message } = req.body;
    
    if (!email || !message) {
        return res.status(400).json({ error: 'Email and message are required' });
    }

    const newContact = new ContactUs({
        email,
        message
    });

    newContact.save()
        .then(savedContact => {
            res.status(201).json(savedContact);
        })
        .catch(error => {
            res.status(500).json({ error: error.message });
        });
};

const getAllContacts = (req, res) => {
    ContactUs.find().sort({ createdAt: -1 }) 
        .then(contacts => {
            res.status(200).json(contacts);
        })
        .catch(error => {
            res.status(500).json({ error: error.message });
        });
};

const deleteContact = (req, res) => {
    const { id } = req.params;

    ContactUs.findByIdAndDelete(id)
        .then(deletedContact => {
            if (!deletedContact) {
                return res.status(404).json({ error: 'Contact not found' });
            }
            res.status(200).json({ message: 'Contact deleted successfully' });
        })
        .catch(error => {
            res.status(500).json({ error: error.message });
        });
};

module.exports = {
    createContact,
    getAllContacts,
    deleteContact
};