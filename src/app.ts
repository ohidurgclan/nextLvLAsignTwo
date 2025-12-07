import express, { Request, Response } from "express";
import initDB from "./config/db";
import { userRouts } from "./modules/user/user.routes";
import { authRoutes } from "./modules/auth/auth.routes";
import { vehicleRoutes } from "./modules/vehicle/vehicle.routes";
import { bookingRoutes } from "./modules/booking/booking.routes";

const app = express()
app.use(express.json());

initDB();

app.get("/", (req: Request, res: Response) => {
  res.send("Hellow Next Level Examiner! Welcome To Root Route....")
});

app.use("/api/v1", authRoutes);
app.use("/api/v1", userRouts);
app.use("/api/v1", vehicleRoutes);
app.use("/api/v1", bookingRoutes);


//* 404 Not Found Route
app.use((req:Request, res: Response)=>{
  res.status(404).json({
    success: false,
    message: "Route Not Found",
    path: req.path,
  });
});

export default app;