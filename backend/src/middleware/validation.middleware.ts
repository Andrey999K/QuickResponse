import { NextFunction, Request, Response } from "express";
import { z, ZodError } from "zod";
import { logger } from "@/utils/log";

export const validate = (schema: z.ZodSchema) => {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      if ("email" in req.body && "password" in req.body) {
        schema.parse(req.body);
        return next();
      }
      return res.status(400).json({ message: "Email and password are required" });
    } catch (error) {
      if (error instanceof ZodError) {
        try {
          const errors: object[] = JSON.parse(error.message).map(
            (error: { message: string }) => ({ message: error.message })
          );
          return res.status(422).json(errors);
        } catch (error) {
          logger.error("Error parsing Zod validation errors: " + error);
          return res.status(500).json({ message: "Internal server error" });
        }
      }
    }
  };
};