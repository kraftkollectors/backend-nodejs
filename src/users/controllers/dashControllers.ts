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
            return res.status(500).json({ data: error.message, statusCode: 400, msg: "Failure" });
        }
    },

    editUser: async (req: any, res: Response) => {
        try {
            if(req.body.userEmail != req.user.email){
                return res.status(400).json({ data: 'Authentication error', statusCode: 400, msg: "Failure" });
            }

            const userid = req.params.userid;
            const sendData = req.body;
            const data = await DashService.editUser(userid, sendData);
            return res.status(data.statusCode).json(data);

        } catch (error: any) {
            console.log(error.message)
            return res.status(500).json({ data: error.message, statusCode: 400, msg: "Failure" });
        }
    },

    editUserPassword: async (req: any, res: Response) => {
        try {
            if(req.body.userEmail != req.user.email){
                return res.status(400).json({ data: 'Authentication error', statusCode: 400, msg: "Failure" });
            }

            const userid = req.params.userid;
            const sendData = req.body;
            const data = await DashService.editUserPassword(userid, sendData);
            return res.status(data.statusCode).json(data);

        } catch (error: any) {
            console.log(error.message)
            return res.status(500).json({ data: error.message, statusCode: 400, msg: "Failure" });
        }
    },

    deleteAccount: async (req: any, res: Response) => {
        try {
            if(req.body.userEmail != req.user.email){
                return res.status(400).json({ data: 'Authentication error', statusCode: 400, msg: "Failure" });
            }

            const body = req.body;
            const data = await DashService.deleteAccount(body);
            return res.status(data.statusCode).json(data);

        } catch (error: any) {
            console.log(error.message)
            return res.status(500).json({ data: error.message, statusCode: 400, msg: "Failure" });
        }
    },

    setAll: async (req: any, res: Response) => {
        try {
            const data = await DashService.setAll();
            return res.status(data.statusCode).json(data);

        } catch (error: any) {
            console.log(error.message)
            return res.status(500).json({ data: error.message, statusCode: 400, msg: "Failure" });
        }
    },
}



export default DashController;