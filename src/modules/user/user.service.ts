import { pool } from "../../config/db";
import bcrypt from "bcryptjs";

const getUser = async ()=>{
    const result = await pool.query(`SELECT * FROM users`);
    return result;
};

const getSingleUser = async(id:string) =>{
    const result = await pool.query(`SELECT * FROM users WHERE id = $1`, [id]);
    return result;
};

const updateUser = async (
  payload: Record<string, unknown>,
  userId: number,
  tokenRole: string
) => {
  const { name, email, phone, role } = payload;

  if (tokenRole === "admin") {
    const result = await pool.query(
      `UPDATE users 
       SET name=$1, email=$2, phone=$3, role=$4
       WHERE id=$5
       RETURNING *`,
      [name, email, phone, role, userId]
    );
    return result;
  } else {
    const result = await pool.query(
      `UPDATE users 
       SET name=$1, email=$2, phone=$3
       WHERE id=$4
       RETURNING *`,
      [name, email, phone, userId]
    );
    return result;
  }
};
const delSingleUser = async(id: string) => {
    const result = await pool.query(`DELETE FROM users WHERE id = $1`, [id]);
    return result
}

export const userServices = {
    getUser, getSingleUser, updateUser, delSingleUser
};
