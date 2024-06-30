import express, { Router } from 'express';
import BasicController from '../controllers/basicControllers';
import verifyToken from '../../middlewares/auth'
import DashController from '../controllers/dashControllers';
import UsersController from '../controllers/usersControllers';
import AdsController from '../controllers/adsControllers';
import TransController from '../controllers/transControllers';
import PaidAdsController from '../controllers/paidAdsController';

const router: Router = express.Router();

// Onboarding routes
router.get("", BasicController.testServer);
router.post("/login", BasicController.loginAdmin);
router.post("/register", BasicController.createAdmin);
router.post("/forgot", BasicController.adminForgot);
router.post("/reset", BasicController.adminReset);
router.post("/otpagain", BasicController.createOTP);

router.get("/contact", BasicController.getContact);
router.get("/contact/:id", BasicController.getContactById);
router.patch("/contact/:id", verifyToken, BasicController.editContact);
router.delete("/contact/:id", BasicController.deleteContact);



// Authenticated Routes
// admin
router.get("/dashboard/:adminid", DashController.getAdmin);
router.patch("/dashboard/password/:adminid", verifyToken, DashController.editAdmin);

router.post("/dashboard/cat/category", verifyToken, DashController.addCategory);
router.post("/dashboard/cat/subcategory", verifyToken, DashController.addSubCategory);

router.get("/dashboard/cat/category", DashController.getCategories);
router.get("/dashboard/cat/category/:id", DashController.getSingleCategory);
router.patch("/dashboard/cat/category/:id", verifyToken, DashController.editCategory);
router.delete("/dashboard/cat/category/:id", verifyToken, DashController.deleteCategory);

router.get("/dashboard/cat/subcategory", DashController.getSUbCategories);
router.get("/dashboard/cat/subcategory/:id", DashController.getSingleSubCategory);
router.patch("/dashboard/cat/subcategory/:id", verifyToken, DashController.editSubCategory);
router.delete("/dashboard/cat/subcategory/:id", verifyToken, DashController.deleteSubCategory);

// users
router.get("/users", UsersController.getUsers);
router.get("/users/:id", UsersController.getSingleUser);
router.patch("/users/:id", verifyToken, UsersController.enableDisableUser);
router.delete("/users/:id", verifyToken, UsersController.deleteUser);

// paid ads
router.post("/paidads", verifyToken, PaidAdsController.postPaidAd);
router.get("/paidads", PaidAdsController.getPaidAds);
router.get("/paidads/:id", PaidAdsController.getSinglePaidAd);
router.patch("/paidads/:id", verifyToken, PaidAdsController.editPaidAd);
router.delete("/paidads/:id", verifyToken, PaidAdsController.deletePaidAd);

// ads
router.get("/ads", AdsController.getAds);
router.get("/ads/:id", AdsController.getSingleAd);
router.get("/ads/users/:userid", AdsController.getUserAds);
router.patch("/ads/:id", verifyToken, AdsController.editAd);
router.delete("/ads/:id", verifyToken, AdsController.deleteAd);

router.get("/report", AdsController.getReport);
router.delete("/report/:id", verifyToken, AdsController.deleteReport);

// transactions
router.get("/transactions", TransController.getTransactions);
router.get("/transactions/:id", TransController.getSingleTransaction);
router.get("/transactions/users/:userid", TransController.getUserTransactions);
router.patch("/transactions/:id", verifyToken, TransController.editTransaction);
router.delete("/transactions/:id", verifyToken, TransController.deleteTransaction);

export default router;