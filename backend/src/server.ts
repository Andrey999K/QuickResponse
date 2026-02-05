import express, { Request, Response } from 'express';
import dotenv from 'dotenv';
import { testMiddleware } from "./testMiddleware";
import helmet from "helmet";
import compression from "compression";

const app = express();

dotenv.config();

const port = process.env.PORT || 3000;
const dbUser = process.env.DB_USER;
const dbPassword = process.env.DB_PASSWORD;

app.use(helmet());
app.use(compression());
app.use(express.json());

async function main() {
  app.get('/', testMiddleware, (_req: Request, res: Response) => {
    res.send('Hello World!');
  });

  app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
  });
}

main();