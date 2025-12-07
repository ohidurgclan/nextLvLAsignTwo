import { Request, Response } from "express";
import { userServices } from "./user.service";
import { JwtPayload } from "jsonwebtoken";

const getUser = async(req: Request , res: Response)=>{
  try {
    const result = await userServices.getUser();
    res.status(200).json({
      success: true,
      message:  "All Users Successfully Found",
      data: result.rows,
    });
  } catch (error: any) {
      res.status(500).json({
        success: false,
        message: error.message,
        details: error,
      })
    }
};

const updateUser = async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;
    const targetId = Number(userId);
    if (!req.user) {
      return res.status(401).json({
        message: "Unauthorized: JWT token missing or invalid",
      });
    }
    const decoded = req.user as JwtPayload & { id: number; role: string };
    const tokenUserId = decoded.id;
    const tokenRole = decoded.role;
    if (tokenRole === "customer") {
      if (tokenUserId !== targetId) {
        return res.status(403).json({
          message: "Customers can only update their own profile",
        });
      }
      if (req.body.role) {
        return res.status(403).json({
          message: "Unauthorized Request!!! Customers cannot change their role",
        });
      }
    }
    const result = await userServices.updateUser(req.body, targetId, tokenRole);
    if (result.rowCount === 0) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json({
      message: "User updated successfully",
      data: result.rows[0],
    });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

const deleteSingleUser = async(req: Request, res: Response)=> {
  try {
    const result = await userServices.delSingleUser(req.params.userId as string);
    if(result.rowCount === 0){
      res.status(404).json({
        success: false,
        message: "User Not Found",
      });
    }else{
      res.status(200).json({
        success: true,
        message:  "Users Deleted Successfully",
        data: result.rows,
      });
    }
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message,
      details: error,
    })
  }
};
export const userControllers  = { getUser, updateUser, deleteSingleUser };