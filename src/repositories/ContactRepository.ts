import { Contact, LinkPrecedence } from "../db/models/Contact";
import { AppDataSource } from "../db/data-source";

const contactRepository = AppDataSource.getRepository(Contact);

const createContact = async (email: string, phoneNumber: string, linkedId: number, linkPrecedence: LinkPrecedence): Promise<Contact> => {
    const contact = new Contact();
    contact.email = email;
    contact.phoneNumber = phoneNumber;
    contact.linkedId = linkedId;
    contact.linkPrecedence = linkPrecedence;
    return await contactRepository.save(contact);
}

const getContact = async (email?: string, phoneNumber?: string): Promise<Contact | null> => {
    return await contactRepository.findOne({ 
        where: {
            email: email, 
            phoneNumber: phoneNumber
        } 
    });
};

const getLinkedContacts = async (email: string, phoneNumber: string): Promise <Contact[]> => {
    return await contactRepository.createQueryBuilder('contact')
        .where('contact.email = :email OR contact.phoneNumber = :phoneNumber', { email, phoneNumber })
        .orderBy('contact.createdAt', 'DESC')
        .getMany();
}

export default {
    createContact,
    getContact,
    getLinkedContacts
};