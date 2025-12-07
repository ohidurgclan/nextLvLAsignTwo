import Router from "express";
import { userControllers } from "./user.controller";
import auth from "../../middleware/auth";

const router = Router();

router.get("/users", auth("admin"), userControllers.getUser);
router.put("/users/:userId", auth("admin", "customer"), userControllers.updateUser);
router.delete("/users/:userId", auth("admin"), userControllers.deleteSingleUser);


export const userRouts = router;