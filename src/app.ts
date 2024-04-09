import express, { Express, Request, Response } from "express";
import AuthRouter from "../routes/auth/AuthRoutes";
import Dbconnection from "../database/dbConnection";
import cors from "cors";

const app: Express = express();

const Origins = ["http://localhost:3001", "http://localhost:3000"]
app.use(express.json());
app.use("/client/api/auth", AuthRouter);
app.use(cors({ origin: Origins , credentials: true}));

// app.get("/", (req: Request, res: Response) => {
//   res.send({ htm: "Hello" });
// });

Dbconnection(app);


export default app
