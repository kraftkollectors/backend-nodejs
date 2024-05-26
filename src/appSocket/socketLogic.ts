import { saveChat } from './userChat'


// Map to store driver's room association
const userRooms = new Map();

const mySocket = (io: any) => {
    io.on('connection', (socket:any) => {
        console.log('connected...');

        socket.on('available', (sentData: any) => {
            const { driverId, userId, userType, message } = sentData;
            let roomID: any;

            // If the user is a driver, associate them with the room
            if (userType === 'driver') {
                // Check if the user is a driver and if they are already in a room
                if (userRooms.has(driverId)) {
                    // If the driver is already in a room, get the roomID
                    roomID = userRooms.get(driverId);
                }else{                    
                    // Generate a unique room ID if the driver is not in any room
                    roomID = generateRoomID();
                    userRooms.set(driverId, roomID);
                }
                // Join the driver to negotiation room
                socket.join(roomID);
            }else if (userType === 'user'){
                // get the roomID of driver you want to book and join the room
                roomID = userRooms.get(driverId);
                userRooms.set(userId, roomID);
                // Join the user to negotiation room
                socket.join(roomID);

                // Broadcast to the room that a user has initiated a ride
                socket.to(roomID).emit('initiated', { userId, userType, driverId, message });
            }


            // listen for user message sent from front end
            socket.on('negotiation', async (sentData: any) => {   
                console.log(sentData);              
                io.to(roomID).emit('negotiationMessage', { sentData });
            });


            // listen for driver accept message sent from front end
            socket.on('accept', async (sentData: any) => {   
                console.log(sentData);
                const createRide = await saveChat(sentData)
                if (createRide !== false){ 
                    io.to(roomID).emit('acceptMessage', { message: 'history created', sentData, rideData: createRide });
                }else{
                    io.to(roomID).emit('acceptMessage', { message: 'history didnt create', sentData, rideData: createRide });
                }
            });


            // listen for user message sent from front end
            socket.on('end', async (rideID: any) => {   
                console.log(rideID);
                const finishRide = await saveChat(rideID)
                if (finishRide === true){ 
                    io.to(roomID).emit('endRide', { message: 'ride ended' });
                }else{
                    io.to(roomID).emit('endRide', { message: 'error in request' });
                }
            });


            // When a user/driver disconnects from the negotiation room
            socket.on('disconnect', () => {
                // Broadcast to the room that a user/driver has left
                socket.to(roomID).emit('userLeft', { userId, userType });
                // Leave the negotiation room
                socket.leave(roomID);
                // If the user is a driver, remove the association with the room
                if (userType === 'driver') {
                    userRooms.delete(userId);
                }
            });
        });
    });
}


function generateRoomID() {
    const charset = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let room: string = 'room-' 
    for (let i = 0; i < 6; i++) {
        const randomIndex = Math.floor(Math.random() * charset.length);
        room += charset[randomIndex];
    }

    return room
}

export default mySocket