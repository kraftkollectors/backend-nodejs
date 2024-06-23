import { saveChat, editChat } from './userChat';

// Map to store single user's room association
const singleRooms = new Map<string, string>();
// Map to store single room association so chathead can arrange
const singleUser = new Map<string, string>();

// Map to store double user's room association so the can chat
const userRooms = new Map<string, string>();
// Map to store room association with sender and receiver for chat
const usersPairs = new Map<string, string>();

// Function to generate consistent user pair key
const getUserPairKey = (senderId: string, receiverId: string) => {
    return [senderId, receiverId].sort().join('_');
};

const mySocket = (io: any) => {
    // run when a client connects
    io.on('connection', (socket: any) => {
        socket.emit('connected', { message: 'Welcome! You are connected.' });

        // Listen for single room joining after login request
        socket.on('loginRoom', (data: { userId: string }) => {
            let privateId = singleUser.get(data.userId);

            if (!privateId) {
                // Room doesn't exist, create a new one
                privateId = `room_${data.userId}`;
                singleUser.set(data.userId, privateId);
            }

            socket.join(privateId);
            singleRooms.set(socket.id, privateId);
            io.to(privateId).emit('userLogged', { message: 'user logged' });
        });

        // Listen for room joining request
        socket.on('joinRoom', (data: { senderId: string, receiverId: string }) => {
            const pairKey = getUserPairKey(data.senderId, data.receiverId);
            let roomId = usersPairs.get(pairKey);

            if (!roomId) {
                // Room doesn't exist, create a new one
                roomId = `room_${pairKey}`;
                usersPairs.set(pairKey, roomId);
            }

            socket.join(roomId);
            userRooms.set(socket.id, roomId);
            io.to(roomId).emit('userJoined', { userId: data.senderId, message: 'has joined the chat' });
        });

        // Listen for typing start event
        socket.on('onTypingStart', (data: { senderId: string, receiverId: string }) => {
            const pairKey = getUserPairKey(data.senderId, data.receiverId);
            const roomId = usersPairs.get(pairKey);

            if (roomId && userRooms.get(socket.id) === roomId) {
                io.to(roomId).emit('typingStart', data);
            } else {
                socket.emit('error', { message: 'You are not part of this room' });
            }
        });

        // Listen for typing stop event
        socket.on('onTypingStop', (data: { senderId: string, receiverId: string }) => {
            const pairKey = getUserPairKey(data.senderId, data.receiverId);
            const roomId = usersPairs.get(pairKey);

            if (roomId && userRooms.get(socket.id) === roomId) {
                io.to(roomId).emit('typingStop', data);
            } else {
                socket.emit('error', { message: 'You are not part of this room' });
            }
        });

        // Listen for typing stop event
        socket.on('markSeen', async (data: { senderId: string, receiverId: string, chatId: string, status: string }) => {
            const pairKey = getUserPairKey(data.senderId, data.receiverId);
            const roomId = usersPairs.get(pairKey);

            if (roomId && userRooms.get(socket.id) === roomId) {

                // Save to database
                const res = await editChat(data.chatId, data.status);
                if (res === true) {
                    // Emit message to everyone in the room
                    io.to(roomId).emit('markSeen', data);
                } else {
                    socket.emit('error', { message: 'Failed to save message' });
                }

            } else {
                socket.emit('error', { message: 'You are not part of this room' });
            }
        });

        // Listen for typing stop event
        socket.on('delivered', async (data: { senderId: string, receiverId: string, chatId: string, status: string }) => {
            const pairKey = getUserPairKey(data.senderId, data.receiverId);
            const roomId = usersPairs.get(pairKey);

            if (roomId && userRooms.get(socket.id) === roomId) {
                
                // Save to database
                const res = await editChat(data.chatId, data.status);
                if (res === true) {
                    // Emit message to everyone in the room
                    io.to(roomId).emit('markDelivered', data);
                } else {
                    socket.emit('error', { message: 'Failed to save message' });
                }

            } else {
                socket.emit('error', { message: 'You are not part of this room' });
            }
        });

        // Listen for user message event
        socket.on('chatMessage', async (msg: any) => {
            const pairKey = getUserPairKey(msg.senderId, msg.receiverId);
            const roomId = usersPairs.get(pairKey);

            const sender = singleUser.get(msg.senderId)
            const receiver = singleUser.get(msg.receiverId)

            let res = null;

            if (roomId && userRooms.get(socket.id) === roomId) {
                // Save to database
                res = await saveChat(msg);
                if (res !== null) {
                    // Emit message to everyone in the room
                    io.to(roomId).emit('message', { data: res });
                } else {
                    socket.emit('error', { message: 'Failed to save message', msg });
                }
            } else {
                socket.emit('error', { message: 'You are not part of this room' });
            }

            // Emit event to process and send message
            socket.emit('processAndSendMessage', msg, res);
            console.log('sent');
            
        });

        // event to send to individual rooms
        socket.on('processAndSendMessage', (msg: any, res: any) => {
            const sender = singleUser.get(msg.senderId);
            const receiver = singleUser.get(msg.receiverId);

            console.log('msg', msg);
            console.log('\nres', res);
            
        
            io.to(sender).emit('senderMessage', { data: res });
            io.to(receiver).emit('receiverMessage', { data: res });

            console.log('done');
            
        });

        // Handle client disconnect
        socket.on('disconnect', () => {
            const roomId = userRooms.get(socket.id);
            if (roomId) {
                socket.broadcast.to(roomId).emit('message', 'A user has left the chat');
                userRooms.delete(socket.id);
            }
        });
    });
};

export default mySocket;
