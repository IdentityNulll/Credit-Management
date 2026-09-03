import { Router } from "express";
import {
  getAllCredits,
  getCreditById,
  createCredit,
  updateCredit,
  adjustAmount,
  deleteCredit,
} from "../controllers/creditController.js";

const router = Router();

router.route("/").get(getAllCredits).post(createCredit);
router.patch("/:id/amount", adjustAmount);
router.route("/:id").get(getCreditById).put(updateCredit).delete(deleteCredit);

export default router;
