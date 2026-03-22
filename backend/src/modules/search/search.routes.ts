import { Router } from "express";
import {
  getAllSearches,
  getSearch,
  createSearch,
  updateSearch,
  deleteSearch,
  toggleSearchStatus,
} from "@/modules/search/search.controller";
import { authMiddleware } from "@/middleware/auth.middleware";
import { checkSearchLimit } from "@/middleware/subscription.middleware";

const router = Router();

router.get("/", authMiddleware, getAllSearches);
router.get("/:id", authMiddleware, getSearch);
router.post("/", authMiddleware, checkSearchLimit, createSearch);
router.patch("/:id", authMiddleware, updateSearch);
router.patch("/:id/toggle-status", authMiddleware, toggleSearchStatus);
router.delete("/:id", authMiddleware, deleteSearch);

export const searchRoutes = router;
