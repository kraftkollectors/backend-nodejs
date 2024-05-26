import { Request, Response } from 'express';
import transService from '../services/transService';


// driver login
const TransController = {

    getTransactions: async (req: Request, res: Response) => {
        try {
            const id = req.params.id;
            const data = await transService.getTransactions();
            return res.status(data.statusCode).json(data);

        } catch (error: any) {
            return res.status(500).json({ error: error.message, status: error.statusCode, msg: "Failure" });
        }
    },

    getSingleTransaction: async (req: Request, res: Response) => {
        try {
            const id = req.params.id;
            const data = await transService.getSingleTransaction(id);
            return res.status(data.statusCode).json(data);

        } catch (error: any) {
            return res.status(500).json({ error: error.message, status: error.statusCode, msg: "Failure" });
        }
    },

    getUserTransactions: async (req: Request, res: Response) => {
        try {
            const userid = req.params.userid;
            const data = await transService.getUserTransactions(userid);
            return res.status(data.statusCode).json(data);

        } catch (error: any) {
            return res.status(500).json({ error: error.message, status: error.statusCode, msg: "Failure" });
        }
    },

    deleteTransaction: async (req: Request, res: Response) => {
        try {
            const id = req.params.id;
            const data = await transService.deleteTransaction(id);
            return res.status(data.statusCode).json(data);

        } catch (error: any) {
            return res.status(500).json({ error: error.message, status: error.statusCode, msg: "Failure" });
        }
    },

    editTransaction: async (req: any, res: Response) => {
        try {
            if(req.body.admin_email != req.admin.email){
                res.status(400).json({ error: 'Authentication error', status: 400, msg: "Failure" });
            }

            const id = req.params.id;
            const sendData = req.body;
            const data = await transService.editTransaction(id, sendData);
            return res.status(data.statusCode).json(data);

        } catch (error: any) {
            return res.status(500).json({ error: error.message, status: error.statusCode, msg: "Failure" });
        }
    },

}



export default TransController;