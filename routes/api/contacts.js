const express = require('express')
const contacts = require('../../models/contacts');
const Joi = require('joi');
const postSchema = Joi.object({
  name: Joi.string().required(),
  email: Joi.string().email().required(),
  phone: Joi.string().required()
});
const putSchema = Joi.object({
  name: Joi.string(),
  email: Joi.string().email(),
  phone: Joi.string()
}).or('name', 'email', 'phone');

const router = express.Router()

router.get('/', async (req, res, next) => {
  const list = await contacts.listContacts();
  res.json(list);
})

router.get('/:contactId', async (req, res, next) => {
  const contact = await contacts.getContactById(req.params.contactId);
  if(contact) res.json(contact);
  else res.status(404).json({ message: 'Not found' });
})

router.post('/', async (req, res, next) => {
  const { error, value } = postSchema.validate(req.body);
  if (error) res.status(400).json({message: "missing required name field"})
  else {
    const newContact = await contacts.addContact(value);
    res.status(201).json(newContact);
  }
})

router.delete('/:contactId', async (req, res, next) => {
  const delContact = await contacts.removeContact(req.params.contactId);
  if(delContact) res.json({message: "contact deleted"});
  else res.status(404).json({ message: "Not found" })
})

router.put('/:contactId', async (req, res, next) => {
  const { error, value } = putSchema.validate(req.body);
  if(error) res.status(400).json({ message: "missing fields" })
  else {
    const updContact = await contacts.updateContact(req.params.contactId, value);
    if(updContact) res.json(updContact);
    else res.status(404).json({ message: 'Not found' });
  }
})

module.exports = router
