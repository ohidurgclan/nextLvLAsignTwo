import { Request, Response } from "express";
import { bookingService } from "./booking.service";
import { JwtPayload } from "jsonwebtoken";

const createBooking = async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: "JWT token missing" });
    }
    const decoded = req.user as JwtPayload & { id: number; role: string };
    const tokenUserId = decoded.id;
    const { vehicle_id, rent_start_date, rent_end_date } = req.body;
    if (!vehicle_id || !rent_start_date || !rent_end_date) {
      return res.status(400).json({
        success: false,
        message: "vehicle_id, rent_start_date, rent_end_date are Required For Booking"
      });
    }
    const vehicle = await bookingService.checkVehicle(Number(vehicle_id));
    if (vehicle.rowCount === 0) {
      return res.status(404).json({ 
        success: false,
        message: "Your Selected Vehicle not found" });
    }
    const selectedVehicle = vehicle.rows[0];
    if (selectedVehicle.availability_status !== "available") {
      return res.status(400).json({
        success: false,
        message: "Sorry! This Vehicle is Not Available for Booking! Please Select Another One. . ."
      });
    }
    const start = new Date(rent_start_date);
    const end = new Date(rent_end_date);
    const rentDuration = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
    if (rentDuration <= 0) {
      return res.status(400).json({ 
        success: false,
        message: "Invalid Date! Check Start and End Date Again" });
    }
    const total_price = rentDuration * Number(selectedVehicle.daily_rent_price);
    const payload = {
      customer_id: tokenUserId,
      vehicle_id: vehicle_id,
      rent_start_date: rent_start_date,
      rent_end_date: rent_end_date,
      total_price: total_price,
      status: "active"
    };
    await bookingService.updateVehicleAvailability(vehicle_id, "booked");
    const result = await bookingService.addBooking(payload);
    return res.status(201).json({
      success: true,
      message: `Congrats! You have Booked The Vehicle for ${rentDuration} Days and Total Cost is ${total_price.toFixed(2)} Taka.` ,
      data: result.rows[0],
    });
  } catch (error: any) {
    console.error(error);
    return res.status(500).json({ message: error.message });
  }
};

const getBookings = async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        supers: false,
        message: "Unauthorized: JWT missing"
      });
    }
    const decoded = req.user as JwtPayload & { id: number; role: string };
    const tokenUserId = decoded.id;
    const tokenRole = decoded.role;
    let result;
    if (tokenRole === "admin") {
      result = await bookingService.getAllBookings();
    } else {
      result = await bookingService.getCustomerBooking(tokenUserId);
    }
    return res.status(200).json({
      success: true,
      message: tokenRole === "admin" ? "Bookings retrieved successfully" : "Your bookings retrieved successfully",
      data: result.rows
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

const updateBooking = async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

    const decoded = req.user as JwtPayload & {
      id: number;
      role: string;
    };
    const tokenUserId = decoded.id;
    const tokenRole = decoded.role;
    const bookingId = Number(req.params.bookingId);
    const bookingResult = await bookingService.getBookingById(bookingId);

    if (bookingResult.rowCount === 0) {
      return res.status(404).json({
        success: false,
        message: "Booking not found",
      });
    }
    const booking = bookingResult.rows[0];
    if (tokenRole === "customer") {
      if (booking.customer_id !== tokenUserId) {
        return res.status(403).json({
          success: false,
          message: "You can cancel only your own bookings",
        });
      }
      if (booking.status === "cancelled") {
        return res.status(400).json({
          success: false,
          message: "Booking already cancelled",
        });
      }
      if (booking.status === "returned") {
        return res.status(400).json({
          success: false,
          message: "Returned booking cannot be cancelled",
        });
      }
      const today = new Date();
      const startDate = new Date(booking.rent_start_date);
      today.setHours(0, 0, 0, 0);
      startDate.setHours(0, 0, 0, 0);
      if (today >= startDate) {
        return res.status(400).json({
          success: false,
          message: "Cannot cancel after booking start date",
        });
      }
      const result = await bookingService.updateBookingStatus(
        "cancelled",
        bookingId
      );
      await bookingService.updateVehicleAvailability(
        booking.vehicle_id,
        "available"
      );
      return res.status(200).json({
        success: true,
        message: "Booking cancelled successfully",
        data: result.rows[0],
      });
    }
    if (tokenRole === "admin") {
      if (booking.status === "cancelled") {
        return res.status(400).json({
          success: false,
          message: "Cancelled booking cannot be returned",
        });
      }
      if (booking.status === "returned") {
        return res.status(400).json({
          success: false,
          message: "Booking already returned",
        });
      }
      const result = await bookingService.updateBookingStatus(
        "returned",
        bookingId
      );
      await bookingService.updateVehicleAvailability(
        booking.vehicle_id,
        "available"
      );
      return res.status(200).json({
        success: true,
        message: "Booking marked as returned. Vehicle is now available",
        data: {
          ...result.rows[0],
          vehicle: {
            availability_status: "available",
          },
        },
      });
    }

    return res.status(403).json({
      success: false,
      message: "Unauthorized action",
    });

  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const bookingController = {
    createBooking, getBookings,updateBooking
};