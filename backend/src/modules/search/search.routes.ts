import { Router } from "express";
import {
  createSearch,
  deleteSearch,
  getAllSearches,
  getSearch,
  toggleSearchStatus,
  updateSearch,
} from "@/modules/search/search.controller";
import { checkSearchLimit } from "@/middleware/subscription.middleware";

const router = Router();

router.get("/", getAllSearches);
router.get("/:id", getSearch);
router.post("/", checkSearchLimit, createSearch);
router.patch("/:id", updateSearch);
router.patch("/:id/toggle-status", toggleSearchStatus);
router.delete("/:id", deleteSearch);

export const searchRoutes = router;
