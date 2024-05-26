import { Repository } from "typeorm";
import { Contact } from "../db/models/Contact";

export class ContactRespository extends Repository<Contact> {
    // repository methods such getAllContacts, createContact
}
