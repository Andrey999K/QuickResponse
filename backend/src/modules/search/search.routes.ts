import { Router } from "express";
import {
  getAllSearches,
  getSearch,
  createSearch,
  updateSearch,
  deleteSearch,
  toggleSearchStatus,
} from "@/modules/search/search.controller";

const router = Router();

router.get("/", getAllSearches);
router.get("/:id", getSearch);
router.post("/", createSearch);
router.patch("/:id", updateSearch);
router.patch("/:id/toggle-status", toggleSearchStatus);
router.delete("/:id", deleteSearch);

export const searchRoutes = router;
