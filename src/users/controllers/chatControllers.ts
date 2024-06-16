import { Request, Response } from 'express';
import ChatService from '../services/chatService';


// driver login
const ChatController = {

    getAllUserChatHeads: async (req: Request, res: Response) => {
        try {
            const userid = req.params.userid;
            const data = await ChatService.getAllUserChatHeads(userid);
            return res.status(data.statusCode).json(data);

        } catch (error: any) {
            console.log(error.message)
            return res.status(500).json({ data: error.message, statusCode: 400, msg: "Failure" });
        }
    },

    getMessage: async (req: any, res: Response) => {
        try {
            const query = req.query
            const data = await ChatService.getMessage(query);
            return res.status(data.statusCode).json(data);

        } catch (error: any) {
            console.log(error.message)
            return res.status(500).json({ data: error.message, statusCode: 400, msg: "Failure" });
        }
    },

    deleteChat: async (req: any, res: Response) => {
        try {
            const id = req.params.id;
            const data = await ChatService.deleteChat(id);
            return res.status(data.statusCode).json(data);

        } catch (error: any) {
            console.log(error.message)
            return res.status(500).json({ data: error.message, statusCode: 404, msg: "Failure" });
        }
    },
}



export default ChatController;