import { Request, Response } from "express";
import { userServices } from "./user.service";

const createUser =  async(req:Request, res:Response)=>{
  try {
      const result = await userServices.createUser(req.body);
      res.status(201).json({
          success: true,
          message: "Data Inserted Successfully",
          data: result.rows[0],
      });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message:error.message,
    });
  }
};
const getUser = async(req: Request , res: Response)=>{
  try {
    const result = await userServices.getUser();
    res.status(200).json({
      success: true,
      message:  "Users Retrieved Successfully",
      data: result.rows,
    });
  } catch (error: any) {
      res.status(500).json({
        success: false,
        message: error.message,
        details: error,
      })
    }
}

const getSingleUser = async(req: Request, res: Response)=> {
  console.log(req.params.id)
  try {
    const result = await userServices.getSingleUser(req.params.id as string);
    if(result.rows.length === 0){
      res.status(404).json({
        success: false,
        message: "User Not Found",
      });
    }else{
      res.status(200).json({
        success: true,
        message:  "Users Retrieved Successfully",
        data: result.rows[0],
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

const updateSingleUser = async(req: Request, res: Response)=> {
const { name, email } = req.body;
  try {
    const result = await userServices.updateSingleUser(name, email, req.params.id as string);
    if(result.rows.length === 0){
      res.status(404).json({
        success: false,
        message: "User Not Found",
      });
    }else{
      res.status(200).json({
        success: true,
        message:  "Users Updated Successfully",
        data: result.rows[0],
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

const deleteSingleUser = async(req: Request, res: Response)=> {
  // console.log(req.params.id)
  try {
    const result = await userServices.delSingleUser(req.params.id as string);
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
export const userControllers  = { createUser, getUser, getSingleUser, updateSingleUser, deleteSingleUser };