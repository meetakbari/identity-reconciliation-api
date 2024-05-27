import ContactRepository from "../repositories/ContactRepository";
import { Contact } from "../db/models/Contact";

export const createContact = async (email: string, phoneNumber: string): Promise<Contact> => {
  return await ContactRepository.createContact(email, phoneNumber);
};