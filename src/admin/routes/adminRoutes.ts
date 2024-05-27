import express, { Router } from 'express';
import BasicController from '../controllers/basicControllers';
import verifyToken from '../../middlewares/auth'
import DashController from '../controllers/dashControllers';
import UsersController from '../controllers/usersControllers';
import AdsController from '../controllers/adsControllers';
import TransController from '../controllers/transControllers';

const router: Router = express.Router();

// Onboarding routes
router.get("", BasicController.testServer);
router.get("/login", BasicController.loginAdmin);
router.get("/register", BasicController.createAdmin);
router.get("/forgot", BasicController.adminForgot);
router.get("/reset", BasicController.adminReset);
router.post("/otpagain", BasicController.createOTP);



// Authenticated Routes
// admin
router.get("dashboard/:adminid", verifyToken, DashController.getAdmin);
router.patch("dashboard/password/:adminid", verifyToken, DashController.editAdmin);

// users
router.get("users", verifyToken, UsersController.getUsers);
router.get("users/:id", verifyToken, UsersController.getSingleUser);
router.patch("users/:id", verifyToken, UsersController.enableDisableUser);
router.delete("users/:id", verifyToken, UsersController.deleteUser);

// ads
router.get("ads", verifyToken, AdsController.getAds);
router.get("ads/:id", verifyToken, AdsController.getSingleAd);
router.get("ads/users/:userid", verifyToken, AdsController.getUserAds);
router.patch("ads/:id", verifyToken, AdsController.editAd);
router.delete("ads/:id", verifyToken, AdsController.deleteAd);

// transactions
router.get("transactions", verifyToken, TransController.getTransactions);
router.get("transactions/:id", verifyToken, TransController.getSingleTransaction);
router.get("transactions/users/:userid", verifyToken, TransController.getUserTransactions);
router.patch("transactions/:id", verifyToken, TransController.editTransaction);
router.delete("transactions/:id", verifyToken, TransController.deleteTransaction);

export default router;