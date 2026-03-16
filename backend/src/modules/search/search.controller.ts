import { Response } from "express";
import { SearchService } from "./search.service";
import { AuthRequest } from "@/types/authRequest";
import { createSearchDto, updateSearchDto } from "./search.dto";
import { Search } from "./search.types";
import { logger } from "@/utils/log";
import { getSchedulerService } from "@/server";

const searchService = new SearchService();

export const getAllSearches = async (req: AuthRequest, res: Response) => {
  try {
    const searches = await searchService.getUserSearches(req.userId!);
    return res.json(searches);
  } catch (error) {
    logger.error("Error fetching all searches: " + error);
    return res.status(500).json({ message: "Error while fetching searches" });
  }
};

export const getSearch = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const search = await searchService.getSearchById(Number(id), req.userId!);

    if (!search) {
      return res.status(404).json({ message: "Search not found" });
    }

    return res.json(search);
  } catch (error) {
    logger.error("Error fetching search: " + error);
    return res.status(500).json({ message: "Error while fetching search" });
  }
};

export const createSearch = async (req: AuthRequest, res: Response) => {
  try {
    const validation = createSearchDto.safeParse(req.body);
    if (!validation.success) {
      return res.status(400).json({
        message: "Validation error",
        errors: validation.error.issues,
      });
    }

    const {
      title,
      keywords,
      excluded_text,
      salary,
      currency,
      only_with_salary,
      area,
      schedule,
      employment,
      experience,
      cover_letter,
    } = validation.data;

    const newSearch = await searchService.createSearch(
      req.userId!,
      title,
      keywords ?? null,
      excluded_text ?? null,
      salary ?? null,
      currency,
      only_with_salary,
      area,
      schedule,
      employment,
      experience,
      cover_letter ?? null,
    );

    return res.status(201).json(newSearch);
  } catch (error) {
    logger.error("Error creating search: " + error);
    return res.status(500).json({ message: "Error while creating search" });
  }
};

export const updateSearch = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const validation = updateSearchDto.safeParse(req.body);

    if (!validation.success) {
      return res.status(400).json({
        message: "Validation error",
        errors: validation.error.issues,
      });
    }

    const updatedSearch = await searchService.updateSearch(
      Number(id),
      req.userId!,
      validation.data as Partial<Search>,
    );

    if (!updatedSearch) {
      return res.status(404).json({ message: "Search not found" });
    }

    return res.json(updatedSearch);
  } catch (error) {
    logger.error("Error updating search: " + error);
    return res.status(500).json({ message: "Error while updating search" });
  }
};

export const deleteSearch = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const deleted = await searchService.deleteSearch(Number(id), req.userId!);

    if (!deleted) {
      return res.status(404).json({ message: "Search not found" });
    }

    return res.json({ message: "Search deleted successfully" });
  } catch (error) {
    logger.error("Error deleting search: " + error);
    return res.status(500).json({ message: "Error while deleting search" });
  }
};

export const toggleSearchStatus = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const { is_active } = req.body;

    if (typeof is_active !== "boolean") {
      return res.status(400).json({ message: "is_active must be a boolean" });
    }

    const updatedSearch = await searchService.toggleSearchStatus(
      Number(id),
      req.userId!,
      is_active,
    );

    if (!updatedSearch) {
      return res.status(404).json({ message: "Search not found" });
    }

    // Уведомляем планировщик об изменении статуса
    const scheduler = getSchedulerService();
    if (scheduler) {
      if (is_active) {
        scheduler.addSearch({ id: Number(id), title: updatedSearch.title, is_active });
        logger.info(`[Search] Поиск "${updatedSearch.title}" запущен`);
      } else {
        scheduler.removeSearch(Number(id));
        logger.info(`[Search] Поиск "${updatedSearch.title}" остановлен`);
      }
    }

    return res.json(updatedSearch);
  } catch (error) {
    logger.error("Error toggling search status: " + error);
    return res.status(500).json({ message: "Error while toggling search status" });
  }
};
