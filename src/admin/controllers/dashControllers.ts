import { Request, Response } from 'express';
import DashService from '../services/dashService';


// driver login
const DashController = {

    getAdmin: async (req: Request, res: Response) => {
        try {
            const adminid = req.params.adminid;
            const data = await DashService.getAdmin(adminid);
            return res.status(data.statusCode).json(data);

        } catch (error: any) {
            console.log(error.message)
            return res.status(500).json({ error: error.message, status: error.statusCode, msg: "Failure" });
        }
    },

    editAdmin: async (req: any, res: Response) => {
        try {
            if(req.body.adminEmail != req.admin.email){
                res.status(400).json({ error: 'Authentication error', status: 400, msg: "Failure" });
            }

            const adminid = req.params.adminid;
            const sendData = req.body;
            const data = await DashService.editAdmin(adminid, sendData);
            return res.status(data.statusCode).json(data);

        } catch (error: any) {
            console.log(error.message)
            return res.status(500).json({ error: error.message, status: error.statusCode, msg: "Failure" });
        }
    },
}



export default DashController;