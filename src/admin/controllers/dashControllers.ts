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

    getCategories: async (req: Request, res: Response) => {
        try {
            const data = await DashService.getCategories();
            return res.status(data.statusCode).json(data);

        } catch (error: any) {
            console.log(error.message)
            return res.status(500).json({ error: error.message, status: error.statusCode, msg: "Failure" });
        }
    },

    getSingleCategory: async (req: Request, res: Response) => {
        try {
            const id = req.params.id;
            const data = await DashService.getSingleCategory(id);
            return res.status(data.statusCode).json(data);

        } catch (error: any) {
            console.log(error.message)
            return res.status(500).json({ error: error.message, status: error.statusCode, msg: "Failure" });
        }
    },

    getSUbCategories: async (req: Request, res: Response) => {
        try {
            const data = await DashService.getSUbCategories();
            return res.status(data.statusCode).json(data);

        } catch (error: any) {
            console.log(error.message)
            return res.status(500).json({ error: error.message, status: error.statusCode, msg: "Failure" });
        }
    },

    getSingleSubCategory: async (req: Request, res: Response) => {
        try {
            const id = req.params.id;
            const data = await DashService.getSingleSubCategory(id);
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
    
    editCategory: async (req: any, res: Response) => {
        try {
            if(req.body.adminEmail != req.admin.email){
                res.status(400).json({ error: 'Authentication error', status: 400, msg: "Failure" });
            }

            const id = req.params.id;
            const sendData = req.body;
            const data = await DashService.editCategory(id, sendData);
            return res.status(data.statusCode).json(data);

        } catch (error: any) {
            console.log(error.message)
            return res.status(500).json({ error: error.message, status: error.statusCode, msg: "Failure" });
        }
    },
    
    editSubCategory: async (req: any, res: Response) => {
        try {
            if(req.body.adminEmail != req.admin.email){
                res.status(400).json({ error: 'Authentication error', status: 400, msg: "Failure" });
            }

            const id = req.params.id;
            const sendData = req.body;
            const data = await DashService.editSubCategory(id, sendData);
            return res.status(data.statusCode).json(data);

        } catch (error: any) {
            console.log(error.message)
            return res.status(500).json({ error: error.message, status: error.statusCode, msg: "Failure" });
        }
    },

    addCategory: async (req: any, res: Response) => {
        try {
            if(req.body.adminEmail != req.admin.email){
                res.status(400).json({ error: 'Authentication error', status: 400, msg: "Failure" });
            }

            const sendData = req.body;
            const data = await DashService.addCategory(sendData);
            return res.status(data.statusCode).json(data);

        } catch (error: any) {
            console.log(error.message)
            return res.status(500).json({ error: error.message, status: error.statusCode, msg: "Failure" });
        }
    },

    addSubCategory: async (req: any, res: Response) => {
        try {
            if(req.body.adminEmail != req.admin.email){
                res.status(400).json({ error: 'Authentication error', status: 400, msg: "Failure" });
            }

            const sendData = req.body;
            const data = await DashService.addSubCategory(sendData);
            return res.status(data.statusCode).json(data);

        } catch (error: any) {
            console.log(error.message)
            return res.status(500).json({ error: error.message, status: error.statusCode, msg: "Failure" });
        }
    },

    deleteCategory: async (req: Request, res: Response) => {
        try {
            const id = req.params.id;
            const data = await DashService.deleteCategory(id);
            return res.status(data.statusCode).json(data);

        } catch (error: any) {
            console.log(error.message)
            return res.status(500).json({ error: error.message, status: error.statusCode, msg: "Failure" });
        }
    },

    deleteSubCategory: async (req: Request, res: Response) => {
        try {
            const id = req.params.id;
            const data = await DashService.deleteSubCategory(id);
            return res.status(data.statusCode).json(data);

        } catch (error: any) {
            console.log(error.message)
            return res.status(500).json({ error: error.message, status: error.statusCode, msg: "Failure" });
        }
    },
}



export default DashController;