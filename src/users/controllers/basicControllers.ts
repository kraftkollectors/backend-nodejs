import { Request, Response } from 'express';
import BasicService from '../services/aabasicService';
import generateUploadURL from '../../middlewares/cloudinary';


// driver login
const BasicController = {
    testServer: async (req: Request, res: Response) => {
        const data = await BasicService.testServer()
        return res.status(data.statusCode).json(data)
    },

    createUser: async (req: Request, res: Response) => {
        try {
            const sendData = req.body;
            const data = await BasicService.createUser(sendData);
            return res.status(data.statusCode).json(data);

        } catch (error: any) {
            console.log(error.message)
            return res.status(500).json({ error: error.message, status: error.statusCode, msg: "Failure" });
        }
    },

    thirdPartyCreate: async (req: Request, res: Response) => {
        try {
            const sendData = req.body;
            const data = await BasicService.thirdPartyCreate(sendData);
            return res.status(data.statusCode).json(data);

        } catch (error: any) {
            console.log(error.message)
            return res.status(500).json({ error: error.message, status: error.statusCode, msg: "Failure" });
        }
    },

    loginUser: async (req: Request, res: Response) => {
        try {
            const sendData = req.body;
            const data = await BasicService.loginUser(sendData);
            return res.status(data.statusCode).json(data);
        } catch (error: any) {
            console.log(error.message)
            return res.status(500).json({ error: error.message, status: error.statusCode, msg: "Failure" });
        }
    },

    thirdPartyLogin: async (req: Request, res: Response) => {
        try {
            const sendData = req.body;
            const data = await BasicService.thirdPartyLogin(sendData);
            return res.status(data.statusCode).json(data);
        } catch (error: any) {
            console.log(error.message)
            return res.status(500).json({ error: error.message, status: error.statusCode, msg: "Failure" });
        }
    },

    userForgot: async (req: Request, res: Response) => {
        try {
            const sendData = req.body;
            const data = await BasicService.userForgot(sendData);
            return res.status(data.statusCode).json(data);
        } catch (error: any) {
            console.log(error.message)
            return res.status(500).json({ error: error.message, status: error.statusCode, msg: "Failure" });
        }
    },

    userReset: async (req: Request, res: Response) => {
        try {
            const sendData = req.body;
            const data = await BasicService.userReset(sendData);
            return res.status(data.statusCode).json(data);
        } catch (error: any) {
            console.log(error.message)
            return res.status(500).json({ error: error.message, status: error.statusCode, msg: "Failure" });
        }
    },

    getURL: async (req: Request, res: Response) => {
        try {
            if (!req.file) {
                return res.status(400).json({ error: 'Please upload an image', status: 401, msg: 'Failure' });
            }
    
            const data:any = await generateUploadURL(req.file);
    
            if(data === null){
                return res.status(500).json({ error: 'error creating link', status: 401, msg: 'Failure'})
            }
    
            return res.status(200).json({ data: data, status: 201, msg: 'Success' });
        } catch (error: any) {
            console.log(error.message)
            return res.status(500).json({ error: error.message, status: error.statusCode, msg: "Failure" });
        }
    }
}



export default BasicController;