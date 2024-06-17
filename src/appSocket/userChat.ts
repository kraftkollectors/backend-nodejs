import Chat from '../models/chats'


// create chat
const saveChat = async (data: any) => {
    try{
        return await new Chat({ ...data }).save()       
    }
    catch(err: any){
        console.log(err.message); 
    }
}

// test create chat
const saveChat2 = async (req: any, res: any) => {
    try{
        let data = req.body
        return await new Chat({ ...data }).save()       
    }
    catch(err: any){
        console.log(err.message); 
    }
}


// history create
const editChat = async (chatId: string, status: string) => {
    try{
        let chat = await Chat.findByIdAndUpdate(chatId, { status }, {
            new: true,
            runValidators: true
        })

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


export { saveChat, editChat, saveChat2 } 