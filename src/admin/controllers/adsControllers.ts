import { Request, Response } from 'express';
import AdsService from '../services/adsService';


// driver login
const AdsController = {

    getAds: async (req: any, res: Response) => {
        try {
            const id = req.params.id;
            const query = req.query
            const data = await AdsService.getAds(query);
            return res.status(data.statusCode).json(data);

        } catch (error: any) {
            return res.status(500).json({ error: error.message, status: error.statusCode, msg: "Failure" });
        }
    },

    getSingleAd: async (req: Request, res: Response) => {
        try {
            const id = req.params.id;
            const data = await AdsService.getSingleAd(id);
            return res.status(data.statusCode).json(data);

        } catch (error: any) {
            return res.status(500).json({ error: error.message, status: error.statusCode, msg: "Failure" });
        }
    },

    getUserAds: async (req: any, res: Response) => {
        try {
            const userid = req.params.userid;
            const query = req.query
            const data = await AdsService.getUserAds(query, userid);
            return res.status(data.statusCode).json(data);

        } catch (error: any) {
            return res.status(500).json({ error: error.message, status: error.statusCode, msg: "Failure" });
        }
    },

    deleteAd: async (req: Request, res: Response) => {
        try {
            const id = req.params.id;
            const data = await AdsService.deleteAd(id);
            return res.status(data.statusCode).json(data);

        } catch (error: any) {
            return res.status(500).json({ error: error.message, status: error.statusCode, msg: "Failure" });
        }
    },

    editAd: async (req: any, res: Response) => {
        try {
            if(req.body.admin_email != req.admin.email){
                res.status(400).json({ error: 'Authentication error', status: 400, msg: "Failure" });
            }

            const id = req.params.id;
            const sendData = req.body;
            const data = await AdsService.editAd(id, sendData);
            return res.status(data.statusCode).json(data);

        } catch (error: any) {
            return res.status(500).json({ error: error.message, status: error.statusCode, msg: "Failure" });
        }
    },

}



export default AdsController;