import { Request, Response, NextFunction } from "express";
import { z, ZodError } from "zod";

export const validate = (schema: z.ZodSchema) => {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      schema.parse(req.body);
      return next();
    } catch (error) {
      if (error instanceof ZodError) {
        try {
          const errors: object[] = JSON.parse(error.message).map(
            (error: { message: string }) => ({ message: error.message })
          );
          return res.status(500).json(errors);
        } catch (error) {
          console.log("error", error);
          return res.status(500).json({ message: "Internal server error" });
        }
      }
    }
  };
};