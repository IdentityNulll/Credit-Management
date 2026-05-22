import { Router } from "express";
import {
  getAllCredits,
  createCredit,
  updateCredit,
  deleteCredit,
} from "../controllers/creditController.js";

const router = Router();

router.get("/", getAllCredits);
router.post("/", createCredit);
router.put("/:id", updateCredit);
router.delete("/:id", deleteCredit);

export default router;
