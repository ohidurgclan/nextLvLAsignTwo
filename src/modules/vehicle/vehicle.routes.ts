import { Router } from "express";
import { vehicleControllers } from "./vehicle.controller";
import auth from "../../middleware/auth";

const router = Router();

// Public Routes
router.get("/vehicles", vehicleControllers.getVehicles);
router.get("/vehicles/:vehicleId", vehicleControllers.getSingleVehicle);
// Admin Routes
router.post("/vehicles", auth("admin"), vehicleControllers.createVehicle);
router.put("/vehicles/:vehicleId", auth("admin"), vehicleControllers.updateVehicle);
router.delete("/vehicles/:vehicleId", auth("admin"), vehicleControllers.deleteVehicle);

export const vehicleRoutes = router;