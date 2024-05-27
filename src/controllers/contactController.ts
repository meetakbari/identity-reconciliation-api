import { Request, Response } from "express-serve-static-core";
import { createContact } from "../services/contactService";
 
export const createContactHandler = async (req: Request, res: Response) => {
  const { email, phoneNumber } = req.body;

  try {
    const newContact = await createContact(email, phoneNumber);
    res.status(201).json(newContact);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// export default {
//     createContactHandler
// };
