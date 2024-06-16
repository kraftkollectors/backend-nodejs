import Chat from '../models/chats'


// history create
const saveChat = async (data: any) => {
    try{
        const chat = await new Chat({ ...data }).save()

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