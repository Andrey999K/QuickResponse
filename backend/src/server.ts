import compression from "compression";
import express, { Request, Response } from "express";
import helmet from "helmet";
import morgan from "morgan";
import { authMiddleware } from "./middleware/auth.middleware";
import { corsMiddleware } from "./middleware/cors.middleware";
import { env } from "./config/env";
import { testConnection } from "./db/connection";
import { initDatabase } from "./db/initDb";
import { authRouter } from "./modules/auth/auth.controller";
import { userRouter } from "./modules/users/user.controller";

const app = express();

const port = env.PORT || 3000;

app.use(helmet());
app.use(compression());
app.use(express.json());
app.use(corsMiddleware);

if (process.env.NODE_ENV === "development") app.use(morgan("dev"));

async function main() {
  try {
    // Тестируем подключение
    await testConnection();

    // Инициализируем базу данных (создаём таблицы и заполняем данными)
    if (env.NODE_ENV === "development") {
      await initDatabase();
    }

    app.get("/", (_req: Request, res: Response) => {
      res.send("Hello World!");
    });

    app.use("/api/auth", authRouter);
    app.use("/api/users", authMiddleware, userRouter);

    app.use((_req, res) => {
      res.status(404).json({ message: "Not Found" });
    });

    app.listen(port, () => {
      console.log(`✅ Server is running on port ${port}`);
      console.log(`✅ Try: http://localhost:${port}/`);
      console.log(`✅ Try: http://localhost:${port}/api/auth/signup`);
    });
  } catch (error) {
    console.error("Failed to start server:", error);
    process.exit(1);
  }
}

main();
