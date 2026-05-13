import express from "express";
import { autoReturnBookings } from "./cron.controller";

const router = express.Router();

router.get("/booking-return", autoReturnBookings);

export const cronRoutes = router;