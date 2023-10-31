const fs = require("node:fs/promises");
const path = require("node:path");
const crypto = require("node:crypto");

const contactsPath = path.join(__dirname, "db/contacts.json");

async function listContacts() {
  const data = await fs.readFile(contactsPath, { encoding: "utf-8" });

  return JSON.parse(data);
}

async function getContactById(contactId) {
  const contacts = await listContacts();
  const findedContact = contacts.find((contact) => contact.id === contactId);

  if (!findedContact) {
    return null;
  }

  return findedContact;
}

async function removeContact(contactId) {
  const contacts = await listContacts();
  const removedContactIndex = contacts.findIndex(
    (contact) => contact.id === contactId
  );

  if (removedContactIndex === -1) {
    return null;
  }

  const removedContact = contacts.splice(removedContactIndex, 1)[0];

  await fs.writeFile(contactsPath, JSON.stringify(contacts, null, 2));

  return removedContact;
}

async function addContact(name, email, phone) {
  const contacts = await listContacts();
  const newContact = { name, email, phone, id: crypto.randomUUID() };

  contacts.push(newContact);

  await fs.writeFile(contactsPath, JSON.stringify(contacts, null, 2));

  return newContact;
}

module.exports = {
  listContacts,
  addContact,
  removeContact,
  getContactById,
};
