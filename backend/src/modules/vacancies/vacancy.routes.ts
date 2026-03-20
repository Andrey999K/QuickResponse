import { Router } from "express";
import {
  getNewVacancies,
  getVacancies,
  getVacancyById,
  markAllVacanciesAsRead,
  markVacancyAsRead,
  updateCoverLetter,
} from "@/modules/vacancies/vacancy.controller";

const router = Router();

router.get("/:searchId", getVacancies);
router.get("/:searchId/new", getNewVacancies);
router.get("/:vacancyId", getVacancyById);
router.patch("/:vacancyId/mark-read", markVacancyAsRead);
router.patch("/:searchId/mark-all-read", markAllVacanciesAsRead);
router.patch("/:vacancyId/cover-letter", updateCoverLetter);

export const vacancyRoutes = router;
