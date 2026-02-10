import express, { Request, Response } from "express";
import helmet from "helmet";
import compression from "compression";
import { testConnection } from "./db/connection";
import { env } from "./config/env";
import { initDatabase } from "./db/initDb";
import { userRouter } from "./modules/users/user.controller";
import { corsMiddleware } from "./middleware/corsMiddleware";
import { logMiddleware } from "./middleware/logMiddleware";
import { authRouter } from "./modules/auth/auth.controller";
import { authMiddleware } from "./middleware/authMiddleware";
import { validate } from "./middleware/validationMiddleware";
import { createUserDto } from "./modules/users/user.dto";

const app = express();

const port = env.PORT || 3000;

app.use(helmet());
app.use(compression());
app.use(express.json());
app.use(corsMiddleware);
app.use(logMiddleware);

async function main() {
  try {
    // Тестируем подключение
    await testConnection();

    // Инициализируем базу данных (создаём таблицы и заполняем данными)
    if (env.NODE_ENV === 'development') {
      await initDatabase();
    }

    app.get('/', (_req: Request, res: Response) => {
      res.send('Hello World!');
    });

    app.use("/api/auth", validate(createUserDto), authRouter);
    app.use("/api/users", authMiddleware, userRouter);

    app.use((_req, res) => {
      res.status(404).json({ message: "Not Found" });
    });

    app.listen(port, () => {
      console.log(`✅ Server is running on port ${port}`);
      console.log(`✅ Database initialized with mock data`);
      console.log(`✅ Try: http://localhost:${port}/`);
      console.log(`✅ Try: http://localhost:${port}/api/auth/signup`);
    });

  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
}

main();