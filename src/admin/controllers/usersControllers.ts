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
            return res.status(500).json({ error: error.message, status: error.statusCode, msg: "Failure" });
        }
    },

    getSingleUser: async (req: Request, res: Response) => {
        try {
            const id = req.params.id;
            const data = await UsersService.getSingleUser(id);
            return res.status(data.statusCode).json(data);

        } catch (error: any) {
            console.log(error.message)
            return res.status(500).json({ error: error.message, status: error.statusCode, msg: "Failure" });
        }
    },

    deleteUser: async (req: Request, res: Response) => {
        try {
            const id = req.params.id;
            const data = await UsersService.deleteUser(id);
            return res.status(data.statusCode).json(data);

        } catch (error: any) {
            console.log(error.message)
            return res.status(500).json({ error: error.message, status: error.statusCode, msg: "Failure" });
        }
    },

    enableDisableUser: async (req: any, res: Response) => {
        try {
            if(req.body.adminEmail != req.admin.email){
                res.status(400).json({ error: 'Authentication error', status: 400, msg: "Failure" });
            }

            const id = req.params.id;
            const sendData = req.body;
            const data = await UsersService.enableDisableUser(id, sendData);
            return res.status(data.statusCode).json(data);

        } catch (error: any) {
            console.log(error.message)
            return res.status(500).json({ error: error.message, status: error.statusCode, msg: "Failure" });
        }
    },

}



export default UsersController;