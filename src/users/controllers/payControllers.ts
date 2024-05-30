import { Request, Response } from 'express';
import PayService from '../services/payService';


// driver login
const PayController = {

    getAllUserPayment: async (req: any, res: Response) => {
        try {
            const userid = req.params.userid;
            const query = req.query
            const data = await PayService.getAllUserPayment(query, userid);
            return res.status(data.statusCode).json(data);

        } catch (error: any) {
            console.log(error.message)
            return res.status(500).json({ data: error.message, status: error.statusCode, msg: "Failure" });
        }
    },

    getSingleCert: async (req: any, res: Response) => {
        try {
            const id = req.params.id;
            const data = await PayService.getSingleCert(id);
            return res.status(data.statusCode).json(data);

        } catch (error: any) {
            console.log(error.message)
            return res.status(500).json({ data: error.message, status: error.statusCode, msg: "Failure" });
        }
    },

    getSingleEdu: async (req: any, res: Response) => {
        try {
            const id = req.params.id;
            const data = await PayService.getSingleEdu(id);
            return res.status(data.statusCode).json(data);

        } catch (error: any) {
            console.log(error.message)
            return res.status(500).json({ data: error.message, status: error.statusCode, msg: "Failure" });
        }
    },

    getUserCert: async (req: any, res: Response) => {
        try {
            const userid = req.params.userid;
            const query = req.query
            const data = await PayService.getUserCert(query, userid);
            return res.status(data.statusCode).json(data);

        } catch (error: any) {
            console.log(error.message)
            return res.status(500).json({ data: error.message, status: error.statusCode, msg: "Failure" });
        }
    },

    getUserEdu: async (req: any, res: Response) => {
        try {
            const userid = req.params.userid;
            const query = req.query
            const data = await PayService.getUserEdu(query, userid);
            return res.status(data.statusCode).json(data);

        } catch (error: any) {
            console.log(error.message)
            return res.status(500).json({ data: error.message, status: error.statusCode, msg: "Failure" });
        }
    },

    getAccount: async (req: any, res: Response) => {
        try {
            const userid = req.params.userid;
            const data = await PayService.getAccount(userid);
            return res.status(data.statusCode).json(data);

        } catch (error: any) {
            console.log(error.message)
            return res.status(500).json({ data: error.message, status: error.statusCode, msg: "Failure" });
        }
    },

    createCert: async (req: any, res: Response) => {
        try {
            if(req.body.userEmail != req.user.email){
                res.status(400).json({ data: 'Authentication error', status: 400, msg: "Failure" });
            }

            const sendData = req.body;
            const data = await PayService.createCert(sendData);
            return res.status(data.statusCode).json(data);

        } catch (error: any) {
            console.log(error.message)
            return res.status(500).json({ data: error.message, status: error.statusCode, msg: "Failure" });
        }
    },

    createEdu: async (req: any, res: Response) => {
        try {
            if(req.body.userEmail != req.user.email){
                res.status(400).json({ data: 'Authentication error', status: 400, msg: "Failure" });
            }

            const sendData = req.body;
            const data = await PayService.createEdu(sendData);
            return res.status(data.statusCode).json(data);

        } catch (error: any) {
            console.log(error.message)
            return res.status(500).json({ data: error.message, status: error.statusCode, msg: "Failure" });
        }
    },

    becomeArtisan: async (req: any, res: Response) => {
        try {
            if(req.body.userEmail != req.user.email){
                res.status(400).json({ data: 'Authentication error', status: 400, msg: "Failure" });
            }

            const sendData = req.body;
            const data = await PayService.becomeArtisan(sendData);
            return res.status(data.statusCode).json(data);

        } catch (error: any) {
            console.log(error.message)
            return res.status(500).json({ data: error.message, status: error.statusCode, msg: "Failure" });
        }
    },

    makePayment: async (req: any, res: Response) => {
        try {
            if(req.body.userEmail != req.user.email){
                res.status(400).json({ data: 'Authentication error', status: 400, msg: "Failure" });
            }

            const sendData = req.body;
            const data = await PayService.makePayment(sendData);
            return res.status(data.statusCode).json(data);

        } catch (error: any) {
            console.log(error.message)
            return res.status(500).json({ data: error.message, status: error.statusCode, msg: "Failure" });
        }
    },

    editCert: async (req: any, res: Response) => {
        try {
            if(req.body.userEmail != req.user.email){
                res.status(400).json({ data: 'Authentication error', status: 400, msg: "Failure" });
            }

            const id = req.params.id;
            const sendData = req.body;
            const data = await PayService.editCert(id, sendData);
            return res.status(data.statusCode).json(data);

        } catch (error: any) {
            console.log(error.message)
            return res.status(500).json({ data: error.message, status: error.statusCode, msg: "Failure" });
        }
    },

    editEdu: async (req: any, res: Response) => {
        try {
            if(req.body.userEmail != req.user.email){
                res.status(400).json({ data: 'Authentication error', status: 400, msg: "Failure" });
            }

            const id = req.params.id;
            const sendData = req.body;
            const data = await PayService.editEdu(id, sendData);
            return res.status(data.statusCode).json(data);

        } catch (error: any) {
            console.log(error.message)
            return res.status(500).json({ data: error.message, status: error.statusCode, msg: "Failure" });
        }
    },

    deleteEdu: async (req: any, res: Response) => {
        try {
            if(req.body.userEmail != req.user.email){
                res.status(400).json({ data: 'Authentication error', status: 400, msg: "Failure" });
            }

            const id = req.params.id;
            const data = await PayService.deleteEdu(id);
            return res.status(data.statusCode).json(data);

        } catch (error: any) {
            console.log(error.message)
            return res.status(500).json({ data: error.message, status: error.statusCode, msg: "Failure" });
        }
    },

    deleteCert: async (req: any, res: Response) => {
        try {
            if(req.body.userEmail != req.user.email){
                res.status(400).json({ data: 'Authentication error', status: 400, msg: "Failure" });
            }

            const id = req.params.id;
            const data = await PayService.deleteCert(id);
            return res.status(data.statusCode).json(data);

        } catch (error: any) {
            console.log(error.message)
            return res.status(500).json({ data: error.message, status: error.statusCode, msg: "Failure" });
        }
    },
}



export default PayController;