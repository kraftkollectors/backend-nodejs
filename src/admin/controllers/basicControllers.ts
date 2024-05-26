import { Request, Response } from 'express';
import BasicService from '../services/basicService';


// driver login
const BasicController = {
    createAdmin: async (req: Request, res: Response) => {
        try {
            const sendData = req.body;
            const data = await BasicService.createAdmin(sendData);
            res.status(data.statusCode).json(data);

        } catch (error: any) {
            res.status(500).json({ error: error.message, status: error.statusCode, msg: "Failure" });
        }
    },

    loginAdmin: async (req: Request, res: Response) => {
        try {
            const sendData = req.body;
            const data = await BasicService.loginAdmin(sendData);
            res.status(data.statusCode).json(data);
        } catch (error: any) {
            res.status(500).json({ error: error.message, status: error.statusCode, msg: "Failure" });
        }
    },

    adminForgot: async (req: Request, res: Response) => {
        try {
            const sendData = req.body;
            const data = await BasicService.adminForgot(sendData);
            res.status(data.statusCode).json(data);
        } catch (error: any) {
            res.status(500).json({ error: error.message, status: error.statusCode, msg: "Failure" });
        }
    },

    adminReset: async (req: Request, res: Response) => {
        try {
            const sendData = req.body;
            const data = await BasicService.adminReset(sendData);
            res.status(data.statusCode).json(data);
        } catch (error: any) {
            res.status(500).json({ error: error.message, status: error.statusCode, msg: "Failure" });
        }
    }
}



export default BasicController;