import { saveChat } from './userChat';

// Map to store user's room association
const userRooms = new Map<string, string>();
// Map to store room association with sender and receiver
const userPairs = new Map<string, string>();

// Function to generate consistent user pair key
const getUserPairKey = (senderId: string, receiverId: string) => {
    return [senderId, receiverId].sort().join('_');
};

const mySocket = (io: any) => {
    // run when a client connects
    io.on('connection', (socket: any) => {
        console.log('connected');
        socket.emit('connected', { message: 'Welcome! You are connected.' });

        // Listen for room joining request
        socket.on('joinRoom', (data: { senderId: string, receiverId: string }) => {
            const pairKey = getUserPairKey(data.senderId, data.receiverId);
            let roomId = userPairs.get(pairKey);

            if (!roomId) {
                // Room doesn't exist, create a new one
                roomId = `room_${pairKey}`;
                userPairs.set(pairKey, roomId);
            }

            socket.join(roomId);
            userRooms.set(socket.id, roomId);
            socket.broadcast.to(roomId).emit('userJoined', { userId: data.senderId, message: 'has joined the chat' });
        });

        // Listen for typing start event
        socket.on('onTypingStart', (data: { senderId: string, receiverId: string }) => {
            const pairKey = getUserPairKey(data.senderId, data.receiverId);
            const roomId = userPairs.get(pairKey);

            if (roomId && userRooms.get(socket.id) === roomId) {
                socket.broadcast.to(roomId).emit('typingStart', data);
            } else {
                socket.emit('error', { message: 'You are not part of this room' });
            }
        });

        // Listen for typing stop event
        socket.on('onTypingStop', (data: { senderId: string, receiverId: string }) => {
            const pairKey = getUserPairKey(data.senderId, data.receiverId);
            const roomId = userPairs.get(pairKey);

            if (roomId && userRooms.get(socket.id) === roomId) {
                socket.broadcast.to(roomId).emit('typingStop', data);
            } else {
                socket.emit('error', { message: 'You are not part of this room' });
            }
        });

        // Listen for user message event
        socket.on('chatMessage', async (msg: any) => {
            const pairKey = getUserPairKey(msg.senderId, msg.receiverId);
            const roomId = userPairs.get(pairKey);

            if (roomId && userRooms.get(socket.id) === roomId) {
                // Save to database
                const res = await saveChat(msg);
                if (res === true) {
                    // Emit message to everyone in the room
                    io.to(roomId).emit('message', msg);
                } else {
                    socket.emit('error', { message: 'Failed to save message' });
                }
            } else {
                socket.emit('error', { message: 'You are not part of this room' });
            }
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
