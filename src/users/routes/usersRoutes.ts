import express, { Router } from 'express';
import BasicController from '../controllers/basicControllers';
import multer from 'multer'

let storage = multer.memoryStorage()
let upload = multer({storage: storage})

const router: Router = express.Router();

router.get("", BasicController.testServer);
router.post("login", BasicController.loginUser);
router.post("/google/login", BasicController.thirdPartyLogin);
router.post("/google/signup", BasicController.thirdPartyCreate);
router.post("/register", BasicController.createUser);
router.post("/forgot", BasicController.userForgot);
router.post("/reset", BasicController.userReset);


router.post("/geturl", upload.single("file"), BasicController.getURL);


export default router;