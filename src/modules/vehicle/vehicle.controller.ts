import { Request, Response } from "express";
import { vehicleService } from "./vehicle.service";

const createVehicle = async (req: Request, res: Response) => {
    try {
        const { type, availability_status } = req.body;
        const validTypes = ["car", "bike", "van", "SUV"];
        if (!validTypes.includes(type)) {
            return res.status(400).json({
                message: `Invalid vehicle type. Allowed: ${validTypes.join(", ")}`
            });
        }
        const validStatus = ["available", "booked"];
        if (!validStatus.includes(availability_status)) {
            return res.status(400).json({
                message: `Invalid Availability Status. Allowed: ${validStatus.join(", ")}`
            });
        }
        const result = await vehicleService.addNewVehicle(req.body);
        return res.status(201).json({
          message: "Vehicle Inserted Successfully",
            data: result.rows[0]
        });
    } catch (error: any) {
        console.error(error);
        return res.status(500).json({
            message: error.message,
        });
    }
};

const getVehicles = async (req: Request, res: Response) => {
    try {
        const result = await vehicleService.getAllVehicles();

        return res.status(200).json({
            message: "Vehicles retrieved successfully",
            data: result.rows
        });

    } catch (error: any) {
        console.error(error);
        return res.status(500).json({
            message: error.message,
        });
    }
};

export const getSingleVehicle = async (req: Request, res: Response) => {
    try {
        const vehicleId = Number(req.params.vehicleId);
        const result = await vehicleService.getVehicleById(vehicleId);
        if (result.rows.length === 0) {
            return res.status(404).json({
                message: "Vehicle not found",
            });
        }
        return res.status(200).json({
            message: "Vehicle details Got",
            data: result.rows[0],
        });
    } catch (error: any) {
        console.error(error);
        return res.status(500).json({
            message: error.message,
        });
    }
};

const updateVehicle = async (req: Request, res: Response) => {
    try {
        const vehicleId = Number(req.params.vehicleId);
        const { type, availability_status } = req.body;
        const validTypes = ["car", "bike", "van", "SUV"];
        const validStatus = ["available", "booked"];
        if (type && !validTypes.includes(type)) {
            return res.status(400).json({ message: "Invalid vehicle type" });
        }
        if (availability_status && !validStatus.includes(availability_status)) {
            return res.status(400).json({ message: "Invalid availability status" });
        }
        const result = await vehicleService.updateVehicle(req.body, vehicleId);
        if (result.rowCount === 0) {
            return res.status(404).json({ message: "Vehicle not found" });
        }
        return res.status(200).json({
            message: "Vehicle updated successfully",
            data: result.rows[0]
        });
    } catch (error: any) {
        return res.status(500).json({ message: error.message });
    }
};

export const deleteVehicle = async (req: Request, res: Response) => {
    try {
        const vehicleId = Number(req.params.vehicleId);
        const activeBooking = await vehicleService.checkActive(vehicleId);
        if (activeBooking.rows.length > 0) {
            return res.status(400).json({
                message: "Cannot Delete This Vehicle, Because Its on Active Booking!!!"
            });
        }
        const result = await vehicleService.deleteVehicle(vehicleId);
        if (result.rowCount === 0) {
            return res.status(404).json({ message: "Vehicle not found" });
        }
        return res.status(200).json({ message: "Vehicle Deleted successfully" });
    } catch (error: any) {
        console.error(error);
        return res.status(500).json({ message: error.message });
    }
};
export const vehicleControllers  = {
  createVehicle, getVehicles, getSingleVehicle, updateVehicle, deleteVehicle
};