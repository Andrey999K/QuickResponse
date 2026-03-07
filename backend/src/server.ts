import compression from "compression";
import cookieParser from "cookie-parser";
import express, { Request, Response } from "express";
import helmet from "helmet";
import morgan from "morgan";
import { authMiddleware } from "./middleware/auth.middleware";
import { corsMiddleware } from "./middleware/cors.middleware";
import { errorHandler, notFound } from "@/middleware/error.middleware";
import { env } from "./config/env";
import { testConnection } from "@/config/db/connection";
import { logger } from "@/utils/log";
import { authRoutes } from "@/modules/auth/auth.routes";
import { userRoutes } from "@/modules/users/user.routes";

const app = express();

const port = env.PORT || 3000;

app.use(helmet());
app.use(compression());
app.use(express.json());
app.use(cookieParser());
app.use(corsMiddleware);

if (env.NODE_ENV === "development") app.use(morgan("dev"));

async function main() {

  try {
    // Тестируем подключение
    await testConnection();

    // Инициализируем базу данных (создаём таблицы и заполняем данными)
    // if (env.NODE_ENV === "development") {
    //   await initDatabase();
    // }

    app.get("/", (_req: Request, res: Response) => {
      res.send("Hello World!");
    });

    app.use("/api/auth", authRoutes);
    app.use("/api/users", authMiddleware, userRoutes);

    app.use(notFound);
    app.use(errorHandler);

    app.listen(port, () => {
      logger.info(`✅ Server is running on port ${port}`);
    });
  } catch (error) {
    console.error("Failed to start server:", error);
    process.exit(1);
  }
}

main();
