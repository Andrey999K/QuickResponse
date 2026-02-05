import express, { Request, Response } from 'express';
import { testMiddleware } from "./testMiddleware";
import helmet from "helmet";
import compression from "compression";
import { testConnection } from "./db/connection";
import { env } from "./config/env";

const app = express();

const port = env.PORT || 3000;

app.use(helmet());
app.use(compression());
app.use(express.json());

async function main() {
  await testConnection()

  app.get('/', testMiddleware, (_req: Request, res: Response) => {
    res.send('Hello World!');
  });

  app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
  });
}

main();