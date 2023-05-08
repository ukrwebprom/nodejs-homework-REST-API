const fs = require("fs").promises;
const path = require("path");
const { nanoid } = require("nanoid");

const contactsPath = path.join(__dirname, "contacts.json");

const listContacts = async () => {
  try {
    const res = await fs.readFile(contactsPath);
    return JSON.parse(res);
  } catch {
    console.warn("error");
  }
};

const getContactById = async (contactId) => {
  try {
    const contacts = await listContacts();
    const contact = contacts.find((c) => c.id === contactId);
    return contact || null;
  } catch {
    console.log("error");
  }
};

const removeContact = async (contactId) => {
  try {
    const contacts = await listContacts();
    const index = contacts.findIndex((c) => c.id === contactId);
    if (index === -1) return null;
    const [result] = contacts.splice(index, 1);
    await fs.writeFile(contactsPath, JSON.stringify(contacts, null, 2));
    return result;
  } catch {
    console.log("error");
  }
};

const addContact = async (body) => {
  const { name, email, phone } = body;
  const contact = {
    id: nanoid(),
    name,
    email,
    phone,
  };
  try {
    const contacts = await listContacts();
    await fs.writeFile(
      contactsPath,
      JSON.stringify([...contacts, contact], null, 2)
    );
    return contact;
  } catch {
    console.log("error");
  }
};

const updateContact = async (contactId, body) => {
  try {
    const contacts = await listContacts();
    const index = contacts.findIndex(c => c.id === contactId);
    if(index === -1) return null;
    contacts[index] = {...contacts[index], ...body};
    return (contacts[index])
  } catch {
    console.log("error");
  }
};

module.exports = {
  listContacts,
  getContactById,
  removeContact,
  addContact,
  updateContact,
};
