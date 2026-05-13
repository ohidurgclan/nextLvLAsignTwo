import { Router } from "express";
import { autoReturnBookings } from "./cron.controller";

const router = Router();

router.get("/booking-return", autoReturnBookings);

export const cronRoutes = router;