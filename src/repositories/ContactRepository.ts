import { Contact, LinkPrecedence } from "../db/models/Contact";
import { AppDataSource } from "../db/data-source";

const contactRepository = AppDataSource.getRepository(Contact);

const createContact = async (
  email: string,
  phoneNumber: string,
  linkedId: number,
  linkPrecedence: LinkPrecedence
): Promise<Contact> => {
  const contact = new Contact();

  contact.email = email;
  contact.phoneNumber = phoneNumber;
  contact.linkedId = linkedId;
  contact.linkPrecedence = linkPrecedence;

  return await contactRepository.save(contact);
};

const updateContactToSecondary = async (
  id: number,
  linkedId: number
): Promise<Contact> => {
  await contactRepository.update(id, {
    linkedId: linkedId,
    linkPrecedence: LinkPrecedence.SECONDARY,
  });

  return await contactRepository.findOneBy({ id: id });
};

const getLinkedContacts = async (
  email: string,
  phoneNumber: string
): Promise<Contact[]> => {
  let linkedContacts: Contact[] = [];

  const contactQueryBuilder = contactRepository.createQueryBuilder("contact");

  // Find primary contacts which match email or phoneNumber -> Find secondary contacts where linkedId matches found primary contact id
  const primaryContacts = await getContactsByLinkPrecedence(
    email,
    phoneNumber,
    LinkPrecedence.PRIMARY
  );

  if (primaryContacts.length > 0) {
    const linkedSecondaryContacts = await contactQueryBuilder
      .where("contact.linkedId IN (:...linkedIds)", {
        linkedIds: primaryContacts.map((contact) => contact.id),
      })
      .orderBy("contact.createdAt", "DESC")
      .getMany();

    linkedContacts = [...primaryContacts, ...linkedSecondaryContacts];
  } else {
    // find secondary contacts and then using linkedId find primary contacts
    const secondaryContacts = await getContactsByLinkPrecedence(
      email,
      phoneNumber,
      LinkPrecedence.SECONDARY
    );

    let linkedPrimaryContacts: Contact[] = [];
    if (secondaryContacts.length > 0) {
      linkedPrimaryContacts = await contactQueryBuilder
        .where("contact.id IN (:...contactIds)", {
          contactIds: secondaryContacts.map((contact) => contact.linkedId),
        })
        .orderBy("contact.createdAt", "DESC")
        .getMany();
    }
    linkedContacts = [...linkedPrimaryContacts, ...secondaryContacts];
  }

  return linkedContacts;
};

const getContactsByLinkPrecedence = async (
  email: string,
  phoneNumber: string,
  linkPrecedence: LinkPrecedence
): Promise<Contact[]> => {
  const contacts = await contactRepository
    .createQueryBuilder("contact")
    .where(
      "contact.linkPrecedence = :linkPrecedence AND (contact.email = :email OR contact.phoneNumber = :phoneNumber)",
      { linkPrecedence, email, phoneNumber }
    )
    .orderBy("contact.createdAt", "DESC")
    .getMany();

  return contacts;
};

export default {
  createContact,
  updateContactToSecondary,
  getLinkedContacts,
};
