const mongodb = require('../data/database');
const ObjectId = require('mongodb').ObjectId;

const getAllContacts = async (req, res) => {
    //#swagger.tags = ['Contacts']
    const result = await mongodb.getDatabase().db().collection('contacts').find();
    const contacts = await result.toArray();
    res.setHeader('Content-Type', 'application/json');
    res.status(200).json(contacts);
};

const getSingleContact = async (req, res) => {
    //#swagger.tags = ['Contacts']
    const contactId = new ObjectId(req.params.id);
    const result = await mongodb.getDatabase().db().collection('contacts').find({ _id: contactId });
    result.toArray().then((contacts) => {
        res.setHeader('Content-Type', 'application/json');
        res.status(200).json(contacts[0]);
    });
};

const createContact = async (req, res) => {
    //#swagger.tags = ['Contacts']

        const contact = {
            username: req.body.username,
            name: req.body.name,
            email: req.body.email,
            ipadress: req.body.ipadress,
        };
        const response = await mongodb.getDatabase().db().collection('contacts').insertOne(contact);
        if (response.acknowledged) {
            res.status(201).json({ message: 'Contact created successfully', contactId:response.insertedId });
        } else {
            res.status(500).json(response.error || 'An error occurred while creating the contact');
        }
};

const updateContact = async (req, res) => {
    //#swagger.tags = ['Contacts']
        const contactId = new ObjectId(req.params.id);
        const contact = {
            username: req.body.username,
            name: req.body.name,
            email: req.body.email,
            ipadress: req.body.ipadress,
        };
        const response = await mongodb.getDatabase().db().collection('contacts').replaceOne({ _id: contactId }, contact);
        if (response.modifiedCount > 0) {
            res.status(200).json({ message: 'Contact updated successfully' });
        } else {
            res.status(404).json(response.error || 'An error occurred while updating the contact');
        }
    };

const deleteContact = async (req, res) => {
    //#swagger.tags = ['Contacts']
   
        const contactId = new ObjectId(req.params.id);
        const response = await mongodb.getDatabase().db().collection('contacts').deleteOne({ _id: contactId });
        if (response.deletedCount > 0) {
            res.status(200).json({ message: 'Contact deleted successfully' });
        } else {
            res.status(404).json({ error: 'Contact not found' });
        }
};

module.exports = {
    getAllContacts,
    getSingleContact,
    createContact,
    updateContact,
    deleteContact
};
