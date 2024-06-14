import { saveChat } from './userChat'

// Map to store driver's room association
const userRooms = new Map();

const mySocket = (io: any) => {
    // run when a client connects
    io.on('connection', (socket: any) => {

        // Listen for room joining request
        socket.on('joinRoom', (data: { userId: string, roomId: string }) => {
            socket.join(data.roomId);
            userRooms.set(socket.id, data.roomId);
            socket.broadcast.to(data.roomId).emit('userJoined', { userId: data.userId, message: 'has joined the chat' });
        });

        // listen for details (userid and roomid) sent from front end
        socket.on('userWelcome', (data: { userId: string, roomId: string }) => {
            const roomId = data.roomId;
            socket.broadcast.to(roomId).emit('userWelcome', data);
        });

        // listen for details (userid and roomid) sent from front end
        socket.on('onTypingStart', (data: { userId: string, roomId: string }) => {
            const roomId = data.roomId;
            socket.broadcast.to(roomId).emit('typingStart', data);
        });

        // listen for details (userid and roomid) sent from front end
        socket.on('onTypingStop', (data: { userId: string, roomId: string }) => {
            const roomId = data.roomId;
            socket.broadcast.to(roomId).emit('typingStop', data);
        });

        // listen for user message sent from front end
        socket.on('chatMessage', async (msg: { userId: string, roomId: string, message: string }) => {
            const roomId = msg.roomId;
            // save to database
            const res = await saveChat(msg);
            if (res === true) {
                // this is for everyone in the room
                io.to(roomId).emit('message', msg);
            } else {
                io.to(roomId).emit('message', msg);
            }
        });

        // runs when client disconnects
        socket.on('disconnect', () => {
            const roomId = userRooms.get(socket.id);
            if (roomId) {
                socket.broadcast.to(roomId).emit('message', 'A user has left the chat');
                userRooms.delete(socket.id);
            }
        });
    });
}

export default mySocket;