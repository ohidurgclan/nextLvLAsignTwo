import { Request, Response } from "express";
import { pool } from "../../config/db";


export const autoReturnBookings = async (req: Request, res: Response) => {
    try {
        await pool.query(`
        UPDATE vehicles
        SET availability_status = 'available'
        WHERE id IN (
            SELECT vehicle_id
            FROM bookings
            WHERE rent_end_date < CURRENT_DATE
            AND status = 'active'
        )
        `);
        await pool.query(`
        UPDATE bookings
        SET status = 'returned'
        WHERE rent_end_date < CURRENT_DATE
        AND status = 'active'
        `);
    return res.status(200).json({
        success: true,
        message: "Expired bookings updated successfully"
    });
    } catch (error: any) {
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};