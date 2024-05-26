import { Request, Response } from 'express';
import DashService from '../services/dashService';


// driver login
const DashController = {

    getUser: async (req: Request, res: Response) => {
        try {
            const userid = req.params.userid;
            const data = await DashService.getUser(userid);
            return res.status(data.statusCode).json(data);

        } catch (error: any) {
            console.log(error.message)
            return res.status(500).json({ error: error.message, status: error.statusCode, msg: "Failure" });
        }
    },

    editUser: async (req: any, res: Response) => {
        try {
            if(req.body.user_email != req.user.email){
                res.status(400).json({ error: 'Authentication error', status: 400, msg: "Failure" });
            }

            const userid = req.params.userid;
            const sendData = req.body;
            const data = await DashService.editUser(userid, sendData);
            return res.status(data.statusCode).json(data);

        } catch (error: any) {
            console.log(error.message)
            return res.status(500).json({ error: error.message, status: error.statusCode, msg: "Failure" });
        }
    },

    editUserPassword: async (req: any, res: Response) => {
        try {
            if(req.body.user_email != req.user.email){
                res.status(400).json({ error: 'Authentication error', status: 400, msg: "Failure" });
            }

            const userid = req.params.userid;
            const sendData = req.body;
            const data = await DashService.editUserPassword(userid, sendData);
            return res.status(data.statusCode).json(data);

        } catch (error: any) {
            console.log(error.message)
            return res.status(500).json({ error: error.message, status: error.statusCode, msg: "Failure" });
        }
    },
}



export default DashController;