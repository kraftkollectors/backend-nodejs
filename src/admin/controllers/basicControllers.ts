import { Request, Response } from 'express';
import BasicService from '../services/basicService';


// driver login
const BasicController = {
    testServer: async (req: Request, res: Response) => {
        const query = req.query
        const data = await BasicService.testServer(query)
        return res.status(data.statusCode).json(data)
    },
    
    createAdmin: async (req: Request, res: Response) => {
        try {
            const sendData = req.body;
            const data = await BasicService.createAdmin(sendData);
            res.status(data.statusCode).json(data);

        } catch (error: any) {
            console.log(error.message)
            res.status(500).json({ data: error.message, statusCode: 400, msg: "Failure" });
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

    loginAdmin: async (req: Request, res: Response) => {
        try {
            const sendData = req.body;
            const data = await BasicService.loginAdmin(sendData);
            res.status(data.statusCode).json(data);
        } catch (error: any) {
            console.log(error.message)
            res.status(500).json({ data: error.message, statusCode: 400, msg: "Failure" });
        }
    },

    adminForgot: async (req: Request, res: Response) => {
        try {
            const sendData = req.body;
            const data = await BasicService.adminForgot(sendData);
            res.status(data.statusCode).json(data);
        } catch (error: any) {
            console.log(error.message)
            res.status(500).json({ data: error.message, statusCode: 400, msg: "Failure" });
        }
    },

    adminReset: async (req: Request, res: Response) => {
        try {
            const sendData = req.body;
            const data = await BasicService.adminReset(sendData);
            res.status(data.statusCode).json(data);
        } catch (error: any) {
            console.log(error.message)
            res.status(500).json({ data: error.message, statusCode: 400, msg: "Failure" });
        }
    },

    getContact: async (req: Request, res: Response) => {
        try {
            const query = req.query
            const data = await BasicService.getContact(query);
            res.status(data.statusCode).json(data);
        } catch (error: any) {
            console.log(error.message)
            res.status(500).json({ data: error.message, statusCode: 400, msg: "Failure" });
        }
    },

    getContactById: async (req: Request, res: Response) => {
        try {
            const id = req.params.id
            const data = await BasicService.getContactById(id);
            res.status(data.statusCode).json(data);
        } catch (error: any) {
            console.log(error.message)
            res.status(500).json({ data: error.message, statusCode: 400, msg: "Failure" });
        }
    },

    editContact: async (req: Request, res: Response) => {
        try {
            const id = req.params.id
            const body = req.body
            const data = await BasicService.editContact(id, body);
            res.status(data.statusCode).json(data);
        } catch (error: any) {
            console.log(error.message)
            res.status(500).json({ data: error.message, statusCode: 400, msg: "Failure" });
        }
    },

    deleteContact: async (req: Request, res: Response) => {
        try {
            const id = req.params.id;
            const data = await BasicService.deleteContact(id);
            res.status(data.statusCode).json(data);
        } catch (error: any) {
            console.log(error.message)
            res.status(500).json({ data: error.message, statusCode: 400, msg: "Failure" });
        }
    },
}



export default BasicController;