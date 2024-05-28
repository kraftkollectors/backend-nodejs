import { Request, Response } from 'express';
import AdsService from '../services/adsService';


// driver login
const AdsController = {

    getAllAd: async (req: any, res: Response) => {
        try {
            const query = req.query
            const data = await AdsService.getAllAd(query);
            return res.status(data.statusCode).json(data);

        } catch (error: any) {
            console.log(error.message)
            return res.status(500).json({ error: error.message, status: error.statusCode, msg: "Failure" });
        }
    },

    getSingleAd: async (req: Request, res: Response) => {
        try {
            const id = req.params.id;
            const data = await AdsService.getSingleAd(id);
            return res.status(data.statusCode).json(data);

        } catch (error: any) {
            console.log(error.message)
            return res.status(500).json({ error: error.message, status: error.statusCode, msg: "Failure" });
        }
    },

    getMyAd: async (req: any, res: Response) => {
        try {
            const userid = req.params.userid;
            const query = req.query
            const data = await AdsService.getMyAd(query, userid);
            return res.status(data.statusCode).json(data);

        } catch (error: any) {
            console.log(error.message)
            return res.status(500).json({ error: error.message, status: error.statusCode, msg: "Failure" });
        }
    },

    getcategory: async (req: any, res: Response) => {
        try {
            const data = await AdsService.getcategory();
            return res.status(data.statusCode).json(data);

        } catch (error: any) {
            console.log(error.message)
            return res.status(500).json({ error: error.message, status: error.statusCode, msg: "Failure" });
        }
    },

    deleteAd: async (req: Request, res: Response) => {
        try {
            const id = req.params.id;
            const data = await AdsService.deleteAd(id);
            return res.status(data.statusCode).json(data);

        } catch (error: any) {
            console.log(error.message)
            return res.status(500).json({ error: error.message, status: error.statusCode, msg: "Failure" });
        }
    },

    editAd: async (req: any, res: Response) => {
        try {
            if(req.body.user_email != req.user.email){
                res.status(400).json({ error: 'Authentication error', status: 400, msg: "Failure" });
            }

            const id = req.params.id;
            const sendData = req.body;
            const data = await AdsService.editAd(id, sendData);
            return res.status(data.statusCode).json(data);

        } catch (error: any) {
            console.log(error.message)
            return res.status(500).json({ error: error.message, status: error.statusCode, msg: "Failure" });
        }
    },

    enableDisableAd: async (req: any, res: Response) => {
        try {
            if(req.body.user_email != req.user.email){
                res.status(400).json({ error: 'Authentication error', status: 400, msg: "Failure" });
            }

            const id = req.params.id;
            const sendData = req.body;
            const data = await AdsService.enableDisableAd(id, sendData);
            return res.status(data.statusCode).json(data);

        } catch (error: any) {
            console.log(error.message)
            return res.status(500).json({ error: error.message, status: error.statusCode, msg: "Failure" });
        }
    },

    postAd: async (req: any, res: Response) => {
        try {
            if(req.body.user_email != req.user.email){
                res.status(400).json({ error: 'Authentication error', status: 400, msg: "Failure" });
            }

            const sendData = req.body;
            const data = await AdsService.postAd(sendData);
            return res.status(data.statusCode).json(data);

        } catch (error: any) {
            console.log(error.message)
            return res.status(500).json({ error: error.message, status: error.statusCode, msg: "Failure" });
        }
    },
}



export default AdsController;