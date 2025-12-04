import express, { Request, Response } from "express";
import initDB from "./config/db";
import { userRouts } from "./modules/user/user.routes";
import { todoRoutes } from "./modules/todo/todo.routes";
import { authRoutes } from "./modules/auth/auth.routes";

const app = express()


// Express Json Parcer
app.use(express.json());
// app.use(express.urlencoded()); For Form Data

// initializing DB
initDB();
app.get("/", (req: Request, res: Response) => {
  res.send("Hi Developers")
});

app.use("/users", userRouts);
app.use("/todos", todoRoutes);
app.use("/auth", authRoutes);


//* 404 Not Found Route
app.use((req:Request, res: Response)=>{
  res.status(404).json({
    success: false,
    message: "Route Not Found",
    path: req.path,
  });
});

export default app;