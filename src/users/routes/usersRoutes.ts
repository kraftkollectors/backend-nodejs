import express, { Router } from 'express';
import BasicController from '../controllers/basicControllers';
import DashController from '../controllers/dashControllers';
import AdsController from '../controllers/adsControllers';
import PayController from '../controllers/payControllers';
import multer from 'multer'
import verifyToken from '../../middlewares/auth'

let storage = multer.memoryStorage()
let upload = multer({storage: storage})

const router: Router = express.Router();

// Onboarding Routes

router.get("", BasicController.testServer);
router.post("/login", BasicController.loginUser);
router.post("/google/login", BasicController.thirdPartyLogin);
router.post("/google/signup", BasicController.thirdPartyCreate);
router.post("/register", BasicController.createUser);
router.post("/forgot", BasicController.userForgot);
router.post("/reset", BasicController.userReset);

// Upload Files to Cloud And Get UploadURL
router.post("/geturl", upload.single("file"), BasicController.getURL);


// Authenticated Routes
// users
router.get("/dashboard/:userid", verifyToken, DashController.getUser);
router.patch("dashboard/:userid", verifyToken, DashController.editUser);
router.patch("dashboard/password/:userid", verifyToken, DashController.editUserPassword);

// adds
router.post("/adds", verifyToken, AdsController.postAd);
router.patch("/adds/:id", verifyToken, AdsController.editAd);
router.patch("/adds/edit/:id", verifyToken, AdsController.enableDisableAd);
router.delete("/adds/:id", verifyToken, AdsController.deleteAd);
router.get("/adds", verifyToken, AdsController.getAllAd);
router.get("/adds/:id", verifyToken, AdsController.getSingleAd);
router.get("/myadds/:userid", verifyToken, AdsController.getMyAd);


// become an artisan
router.patch("/artisan/:userid", verifyToken, PayController.becomeArtisan);
// payment and transaction history
router.post("/pay/:userid", verifyToken, PayController.makePayment);
router.get("/pay/:userid", verifyToken, PayController.getAllPayment);


export default router;