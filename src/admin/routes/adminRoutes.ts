import express, { Router } from 'express';
import BasicController from '../controllers/basicControllers';

const router: Router = express.Router();

router.get("", BasicController.loginAdmin);
router.get("/register", BasicController.createAdmin);
router.get("/forgot", BasicController.adminForgot);
router.get("/reset", BasicController.adminReset);


export default router;