import ContactRepository from "../repositories/ContactRepository";
import { Contact, LinkPrecedence } from "../db/models/Contact";
import { CreateContactResponse } from "src/types/response/ContactResponses";

export const createContact = async (email: string, phoneNumber: string): Promise<CreateContactResponse> => {
  const linkedContacts: Contact[] = await ContactRepository.getLinkedContacts(email, phoneNumber);
  
  // check if contact with same email and phoneNumber already exists
  const existingContact = await ContactRepository.getContact(email, phoneNumber);

  if (!existingContact) {
    // create a new contact
    let linkedId: number = null;
    let linkPrecedence: LinkPrecedence = LinkPrecedence.PRIMARY;

    if (linkedContacts.length > 0) {
      // get the id of the primary contact requires to pass in creation of secondary contact
      const primaryContact = linkedContacts.find(contact => contact.linkPrecedence === 'primary');
      linkedId = primaryContact.id;
      linkPrecedence = LinkPrecedence.SECONDARY;
    }

    const newContact = await ContactRepository.createContact(email, phoneNumber, linkedId, linkPrecedence);

    linkedContacts.unshift(newContact);
  }
  
  const primaryContact = linkedContacts.find(contact => contact.linkPrecedence === 'primary');
  const secondaryContacts = linkedContacts.filter(contact => contact.linkPrecedence === 'secondary');

  const emails = Array.from(new Set([primaryContact.email, ...secondaryContacts.map(contact => contact.email)].filter(email => email !== null)));
  const phoneNumbers = Array.from(new Set([primaryContact.phoneNumber, ...secondaryContacts.map(contact => contact.phoneNumber)].filter(phoneNumber => phoneNumber !== null)));
  const secondaryContactIds = secondaryContacts.map(contact => contact.id);

  return {
    contact: {
      primaryContactId: primaryContact.id,
      emails,
      phoneNumbers,
      secondaryContactIds
    }
  };
};