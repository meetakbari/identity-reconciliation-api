import ContactRepository from "../repositories/ContactRepository";
import { Contact, LinkPrecedence } from "../db/models/Contact";
import { CreateContactResponse } from "src/types/response/ContactResponses";

export const createContact = async (
  email: string,
  phoneNumber: string
): Promise<CreateContactResponse> => {
  const linkedContacts: Contact[] = await ContactRepository.getLinkedContacts(
    email,
    phoneNumber
  );

  const existingContact = linkedContacts.some(
    (contact) => contact.email === email || contact.phoneNumber === phoneNumber
  );

  if (!existingContact) {
    // create a new contact
    const newContact = await ContactRepository.createContact(
      email,
      phoneNumber,
      null,
      LinkPrecedence.PRIMARY
    );
    linkedContacts.unshift(newContact);
  } else {
    const primaryContacts = linkedContacts
      .map((contact, index) => ({ contact, index }))
      .filter(({ contact }) => contact.linkPrecedence === "primary");

    if (primaryContacts.length == 2) {
      // case: if there are 2 matching primary contacts, then update the recent one to secondary
      const recentPrimaryContact = primaryContacts[0];
      const oldPrimaryContact = primaryContacts[1];

      const updatedContact = await ContactRepository.updateContactToSecondary(
        recentPrimaryContact.contact.id,
        oldPrimaryContact.contact.id
      );

      linkedContacts[recentPrimaryContact.index] = updatedContact;
    } else if (primaryContacts.length == 1) {
      // create a new secondary contact if it contains new information
      let containsNewInfo = !linkedContacts.some(
        (contact) =>
          contact.email === email && contact.phoneNumber === phoneNumber
      );

      if (containsNewInfo === true) {
        containsNewInfo = !linkedContacts.some(
          (contact) =>
            contact.email === email || contact.phoneNumber === phoneNumber
        );
      }

      if (containsNewInfo) {
        const primaryContact = linkedContacts.find(
          (contact) => contact.linkPrecedence === "primary"
        );

        const newContact = await ContactRepository.createContact(
          email,
          phoneNumber,
          primaryContact.id,
          LinkPrecedence.SECONDARY
        );

        linkedContacts.unshift(newContact);
      }
    }
  }

  return getPreparedCreateContactResponse(linkedContacts);
};

const getPreparedCreateContactResponse = (
  linkedContacts: Contact[]
): CreateContactResponse => {
  const primaryContact = linkedContacts.find(
    (contact) => contact.linkPrecedence === "primary"
  );
  const secondaryContacts = linkedContacts.filter(
    (contact) => contact.linkPrecedence === "secondary"
  );

  const emails = Array.from(
    new Set(
      [
        primaryContact.email,
        ...secondaryContacts.map((contact) => contact.email),
      ].filter((email) => email !== null)
    )
  );
  const phoneNumbers = Array.from(
    new Set(
      [
        primaryContact.phoneNumber,
        ...secondaryContacts.map((contact) => contact.phoneNumber),
      ].filter((phoneNumber) => phoneNumber !== null)
    )
  );
  const secondaryContactIds = secondaryContacts.map((contact) => contact.id);

  return {
    contact: {
      primaryContactId: primaryContact.id,
      emails,
      phoneNumbers,
      secondaryContactIds,
    },
  };
};
