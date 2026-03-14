import { Router } from "express";
import {
  getAllSearches,
  getSearch,
  createSearch,
  updateSearch,
  deleteSearch,
} from "@/modules/search/search.controller";

const router = Router();

router.get("/", getAllSearches);
router.get("/:id", getSearch);
router.post("/", createSearch);
router.patch("/:id", updateSearch);
router.delete("/:id", deleteSearch);

export const searchRoutes = router;
