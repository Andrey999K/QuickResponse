import { createLogger, format, transports } from "winston";

const consoleFormat = format.combine(
  format.colorize(),
  format.printf(({ level, message }) => `${level}: ${message}`)
);

export const logger = createLogger({
  level: process.env.NODE_ENV === "development" ? "http" : "info",
  format: format.combine(
    format.timestamp(),
    format.json()
  ),
  transports: [
    new transports.Console({ format: consoleFormat }),
    new transports.File({ filename: 'logs/error.log', level: 'error' }),
    new transports.File({ filename: 'logs/combined.log' }),
  ],
});