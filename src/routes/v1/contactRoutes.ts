import { Router } from "express";
import { createContactHandler } from "../../controllers/contactController";
import { validationMiddleware } from '../../middleware/validate';
import { CreateContactDto } from '../../dto/CreateContactDto';
const router = Router();

router.post("/identify", validationMiddleware(CreateContactDto), createContactHandler);

export default router;