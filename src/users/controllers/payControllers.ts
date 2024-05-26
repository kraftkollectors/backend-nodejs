import { Request, Response } from 'express';
import PayService from '../services/payService';


// driver login
const PayController = {

    getAllPayment: async (req: any, res: Response) => {
        try {
            const userid = req.params.userid;
            const query = req.query
            const data = await PayService.getAllPayment(query, userid);
            return res.status(data.statusCode).json(data);

        } catch (error: any) {
            console.log(error.message)
            return res.status(500).json({ error: error.message, status: error.statusCode, msg: "Failure" });
        }
    },

    becomeArtisan: async (req: any, res: Response) => {
        try {
            if(req.body.user_email != req.user.email){
                res.status(400).json({ error: 'Authentication error', status: 400, msg: "Failure" });
            }

            const userid = req.params.userid;
            const sendData = req.body;
            const data = await PayService.becomeArtisan(userid, sendData);
            return res.status(data.statusCode).json(data);

        } catch (error: any) {
            console.log(error.message)
            return res.status(500).json({ error: error.message, status: error.statusCode, msg: "Failure" });
        }
    },

    makePayment: async (req: any, res: Response) => {
        try {
            if(req.body.user_email != req.user.email){
                res.status(400).json({ error: 'Authentication error', status: 400, msg: "Failure" });
            }

            const userid = req.params.userid;
            const sendData = req.body;
            const data = await PayService.makePayment(userid, sendData);
            return res.status(data.statusCode).json(data);

        } catch (error: any) {
            console.log(error.message)
            return res.status(500).json({ error: error.message, status: error.statusCode, msg: "Failure" });
        }
    },
}



export default PayController;