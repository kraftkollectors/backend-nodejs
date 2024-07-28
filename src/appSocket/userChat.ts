import { mailGenerator, sendmail } from '../middlewares/mailer'
import Chat from '../models/chats'
import User from '../models/users'


// create chat
const saveChat = async (data: any) => {
    try{
        let receiverId: string = data.receiverId
        let senderId: string = data.senderId

        let receiver = await User.findOne({ _id: receiverId }, {  _id: 0, notify: 1, userName: 1, email: 1 } )
        let sender = await User.findOne({ _id: senderId }, {  _id: 0, userName: 1 } )

        let msg = ''
        
        if (data.type == 'string'){
            msg = data.message    
        }else{
            msg = 'shared a file'
        }

        if(receiver.notify === true){
            var emailSender: any = {
                body: {
                    name: receiver.userName,
                    intro: `<span style="font-weight: bolder;">Message from ${sender.userName}:</span>.\n\n
                            ${msg}`,

                    action: {
                        instructions: 'click to login and check chat.',
                        button: {
                            color: '#ffffff',
                            text: `<span style="font-size: 30px; font-weight: bolder; color: black">Login</span>`,
                            link: 'https://www.kraftkollectors.com'
                        }
                    },
                    
                    outro: 'Need help, or have questions? Just reply to this email, we\'d love to help.\n\n Team Kraftkollectors.'
                }
            };

            let emailBody: any = mailGenerator.generate(emailSender);

            await sendmail(receiver.email, 'You got a message', emailBody)
        }


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


export { saveChat, editChat } 