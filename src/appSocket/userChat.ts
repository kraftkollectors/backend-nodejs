import Chat from '../models/chats'


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


export { saveChat } 