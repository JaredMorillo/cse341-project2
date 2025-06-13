const express = require('express');
const router = express.Router();

const contactsController = require('../controllers/contacts');
const { isAuthenticated } = require('../middleware/authenticate');

router.get('/', contactsController.getAllContacts);
router.get('/:id', contactsController.getSingleContact);
router.post('/', isAuthenticated, contactsController.createContact);
router.put('/:id', isAuthenticated, contactsController.updateContact);
router.delete('/:id', isAuthenticated, contactsController.deleteContact);

module.exports = router;
// This file defines the routes for handling contact-related requests.  