import { Contact, LinkPrecedence } from "../db/models/Contact";
import { AppDataSource } from "../db/data-source";

const contactRepository = AppDataSource.getRepository(Contact);

const createContact = async (email: string, phoneNumber: string): Promise<Contact> => {
    const contact = new Contact();
    contact.email = email;
    contact.phoneNumber = phoneNumber;
    contact.linkedId = null;
    contact.linkPrecedence = LinkPrecedence.PRIMARY;
    return await contactRepository.save(contact);
}

export default {
    createContact
};