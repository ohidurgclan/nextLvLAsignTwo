import { pool } from "../../config/db";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import config from "../../config";

export const signupCustomer = async (payload: Record<string, unknown>) => {
  const { name, email, password, phone } = payload;
  const hashedPassword = await bcrypt.hash(password as string, Number(config.slt_round));
  const result = await pool.query(
    `INSERT INTO users (name, email, password, phone)
     VALUES ($1, LOWER($2), $3, $4)
     RETURNING *`,
    [name, email, hashedPassword, phone]
  );
  return result;
};

const loginUser = async(email: string, password: string) =>{
    const result = await pool.query(`SELECT * FROM users WHERE email = $1`, [email]);
    if(result.rows.length === 0){
        return null
    }
    const user = result.rows[0];
    const match = await bcrypt.compare(password, user.password);
    if(!match){
        return false;
    }
    const token = jwt.sign({ id: user.id ,name: user.name, email: user.email, role: user.role },config.jwtSecret as string, {expiresIn:"20d"},);
    console.log({token});
    return {token, user};
};
export const authServices = {
    loginUser, signupCustomer,
};