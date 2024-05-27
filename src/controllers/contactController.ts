import { Request, Response } from "express-serve-static-core";
import { createContact } from "../services/contactService";
import { CreateContactResponse } from "../types/response/ContactResponses";
 
export const createContactHandler = async (req: Request, res: Response) => {
  const { email, phoneNumber } = req.body;

  try {
    const response: CreateContactResponse = await createContact(email, phoneNumber);
    res.status(201).json(response);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
