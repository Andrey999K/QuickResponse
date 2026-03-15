import { Response } from "express";
import { AuthRequest } from "@/types/authRequest";
import { VacancyService } from "./vacancy.service";
import { logger } from "@/utils/log";

const vacancyService = new VacancyService();

/**
 * Получить все вакансии по поиску
 */
export const getVacancies = async (req: AuthRequest, res: Response) => {
  try {
    const { searchId } = req.params;

    const vacancies = await vacancyService.getVacanciesBySearchId(Number(searchId));
    return res.json(vacancies);
  } catch (error) {
    logger.error("Error fetching vacancies: " + error);
    return res.status(500).json({ message: "Error while fetching vacancies" });
  }
};

/**
 * Получить новые вакансии по поиску
 */
export const getNewVacancies = async (req: AuthRequest, res: Response) => {
  try {
    const { searchId } = req.params;

    const vacancies = await vacancyService.getNewVacanciesBySearchId(Number(searchId));
    return res.json(vacancies);
  } catch (error) {
    logger.error("Error fetching new vacancies: " + error);
    return res.status(500).json({ message: "Error while fetching new vacancies" });
  }
};

/**
 * Пометить вакансию как просмотренную
 */
export const markVacancyAsRead = async (req: AuthRequest, res: Response) => {
  try {
    const { vacancyId } = req.params;

    const marked = await vacancyService.markAsRead(Number(vacancyId));
    if (!marked) {
      return res.status(404).json({ message: "Vacancy not found" });
    }

    return res.json({ message: "Vacancy marked as read" });
  } catch (error) {
    logger.error("Error marking vacancy as read: " + error);
    return res.status(500).json({ message: "Error while marking vacancy as read" });
  }
};

/**
 * Пометить все вакансии поиска как просмотренные
 */
export const markAllVacanciesAsRead = async (req: AuthRequest, res: Response) => {
  try {
    const { searchId } = req.params;

    const count = await vacancyService.markAllAsRead(Number(searchId));
    return res.json({ message: `Marked ${count} vacancies as read` });
  } catch (error) {
    logger.error("Error marking all vacancies as read: " + error);
    return res.status(500).json({ message: "Error while marking all vacancies as read" });
  }
};
