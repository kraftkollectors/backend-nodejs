import express, { Router } from 'express';
import BasicController from '../controllers/basicControllers';
import DashController from '../controllers/dashControllers';
import AdsController from '../controllers/adsControllers';
import PayController from '../controllers/payControllers';
import ChatController from '../controllers/chatControllers';
import multer from 'multer'
import verifyToken from '../../middlewares/auth'

let storage = multer.memoryStorage()

let fileFilter = (req: any, file: any, cb: any) => {
    if (file.mimetype.startsWith('image/') || file.mimetype.startsWith('video/')) {
        cb(null, true);
    } else {
        cb(new Error('Invalid file type, only images and videos are allowed!'), false);
    }
};

let upload = multer({
    storage: storage,
    fileFilter: fileFilter
})

const router: Router = express.Router();

// Onboarding Routes

router.get("", BasicController.testServer);
router.post("/login", BasicController.loginUser);
router.post("/google/login", BasicController.thirdPartyLogin);
router.post("/google/signup", BasicController.thirdPartyCreate);
router.post("/register", BasicController.createUser);
router.post("/verifyemail", BasicController.verifyUserEmail);
router.post("/otpagain", BasicController.createOTP);
router.post("/forgot", BasicController.userForgot);
router.post("/reset", BasicController.userReset);

router.post("/contact", BasicController.contact);

// Upload Files to Cloud And Get UploadURL
router.post("/geturl", upload.single("file"), BasicController.getURL);
router.post("/geturls", upload.array('files', 5), BasicController.getURLS);


// Authenticated Routes
// users
router.get("/dashboard/:userid", DashController.getUser);
router.patch("/dashboard/profile/:userid", verifyToken, DashController.editUser);
router.patch("/dashboard/password/:userid", verifyToken, DashController.editUserPassword);

// views for adds
router.get("/updateviews/:serviceid", AdsController.updateViews);
router.get("/totalviews/:serviceid", AdsController.totalViews);
router.get("/getviews/:serviceid", AdsController.getViews);

// adds
router.post("/ads", verifyToken, AdsController.postAd);
router.post("/searchads", verifyToken, AdsController.postSearchAd);

router.patch("/ads/:id", verifyToken, AdsController.editAd);
router.patch("/ads/edit/:id", verifyToken, AdsController.enableDisableAd);
router.delete("/ads/:id", verifyToken, AdsController.deleteAd);
router.get("/ads", AdsController.getAllAd);
router.get("/ads/:id", AdsController.getSingleAd);
router.get("/myads/:userid", AdsController.getMyAd);
router.get("/myads/cat/getcategory", AdsController.getcategory);
router.post("/reportad", verifyToken, AdsController.createReport);
router.post("/rateads", verifyToken, AdsController.rateAd);
router.get("/rateads/:serviceid", AdsController.getrateAd);
router.get("/userreviews/:userid", AdsController.getUserReviews);
router.get("/userreviewscount/:userid", AdsController.getUserReviewsCount);
router.get("/servicereviewscount/:serviceid", AdsController.getServiceReviewsCount);

router.post("/savead", verifyToken, AdsController.saveAd);
router.get("/getsavead/:userid", AdsController.getsavedAd);
router.get("/checksavead", AdsController.checkSavedAd);
router.delete("/savead", verifyToken, AdsController.deleteSavedAd);


// become an artisan
router.post("/artisan", verifyToken, PayController.becomeArtisan);
router.get("/artisan/:userid", PayController.getAccount);
router.patch("/artisan/:userid", verifyToken, PayController.editArtisan);

router.post("/certificate", verifyToken, PayController.createCert);
router.get("/certificate/user/:userid", PayController.getUserCert);
router.get("/certificate/single/:id", PayController.getSingleCert);
router.patch("/certificate/:id", verifyToken, PayController.editCert);
router.delete("/certificate/:id", verifyToken, PayController.deleteCert);

router.post("/education", verifyToken, PayController.createEdu);
router.get("/education/user/:userid", PayController.getUserEdu);
router.get("/education/single/:id", PayController.getSingleEdu);
router.patch("/education/:id", verifyToken, PayController.editEdu);
router.delete("/education/:id", verifyToken, PayController.deleteEdu);


// payment and transaction history
router.post("/pay", verifyToken, PayController.makePayment);
router.get("/pay/:userid", PayController.getAllUserPayment);

// chats
router.get("/chatheads/:userid", verifyToken, ChatController.getAllUserChatHeads);
router.get("/chat", verifyToken, ChatController.getMessage);
router.delete("/chat/:id", verifyToken, ChatController.deleteChat);
router.get("/lastseen/:userid", verifyToken, ChatController.lastSeen);


export default router;