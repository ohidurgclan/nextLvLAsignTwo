import { pool } from "../../config/db";

const addNewVehicle = async(payload: Record<string, unknown>)=>{
    const {vehicle_name, type, registration_number, daily_rent_price, availability_status} = payload;
    const result = await pool.query(`INSERT INTO vehicles(vehicle_name, type, registration_number, daily_rent_price, availability_status) VALUES($1,$2,$3,$4,$5) RETURNING *`, [vehicle_name, type, registration_number, daily_rent_price, availability_status]);
    return result;
};

const getAllVehicles = async () => {
    const result = await pool.query(`SELECT * FROM vehicles`);
    return result;
};

const getVehicleById = async (id: Number) => {
    const result = await pool.query(
        `SELECT * FROM vehicles WHERE id = $1`,
        [id]
    );
    return result;
};

const updateVehicle = async (payload: Record<string, unknown>, id: number) => {
    const { vehicle_name, type, daily_rent_price, availability_status } = payload;
    const result = await pool.query(
        `UPDATE vehicles 
         SET vehicle_name=$1, type=$2, daily_rent_price=$3, availability_status=$4
         WHERE id=$5
         RETURNING *`,
        [vehicle_name, type, daily_rent_price, availability_status, id]
    );
    return result;
};

const checkActive = async (vehicleId: number) => {
    const result = await pool.query(
        `SELECT * FROM bookings WHERE vehicle_id = $1 AND status = 'active'`,
        [vehicleId]
    );
    return result;
};

const deleteVehicle = async (vehicleId: number) => {
    const result = await pool.query(
        `DELETE FROM vehicles WHERE id = $1 RETURNING *`,
        [vehicleId]
    );
    return result;
};

export const vehicleService = {
    addNewVehicle,getAllVehicles, getVehicleById, updateVehicle,deleteVehicle, checkActive
};