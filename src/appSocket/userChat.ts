import Chat from '../models/chats'
import Users from '../models/users'


// load chat room
const chatLoad = async (req: any, res: any) => {
    try{
        const receiverid = req.params.id

        const user = await Users.findById(receiverid)

        const loadchats = await Chat.find({
            $or: [
            { sender_id: req.session.user._id, receiver_id: receiverid },
            { receiver_id: req.session.user._id, sender_id: receiverid }
            ]
        });
        console.log(loadchats);

    
        res.render('chatroom', { user:req.session.user, friend: user, chats:loadchats })
    }catch(err: any){
        console.log(err.message);
    }
}

// history create
const saveChat = async (data: any) => {
    try{
        const senderid = data.activeUserid
        const receiverid = data.receiverid
        const msg = data.msg

        const chat = await new Chat({
            sender_id: senderid,
            receiver_id: receiverid,
            message: msg
        }).save()

        if(chat !== null){
            return true
        }else{
            return false
        }
       
    }
    catch(err: any){
        console.log(err.message); 
    }
}



export { saveChat, chatLoad } 