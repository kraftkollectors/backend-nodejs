import { Request, Response } from 'express';
import PayService from '../services/payService';
import { checkIfArtisan } from '../../middlewares/checkArtisan';


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
            return res.status(500).json({ data: error.message, statusCode: 404, msg: "Failure" });
        }
    },

    getSingleCert: async (req: any, res: Response) => {
        try {
            const id = req.params.id;
            const data = await PayService.getSingleCert(id);
            return res.status(data.statusCode).json(data);

        } catch (error: any) {
            console.log(error.message)
            return res.status(500).json({ data: error.message, statusCode: 404, msg: "Failure" });
        }
    },

    getSingleEdu: async (req: any, res: Response) => {
        try {
            const id = req.params.id;
            const data = await PayService.getSingleEdu(id);
            return res.status(data.statusCode).json(data);

        } catch (error: any) {
            console.log(error.message)
            return res.status(500).json({ data: error.message, statusCode: 404, msg: "Failure" });
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
            return res.status(500).json({ data: error.message, statusCode: 404, msg: "Failure" });
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
            return res.status(500).json({ data: error.message, statusCode: 404, msg: "Failure" });
        }
    },

    getAccount: async (req: any, res: Response) => {
        try {
            const userid = req.params.userid;
            const data = await PayService.getAccount(userid);
            return res.status(data.statusCode).json(data);

        } catch (error: any) {
            console.log(error.message)
            return res.status(500).json({ data: error.message, statusCode: 404, msg: "Failure" });
        }
    },

    createCert: async (req: any, res: Response) => {
        try {
            if(req.body.userEmail != req.user.email){
                res.status(400).json({ data: 'Authentication error', statusCode: 400, msg: "Failure" });
            }

            if(!checkIfArtisan(req.body.userEmail)){
                res.status(400).json({ data: 'Not an artisan', statusCode: 400, msg: "Failure" });
            }

            const sendData = req.body;
            const data = await PayService.createCert(sendData);
            return res.status(data.statusCode).json(data);

        } catch (error: any) {
            console.log(error.message)
            return res.status(500).json({ data: error.message, statusCode: 404, msg: "Failure" });
        }
    },

    createEdu: async (req: any, res: Response) => {
        try {
            if(req.body.userEmail != req.user.email){
                res.status(400).json({ data: 'Authentication error', statusCode: 400, msg: "Failure" });
            }

            if(!checkIfArtisan(req.body.userEmail)){
                res.status(400).json({ data: 'Not an artisan', statusCode: 400, msg: "Failure" });
            }

            const sendData = req.body;
            const data = await PayService.createEdu(sendData);
            return res.status(data.statusCode).json(data);

        } catch (error: any) {
            console.log(error.message)
            return res.status(500).json({ data: error.message, statusCode: 404, msg: "Failure" });
        }
    },

    becomeArtisan: async (req: any, res: Response) => {
        try {
            if(req.body.userEmail != req.user.email){
                res.status(400).json({ data: 'Authentication error', statusCode: 400, msg: "Failure" });
            }

            const sendData = req.body;
            const data = await PayService.becomeArtisan(sendData);
            return res.status(data.statusCode).json(data);

        } catch (error: any) {
            console.log(error.message)
            return res.status(500).json({ data: error.message, statusCode: 404, msg: "Failure" });
        }
    },

    makePayment: async (req: any, res: Response) => {
        try {
            if(req.body.userEmail != req.user.email){
                res.status(400).json({ data: 'Authentication error', statusCode: 400, msg: "Failure" });
            }

            const sendData = req.body;
            const data = await PayService.makePayment(sendData);
            return res.status(data.statusCode).json(data);

        } catch (error: any) {
            console.log(error.message)
            return res.status(500).json({ data: error.message, statusCode: 404, msg: "Failure" });
        }
    },

    editCert: async (req: any, res: Response) => {
        try {
            if(req.body.userEmail != req.user.email){
                res.status(400).json({ data: 'Authentication error', statusCode: 400, msg: "Failure" });
            }

            if(!checkIfArtisan(req.body.userEmail)){
                res.status(400).json({ data: 'Not an artisan', statusCode: 400, msg: "Failure" });
            }

            const id = req.params.id;
            const sendData = req.body;
            const data = await PayService.editCert(id, sendData);
            return res.status(data.statusCode).json(data);

        } catch (error: any) {
            console.log(error.message)
            return res.status(500).json({ data: error.message, statusCode: 404, msg: "Failure" });
        }
    },

    editEdu: async (req: any, res: Response) => {
        try {
            if(req.body.userEmail != req.user.email){
                res.status(400).json({ data: 'Authentication error', statusCode: 400, msg: "Failure" });
            }

            if(!checkIfArtisan(req.body.userEmail)){
                res.status(400).json({ data: 'Not an artisan', statusCode: 400, msg: "Failure" });
            }

            const id = req.params.id;
            const sendData = req.body;
            const data = await PayService.editEdu(id, sendData);
            return res.status(data.statusCode).json(data);

        } catch (error: any) {
            console.log(error.message)
            return res.status(500).json({ data: error.message, statusCode: 404, msg: "Failure" });
        }
    },

    deleteEdu: async (req: any, res: Response) => {
        try {
            if(!checkIfArtisan(req.body.userEmail)){
                res.status(400).json({ data: 'Not an artisan', statusCode: 400, msg: "Failure" });
            }

            const id = req.params.id;
            const data = await PayService.deleteEdu(id);
            return res.status(data.statusCode).json(data);

        } catch (error: any) {
            console.log(error.message)
            return res.status(500).json({ data: error.message, statusCode: 404, msg: "Failure" });
        }
    },

    deleteCert: async (req: any, res: Response) => {
        try {
            if(!checkIfArtisan(req.body.userEmail)){
                res.status(400).json({ data: 'Not an artisan', statusCode: 400, msg: "Failure" });
            }

            const id = req.params.id;
            const data = await PayService.deleteCert(id);
            return res.status(data.statusCode).json(data);

        } catch (error: any) {
            console.log(error.message)
            return res.status(500).json({ data: error.message, statusCode: 404, msg: "Failure" });
        }
    },
}



export default PayController;