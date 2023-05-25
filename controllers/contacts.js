const Contact = require('../models/contact');
const HttpError = require("../Helpers/HttpError");
const ctrlWrapper = require("../Helpers/ctrlWrapper");

const getContacts = async (req, res) => {
  const {_id:owner} = req.user;
  const { page = 1, limit = 20 } = req.query;
  const skip = (page-1) * limit;
  const list = await Contact.find({owner}, "-_id -owner", {skip, limit});
  res.json(list);
};

const getOneContact = async (req, res) => {
  const contact = await Contact.findById(req.params.contactId);
  if (contact) res.json(contact);
  else throw HttpError(404, "Not found");
};

const addContact = async (req, res) => {
  const {_id:owner} = req.user;
  const newContact = await Contact.create({...req.body, owner});
  res.status(201).json(newContact);
};

const deleteContact = async (req, res) => {
  const delContact = await Contact.findByIdAndRemove(req.params.contactId);
  if (delContact) res.json({ message: "contact deleted" });
  else throw HttpError(404, "Not found");
};

const updateContact = async (req, res) => {
  const {_id:owner} = req.user;
  const updContact = await Contact.findByIdAndUpdate(
    req.params.contactId,
    {...req.body, owner},
    {new: true}
  );
  if (updContact) res.json(updContact);
  else throw HttpError(404, "Not found");
};

const updateStatusContact = async (req, res) => {
  const updContact = await Contact.findByIdAndUpdate(
    req.params.contactId,
    req.body,
    {new: true}
  );
  if (updContact) res.json(updContact);
  else throw HttpError(404, "Not found");
}

module.exports = {
  getContacts: ctrlWrapper(getContacts),
  getOneContact: ctrlWrapper(getOneContact),
  addContact: ctrlWrapper(addContact),
  deleteContact: ctrlWrapper(deleteContact),
  updateContact: ctrlWrapper(updateContact),
  updateStatusContact:ctrlWrapper(updateStatusContact)
};
