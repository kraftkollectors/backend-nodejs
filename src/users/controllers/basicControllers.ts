import { Request, Response } from 'express';
import BasicService from '../services/basicService';
import { generateUploadURL, generateUploadURLs } from '../../middlewares/cloudinary';


// driver login
const BasicController = {
    testServer: async (req: Request, res: Response) => {
        const query = req.query
        const data = await BasicService.testServer(query)
        return res.status(data.statusCode).json(data)
    },

    createUser: async (req: Request, res: Response) => {
        try {
            const sendData = req.body;
            const data = await BasicService.createUser(sendData);
            return res.status(data.statusCode).json(data);

        } catch (error: any) {
            console.log(error.message)
            return res.status(500).json({ data: error.message, statusCode: 400, msg: "Failure" });
        }
    },

    verifyUserEmail: async (req: Request, res: Response) => {
        try {
            const sendData = req.body;
            const data = await BasicService.verifyUserEmail(sendData);
            return res.status(data.statusCode).json(data);

        } catch (error: any) {
            console.log(error.message)
            return res.status(500).json({ data: error.message, statusCode: 400, msg: "Failure" });
        }
    },

    createOTP: async (req: Request, res: Response) => {
        try {
            const sendData = req.body;
            const data = await BasicService.createOTP(sendData);
            return res.status(data.statusCode).json(data);

        } catch (error: any) {
            console.log(error.message)
            return res.status(500).json({ data: error.message, statusCode: 400, msg: "Failure" });
        }
    },

    thirdPartyCreate: async (req: Request, res: Response) => {
        try {
            const sendData = req.body;
            const data = await BasicService.thirdPartyCreate(sendData);
            return res.status(data.statusCode).json(data);

        } catch (error: any) {
            console.log(error.message)
            return res.status(500).json({ data: error.message, statusCode: 400, msg: "Failure" });
        }
    },

    loginUser: async (req: Request, res: Response) => {
        try {
            const sendData = req.body;
            const data = await BasicService.loginUser(sendData);
            return res.status(data.statusCode).json(data);
        } catch (error: any) {
            console.log(error.message)
            return res.status(500).json({ data: error.message, statusCode: 400, msg: "Failure" });
        }
    },

    thirdPartyLogin: async (req: Request, res: Response) => {
        try {
            const sendData = req.body;
            const data = await BasicService.thirdPartyLogin(sendData);
            return res.status(data.statusCode).json(data);
        } catch (error: any) {
            console.log(error.message)
            return res.status(500).json({ data: error.message, statusCode: 400, msg: "Failure" });
        }
    },

    userForgot: async (req: Request, res: Response) => {
        try {
            const sendData = req.body;
            const data = await BasicService.userForgot(sendData);
            return res.status(data.statusCode).json(data);
        } catch (error: any) {
            console.log(error.message)
            return res.status(500).json({ data: error.message, statusCode: 400, msg: "Failure" });
        }
    },

    userReset: async (req: Request, res: Response) => {
        try {
            const sendData = req.body;
            const data = await BasicService.userReset(sendData);
            return res.status(data.statusCode).json(data);
        } catch (error: any) {
            console.log(error.message)
            return res.status(500).json({ data: error.message, statusCode: 400, msg: "Failure" });
        }
    },

    contact: async (req: Request, res: Response) => {
        try {
            const sendData = req.body;
            const data = await BasicService.contact(sendData);
            return res.status(data.statusCode).json(data);
        } catch (error: any) {
            console.log(error.message)
            return res.status(500).json({ data: error.message, statusCode: 400, msg: "Failure" });
        }
    },

    getURL: async (req: Request, res: Response) => {
        try {
            if (!req.file) {
                return res.status(400).json({ error: 'Please upload an image', statusCode: 401, msg: 'Failure' });
            }
    
            const data:any = await generateUploadURL(req.file);
    
            if(data === null){
                return res.status(500).json({ error: 'error creating link', statusCode: 401, msg: 'Failure'})
            }
    
            return res.status(200).json({ data: data, statusCode: 201, msg: 'Success' });
        } catch (error: any) {
            console.log(error.message)
            return res.status(500).json({ data: error.message, statusCode: 400, msg: "Failure" });
        }
    },

    getURLS: async (req: Request, res: Response) => {
        try {
            if (!req.files || !Array.isArray(req.files)) {
                return res.status(400).json({ error: 'Please portfolio files', statusCode: 401, msg: 'Failure' });
            }
    
            const data: any = await generateUploadURLs(req.files);

            console.log(data);
            
    
            if(!data){
                return res.status(500).json({ error: 'error creating links', statusCode: 401, msg: 'Failure'})
            }
    
            return res.status(200).json({ data: data, statusCode: 201, msg: 'Success' });
        } catch (error: any) {
            console.log(error.message)
            return res.status(500).json({ data: error.message, statusCode: 400, msg: "Failure" });
        }
    }
}



export default BasicController;