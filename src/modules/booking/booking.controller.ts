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
        message: "vehicle_id, rent_start_date, rent_end_date are Required For Booking"
      });
    }
    const vehicle = await bookingService.checkVehicle(Number(vehicle_id));
    if (vehicle.rowCount === 0) {
      return res.status(404).json({ message: "Your Selected Vehicle not found" });
    }
    const selectedVehicle = vehicle.rows[0];
    if (selectedVehicle.availability_status !== "available") {
      return res.status(400).json({
        message: "Sorry! This Vehicle is Not Available for Booking! Please Select Another One. . ."
      });
    }
    const start = new Date(rent_start_date);
    const end = new Date(rent_end_date);
    const rentDuration = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
    if (rentDuration <= 0) {
      return res.status(400).json({ message: "Invalid Date! Check Start and End Date Again" });
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
    await bookingService.updateAvailableStatus(vehicle_id, "booked");
    const result = await bookingService.addBooking(payload);
    return res.status(201).json({
      message: `Congrats! You have Booked The Vehicle for ${rentDuration} Days and Total Cost is ${total_price.toFixed(2)} Taka.` ,
      data: result.rows[0],
    });
  } catch (error: any) {
    console.error(error);
    return res.status(500).json({ message: error.message });
  }
};

// Role Based Booking View.
const getBookings = async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({
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
      message: "Booking Data Found. . .",
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
    const decoded = req.user as JwtPayload & { id: number; role: string };
    const tokenUserId = decoded.id;
    const tokenRole = decoded.role;
    const bookingId = Number(req.params.bookingId);
    const bookingResult = await bookingService.getBookingById(bookingId);
    if (bookingResult.rowCount === 0) {
      return res.status(404).json({ message: "This Booking is not Found" });
    }
    const booking = bookingResult.rows[0];
    const today = new Date();
    if (new Date(booking.rent_end_date) < today && booking.status !== "returned") {
      await bookingService.updateBookingStatus("returned", bookingId);
      await bookingService.updateAvailableStatus(booking.vehicle_id, "available");
    }
    const latest = await bookingService.getBookingById(bookingId);
    const currentBooking = latest.rows[0];
    if (tokenRole === "customer") {
      if (currentBooking.customer_id !== tokenUserId) {
        return res.status(403).json({
          message: "Sorry: Customers Only Cancel Their Own Bookings",
        });
      }
      if (today >= new Date(currentBooking.rent_start_date)) {
        return res.status(400).json({
          message: "Sorry!!! You Cannot Cancel booking after The Booking Start Date",
        });
      }
      const result = await bookingService.updateBookingStatus(
        "cancelled",
        bookingId
      );
      await bookingService.updateAvailableStatus(
        currentBooking.vehicle_id,
        "available"
      );
      return res.status(200).json({
        message: "Booking Cancelled Successfully",
        data: result.rows[0],
      });
    }
    if (tokenRole === "admin") {
      const result = await bookingService.updateBookingStatus(
        "returned",
        bookingId
      );
      await bookingService.updateAvailableStatus(
        currentBooking.vehicle_id,
        "available"
      );
      return res.status(200).json({
        message: "Booking marked as returned",
        data: result.rows[0],
      });
    }
    return res.status(403).json({
      message: "Unauthorized action",
    });

  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

export const bookingController = {
    createBooking, getBookings,updateBooking
};