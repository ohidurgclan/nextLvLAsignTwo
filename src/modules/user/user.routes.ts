import Router from "express";
import { userControllers } from "./user.controller";
import auth from "../../middleware/auth";

const router = Router();

router.post("/", userControllers.createUser);
router.get("/", auth("admin"), userControllers.getUser);
router.get("/:id", userControllers.getSingleUser);
router.put("/:id", userControllers.updateSingleUser);
router.delete("/:id", userControllers.deleteSingleUser);




export const userRouts = router;