import { Request, Response } from 'express';
import AdsService from '../services/adsService';


// driver login
const AdsController = {

    getAds: async (req: any, res: Response) => {
        try {
            const query = req.query
            const data = await AdsService.getAds(query);
            return res.status(data.statusCode).json(data);

        } catch (error: any) {
            console.log(error.message)
            return res.status(500).json({ data: error.message, statusCode: 400, msg: "Failure" });
        }
    },

    getReport: async (req: any, res: Response) => {
        try {
            const query = req.query
            const data = await AdsService.getReport(query);
            return res.status(data.statusCode).json(data);

        } catch (error: any) {
            console.log(error.message)
            return res.status(500).json({ data: error.message, statusCode: 400, msg: "Failure" });
        }
    },

    getSingleAd: async (req: Request, res: Response) => {
        try {
            const id = req.params.id;
            const data = await AdsService.getSingleAd(id);
            return res.status(data.statusCode).json(data);

        } catch (error: any) {
            console.log(error.message)
            return res.status(500).json({ data: error.message, statusCode: 400, msg: "Failure" });
        }
    },

    getUserAds: async (req: any, res: Response) => {
        try {
            const userid = req.params.userid;
            const query = req.query
            const data = await AdsService.getUserAds(query, userid);
            return res.status(data.statusCode).json(data);

        } catch (error: any) {
            console.log(error.message)
            return res.status(500).json({ data: error.message, statusCode: 400, msg: "Failure" });
        }
    },

    deleteAd: async (req: Request, res: Response) => {
        try {
            const id = req.params.id;
            const data = await AdsService.deleteAd(id);
            return res.status(data.statusCode).json(data);

        } catch (error: any) {
            console.log(error.message)
            return res.status(500).json({ data: error.message, statusCode: 400, msg: "Failure" });
        }
    },

    deleteReport: async (req: Request, res: Response) => {
        try {
            const id = req.params.id;
            const data = await AdsService.deleteReport(id);
            return res.status(data.statusCode).json(data);

        } catch (error: any) {
            console.log(error.message)
            return res.status(500).json({ data: error.message, statusCode: 400, msg: "Failure" });
        }
    },

    editAd: async (req: any, res: Response) => {
        try {
            if(req.body.adminEmail != req.admin.email){
                return res.status(400).json({ data: 'Authentication error', statusCode: 400, msg: "Failure" });
            }

            const id = req.params.id;
            const sendData = req.body;
            const data = await AdsService.editAd(id, sendData);
            return res.status(data.statusCode).json(data);

        } catch (error: any) {
            console.log(error.message)
            return res.status(500).json({ data: error.message, statusCode: 400, msg: "Failure" });
        }
    },

}



export default AdsController;