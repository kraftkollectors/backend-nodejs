import { Request, Response } from 'express';
import UsersService from '../services/usersService';


// driver login
const UsersController = {

    getUsers: async (req: any, res: Response) => {
        try {
            const query = req.query
            const data = await UsersService.getUsers(query);
            return res.status(data.statusCode).json(data);

        } catch (error: any) {
            console.log(error.message)
            return res.status(500).json({ data: error.message, statusCode: 400, msg: "Failure" });
        }
    },

    getAllFilteredArtisans: async (req: any, res: Response) => {
        try {
            const query = req.query
            const data = await UsersService.getAllFilteredArtisans(query);
            return res.status(data.statusCode).json(data);

        } catch (error: any) {
            console.log(error.message)
            return res.status(500).json({ data: error.message, statusCode: 400, msg: "Failure" });
        }
    },

    getSingleUser: async (req: Request, res: Response) => {
        try {
            const id = req.params.id;
            const data = await UsersService.getSingleUser(id);
            return res.status(data.statusCode).json(data);

        } catch (error: any) {
            console.log(error.message)
            return res.status(500).json({ data: error.message, statusCode: 400, msg: "Failure" });
        }
    },

    deleteUser: async (req: Request, res: Response) => {
        try {
            const id = req.params.id;
            const data = await UsersService.deleteUser(id);
            return res.status(data.statusCode).json(data);

        } catch (error: any) {
            console.log(error.message)
            return res.status(500).json({ data: error.message, statusCode: 400, msg: "Failure" });
        }
    },

    enableDisableUser: async (req: any, res: Response) => {
        try {
            if(req.body.adminEmail != req.admin.email){
                return res.status(400).json({ data: 'Authentication error', statusCode: 400, msg: "Failure" });
            }

            const id = req.params.id;
            const sendData = req.body;
            const data = await UsersService.enableDisableUser(id, sendData);
            return res.status(data.statusCode).json(data);

        } catch (error: any) {
            console.log(error.message)
            return res.status(500).json({ data: error.message, statusCode: 400, msg: "Failure" });
        }
    },

}



export default UsersController;