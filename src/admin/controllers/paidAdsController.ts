import { Request, Response } from 'express';
import PaidAdsService from '../services/paidAdsService';


// driver login
const PaidAdsController = {

    getPaidAds: async (req: any, res: Response) => {
        try {
            const query = req.query
            const data = await PaidAdsService.getPaidAds(query);
            return res.status(data.statusCode).json(data);

        } catch (error: any) {
            console.log(error.message)
            return res.status(500).json({ data: error.message, statusCode: 400, msg: "Failure" });
        }
    },

    getSinglePaidAd: async (req: Request, res: Response) => {
        try {
            const id = req.params.id;
            const data = await PaidAdsService.getSinglePaidAd(id);
            return res.status(data.statusCode).json(data);

        } catch (error: any) {
            console.log(error.message)
            return res.status(500).json({ data: error.message, statusCode: 400, msg: "Failure" });
        }
    },

    postPaidAd: async (req: any, res: Response) => {
        try {
            if(req.body.adminEmail != req.admin.email){
                res.status(400).json({ data: 'Authentication error', statusCode: 400, msg: "Failure" });
            }

            const sendData = req.body;
            const data = await PaidAdsService.postPaidAd(sendData);
            return res.status(data.statusCode).json(data);

        } catch (error: any) {
            console.log(error.message)
            return res.status(500).json({ data: error.message, statusCode: 400, msg: "Failure" });
        }
    },


    deletePaidAd: async (req: Request, res: Response) => {
        try {
            const id = req.params.id;
            const data = await PaidAdsService.deletePaidAd(id);
            return res.status(data.statusCode).json(data);

        } catch (error: any) {
            console.log(error.message)
            return res.status(500).json({ data: error.message, statusCode: 400, msg: "Failure" });
        }
    },

    editPaidAd: async (req: any, res: Response) => {
        try {
            if(req.body.adminEmail != req.admin.email){
                res.status(400).json({ data: 'Authentication error', statusCode: 400, msg: "Failure" });
            }

            const id = req.params.id;
            const sendData = req.body;
            const data = await PaidAdsService.editPaidAd(id, sendData);
            return res.status(data.statusCode).json(data);

        } catch (error: any) {
            console.log(error.message)
            return res.status(500).json({ data: error.message, statusCode: 400, msg: "Failure" });
        }
    },

}



export default PaidAdsController;