const contacts = require("../models/contacts");
const HttpError = require("../Helpers/HttpError");
const ctrlWrapper = require("../Helpers/ctrlWrapper");

const getContacts = async (req, res) => {
  const list = await contacts.listContacts();
  res.json(list);
};

const getOneContact = async (req, res) => {
  const contact = await contacts.getContactById(req.params.contactId);
  if (contact) res.json(contact);
  else throw HttpError(404, "Not found");
};

const addContact = async (req, res) => {
  const newContact = await contacts.addContact(req.body);
  res.status(201).json(newContact);
};

const deleteContact = async (req, res) => {
  const delContact = await contacts.removeContact(req.params.contactId);
  if (delContact) res.json({ message: "contact deleted" });
  else throw HttpError(404, "Not found");
};

const updateContact = async (req, res) => {
  const updContact = await contacts.updateContact(
    req.params.contactId,
    req.body
  );
  if (updContact) res.json(updContact);
  else throw HttpError(404, "Not found");
};

module.exports = {
  getContacts: ctrlWrapper(getContacts),
  getOneContact: ctrlWrapper(getOneContact),
  addContact: ctrlWrapper(addContact),
  deleteContact: ctrlWrapper(deleteContact),
  updateContact: ctrlWrapper(updateContact),
};
