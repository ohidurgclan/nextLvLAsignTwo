import { Request, Response } from "express";
import { authServices } from "./auth.service";

export const signupUser = async (req: Request, res: Response) => {
  try {
    const result = await authServices.signupCustomer(req.body);
    return res.status(201).json({
      message: "User Registered Successfully As Customer",
      data: result.rows[0],
    });
  } catch (error: any) {
    return res.status(500).json({
      message: error.message,
    });
  }
};



const loginUser = async(req:Request, res: Response) => {
    const {email, password} = req.body;
    try {
        const result = await authServices.loginUser(email,password);
        res.status(200).json({
            success: true,
            message: "Login Successful",
            data: result,
        });
    } catch (error: any) {
        res.status(500).json({
            success: false,
            message:error.message,
        });
    }
};
export const authController = {
    loginUser, signupUser
};