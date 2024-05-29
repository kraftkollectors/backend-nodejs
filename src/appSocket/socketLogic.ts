import { saveChat } from './userChat'


// Map to store driver's room association
// const userRooms = new Map();

const mySocket = (io: any) => {
    // run when a client connects
    io.on('connection', (socket: any) => {
        // listen for details (userid and username) sent from front end
        socket.on('userWelcome', (data: any) => {
            // send message to every user connected except for thr user thats connecting
            socket.broadcast.emit('userWelcome', data)
        })

        // listen for user message sent from front end
        socket.on('chatMessage', async (msg: any) => {
            // save to database
            const res = await saveChat(msg)
            if (res === true){ 
                // this is for everyone in general
                io.emit('message', msg)
            }else{
                io.emit('message', msg);
            }
        })
    
        // runs when client disconnects
        socket.on('disconnect', () => {
            io.emit('message', 'A user has left the chat')
        })
    })

}


export default mySocket