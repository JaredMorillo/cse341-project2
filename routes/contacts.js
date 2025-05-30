const express = require('express');
const router = express.Router();

const contactsController = require('../controllers/contacts');

router.get('/', contactsController.getAllContacts);

router.get('/:id', contactsController.getSingleContact);

module.exports = router;
// This file defines the routes for handling contact-related requests.  