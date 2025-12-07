import { pool } from "../../config/db";

const addBooking = async (payload: Record<string, unknown>) => {
  const { customer_id, vehicle_id, rent_start_date, rent_end_date, total_price, status } = payload;
  const result = await pool.query(
    `INSERT INTO bookings(customer_id, vehicle_id, rent_start_date, rent_end_date, total_price, status)
     VALUES ($1, $2, $3, $4, $5, $6)
     RETURNING *`,
    [customer_id, vehicle_id, rent_start_date, rent_end_date, total_price, status]
  );
  return result;
};

const checkVehicle = async (vehicleId: number) => {
  return await pool.query(
    `SELECT * FROM vehicles WHERE id=$1`,
    [vehicleId]
  );
};

const getAllBookings = async () => {
  return await pool.query(`SELECT * FROM bookings ORDER BY id ASC`);
};

const getCustomerBooking = async (id: number) => {
  return await pool.query(
    `SELECT * FROM bookings WHERE customer_id=$1 ORDER BY id ASC`,
    [id]
  );
};

const updateAvailableStatus = async (vehicleId: number, status: string) => {
  return await pool.query(
    `UPDATE vehicles SET availability_status=$1 WHERE id=$2`,
    [status, vehicleId]
  );
};

const getBookingById = async (id: number) => {
  return await pool.query(`SELECT * FROM bookings WHERE id = $1`, [id]);
};

const updateBookingStatus = async (status: string, bookingId: number) => {
  return await pool.query(
    `UPDATE bookings SET status = $1 WHERE id = $2 RETURNING *`,
    [status, bookingId]
  );
};

export const bookingService = {
    addBooking,
    checkVehicle,
    updateAvailableStatus,
    getAllBookings, 
    getCustomerBooking,
    getBookingById,
    updateBookingStatus
};