import express, { Request, Response } from 'express';
import { testMiddleware } from "./testMiddleware";
import helmet from "helmet";
import compression from "compression";
import { testConnection } from "./db/connection";
import { env } from "./config/env";
import { initDatabase } from "./db/initDb";

const app = express();

const port = env.PORT || 3000;

app.use(helmet());
app.use(compression());
app.use(express.json());

async function main() {
  try {
    // Тестируем подключение
    await testConnection();

    // Инициализируем базу данных (создаём таблицы и заполняем данными)
    if (env.NODE_ENV === 'development') {
      await initDatabase();
    }

    app.get('/', testMiddleware, (_req: Request, res: Response) => {
      res.send('Hello World!');
    });

    app.listen(port, () => {
      console.log(`✅ Server is running on port ${port}`);
      console.log(`✅ Database initialized with mock data`);
    });

  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
}

main();