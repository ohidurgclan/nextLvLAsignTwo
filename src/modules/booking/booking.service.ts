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
  return await pool.query(`
    SELECT 
      b.id,
      b.customer_id,
      b.vehicle_id,
      b.rent_start_date,
      b.rent_end_date,
      b.total_price,
      b.status,

      json_build_object(
        'name', u.name,
        'email', u.email
      ) AS customer,

      json_build_object(
        'vehicle_name', v.vehicle_name,
        'registration_number', v.registration_number
      ) AS vehicle

    FROM bookings b
    JOIN users u
      ON b.customer_id = u.id
    JOIN vehicles v
      ON b.vehicle_id = v.id

    ORDER BY b.id ASC
  `);
};

const getCustomerBooking = async (id: number) => {
  return await pool.query(`
    SELECT 
      b.id,
      b.vehicle_id,
      b.rent_start_date,
      b.rent_end_date,
      b.total_price,
      b.status,

      json_build_object(
        'vehicle_name', v.vehicle_name,
        'registration_number', v.registration_number,
        'type', v.type
      ) AS vehicle

    FROM bookings b
    JOIN vehicles v
      ON b.vehicle_id = v.id

    WHERE b.customer_id = $1

    ORDER BY b.id ASC
    `,
    [id]
  );
};

const getBookingById = async (id: number) => {
  return await pool.query(
    `SELECT * FROM bookings WHERE id = $1`,
    [id]
  );
};
const updateBookingStatus = async (
  status: string,
  bookingId: number
) => {
  return await pool.query(
    `
    UPDATE bookings
    SET status = $1
    WHERE id = $2
    RETURNING *
    `,
    [status, bookingId]
  );
};
const updateVehicleAvailability = async (
  vehicleId: number,
  status: string
) => {
  return await pool.query(`
    UPDATE vehicles
    SET availability_status = $1
    WHERE id = $2
    `,
    [status, vehicleId]
  );
};

export const bookingService = {
    addBooking,
    checkVehicle,
    getAllBookings, 
    getCustomerBooking,
    getBookingById,
    updateBookingStatus,
    updateVehicleAvailability
};