import { Request, Response } from 'express';
import transService from '../services/transService';


// driver login
const TransController = {

    getTransactions: async (req: any, res: Response) => {
        try {
            const id = req.params.id;
            const query = req.query
            const data = await transService.getTransactions(query);
            return res.status(data.statusCode).json(data);

        } catch (error: any) {
            console.log(error.message)
            return res.status(500).json({ data: error.message, statusCode: 400, msg: "Failure" });
        }
    },

    getSingleTransaction: async (req: Request, res: Response) => {
        try {
            const id = req.params.id;
            const data = await transService.getSingleTransaction(id);
            return res.status(data.statusCode).json(data);

        } catch (error: any) {
            console.log(error.message)
            return res.status(500).json({ data: error.message, statusCode: 400, msg: "Failure" });
        }
    },

    getUserTransactions: async (req: any, res: Response) => {
        try {
            const userid = req.params.userid;
            const query = req.query
            const data = await transService.getUserTransactions(query, userid);
            return res.status(data.statusCode).json(data);

        } catch (error: any) {
            console.log(error.message)
            return res.status(500).json({ data: error.message, statusCode: 400, msg: "Failure" });
        }
    },

    deleteTransaction: async (req: Request, res: Response) => {
        try {
            const id = req.params.id;
            const data = await transService.deleteTransaction(id);
            return res.status(data.statusCode).json(data);

        } catch (error: any) {
            console.log(error.message)
            return res.status(500).json({ data: error.message, statusCode: 400, msg: "Failure" });
        }
    },

    editTransaction: async (req: any, res: Response) => {
        try {
            if(req.body.adminEmail != req.admin.email){
                return res.status(400).json({ data: 'Authentication error', statusCode: 400, msg: "Failure" });
            }

            const id = req.params.id;
            const sendData = req.body;
            const data = await transService.editTransaction(id, sendData);
            return res.status(data.statusCode).json(data);

        } catch (error: any) {
            console.log(error.message)
            return res.status(500).json({ data: error.message, statusCode: 400, msg: "Failure" });
        }
    },

}



export default TransController;