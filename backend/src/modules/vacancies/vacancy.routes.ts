import { Router } from "express";
import {
  getNewVacancies,
  getVacancies,
  markAllVacanciesAsRead,
  markVacancyAsRead,
} from "@/modules/vacancies/vacancy.controller";

const router = Router();

router.get("/:searchId", getVacancies);
router.get("/:searchId/new", getNewVacancies);
// router.get("/:vacancyId", getVacancyById);
router.patch("/:vacancyId/mark-read", markVacancyAsRead);
router.patch("/:searchId/mark-all-read", markAllVacanciesAsRead);

export const vacancyRoutes = router;
