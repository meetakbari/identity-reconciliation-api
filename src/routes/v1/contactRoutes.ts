import { Router } from "express";
import { createContactHandler } from "../../controllers/contactController";
const router = Router();

router.post("/identify", createContactHandler);

export default router;