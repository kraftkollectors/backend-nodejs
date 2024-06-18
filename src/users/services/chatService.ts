import dotenv from 'dotenv';
dotenv.config();
import User from '../../models/users'
import Chat from '../../models/chats'
import mongoose from 'mongoose';
import { generatDate } from '../../middlewares/genDate';


const ChatService = {
    getAllUserChatHeads: async (userid: string) => {
        try {
            // check if id is a valid mongoose id
            const isValidId = mongoose.isValidObjectId(userid)

            if(!isValidId){
                return { data: 'Please enter a correct id', statusCode: 404, msg: "Failure" };
            }

            // Load chats involving the user
            const loadchats = await Chat.find({
                $or: [
                    { senderId: userid },
                    { receiverId: userid }
                ]
            }).sort({ timestamp: -1 })


            if (!loadchats || loadchats.length === 0) {
                return { 
                    data: { 
                        existingRecords: loadchats
                    },  
                    statusCode: 201, 
                    msg: "Success" 
                }
            }

            // Extract unique user IDs and find the last message for each user
            const userMessages: any = {};
            loadchats.forEach((chat: any) => {
                const otherUserId = chat.senderId.toString() === userid ? chat.receiverId.toString() : chat.senderId.toString();
                
                if (!userMessages[otherUserId]) {
                    userMessages[otherUserId] = {
                        lastMessage: chat.message,
                        lastMessageTime: chat.createdAt
                    };
                }
            });

            // Get the unique user IDs
            const userIds = Object.keys(userMessages);

            // Query the User model to get the usernames and profile pictures
            const users = await User.find({ _id: { $in: userIds } }, 'userName image');

            // Map users to include last message and timestamp
            const usersWithLastMessage = users.map((user: any) => ({
                _id: user._id,
                userName: user.userName,
                image: user.image,
                lastMessage: userMessages[user._id.toString()].lastMessage,
                lastMessageTime: userMessages[user._id.toString()].lastMessageTime
            }));
                         

            return { 
                data: { 
                    existingRecords: usersWithLastMessage
                }, 
                statusCode: 201, 
                msg: "Success" 
            }

        } catch (error: any) {
            throw new Error(`Error fetching account: ${error.message}`);
        }
    },


    getMessage: async (query: any) => {
        try {

            const { userid, receiverid, time } = query;

            // check if id's were sent over
            if(!userid && !receiverid){
                return { data: 'Please enter valid user and receiver id', statusCode: 404, msg: "Failure" };
            }

            // Validate the user IDs
            const isValidUserId = mongoose.isValidObjectId(userid);
            const isValidReceiverId = mongoose.isValidObjectId(receiverid);

            if (!isValidUserId || !isValidReceiverId) {
                return { data: 'Please enter valid user and receiver id', statusCode: 404, msg: "Failure" };
            }

            const limit = 10

            // Load chats involving the user
            const chatQuery: any = {
                $or: [
                    { senderId: userid, receiverId: receiverid },
                    { receiverId: userid, senderId: receiverid }
                ]
            };

            // If time is provided, add it to the query
            if (time) {
                const timeDate: any = new Date(time);
                if (!isNaN(timeDate)) {
                    chatQuery.createdAt = { $lt: timeDate };
                } else {
                    return { data: 'Invalid time format', statusCode: 400, msg: "Failure" };
                }
            }

            // Load chats involving the user
            const loadChats = await Chat.find(chatQuery)
            .sort({ createdAt: -1 }) // Sort by createdAt in descending order to get the latest chats first
            .limit(limit);

            if (!loadChats || loadChats.length === 0) {
            return {
                data: {
                    existingRecords: loadChats,
                    totalDocuments: 0,
                    hasPreviousPage: false,
                    previousPages: 0,
                    hasNextPage: false,
                    nextPages: 0,
                    totalPages: 0,
                    currentPage: 1
                },
                statusCode: 201,
                msg: "Success"
            };
            }

            // Query the User model to get the usernames and profile pictures
            const users = await User.find(
                { _id: { $in: [userid, receiverid] } },
                'userName image'
            );

            // Create a map for user details
            const userDetailsMap: any = {};
            users.forEach((user: any) => {
                userDetailsMap[user._id.toString()] = {
                    username: user.userName,
                    image: user.image
                };
            });

            // Format the chat data with user details
            const formattedChats = loadChats.map((chat: any) => ({
                _id: chat._id,
                message: chat.message,
                status: chat.status,
                type: chat.type,
                data: chat.data,
                timestamp: chat.createdAt,
                sender: {
                    _id: chat.senderId,
                    userName: userDetailsMap[chat.senderId.toString()].userName,
                    image: userDetailsMap[chat.senderId.toString()].image
                },
                receiver: {
                    _id: chat.receiverId,
                    userName: userDetailsMap[chat.receiverId.toString()].userName,
                    image: userDetailsMap[chat.receiverId.toString()].image
                }
            }));
            
            // Count the total number of documents
            const totalDocuments = await Chat.countDocuments(chatQuery);

            // Calculate the total number of pages
            const totalPages = Math.ceil(totalDocuments / limit);

            // Determine if there are previous and next pages
            const hasPreviousPage = loadChats.length === limit && loadChats[0].createdAt < new Date();
            const hasNextPage = loadChats.length === limit;

            // Return the response with pagination info
            return {
                data: {
                    existingRecords: formattedChats,
                    totalDocuments,
                    hasPreviousPage,
                    previousPages: hasPreviousPage ? 1 : 0,
                    hasNextPage,
                    nextPages: hasNextPage ? 1 : 0,
                    totalPages,
                    currentPage: 1
                },
                statusCode: 201,
                msg: "Success"
            };

        } catch (error: any) {
            throw new Error(`Error fetching account: ${error.message}`);
        }
    },
    
    deleteChat: async (id: string) => {
        try {
            // check if id is a valid mongoose id
            const isValidId = mongoose.isValidObjectId(id)

            if(!isValidId){
                return { data: 'Please enter a correct id', statusCode: 404, msg: "Failure" };
            }

            // Check if the email already exists
            await Chat.findByIdAndDelete(id)          

            return { data: 'chat deleted', statusCode: 201, msg: "Success" };
            
        } catch (error: any) {
            throw new Error(`Error deleting Chat: ${error.message}`);
        }
    },
    
    lastSeen: async (id: string) => {
        try {
            // check if id is a valid mongoose id
            const isValidId = mongoose.isValidObjectId(id)

            if(!isValidId){
                return { data: 'Please enter a correct id', statusCode: 404, msg: "Failure" };
            }

            const lastSeen = generatDate()

            let data = await User.findByIdAndUpdate(id, { lastSeen }, {
                new: true,
                runValidators: true
            })

            if(data !== null){
                return { data: { data }, statusCode: 201, msg: "Success" };
            }else{
                return { data: 'Error updating lastseen', statusCode: 401, msg: "Failure" };
            }
            
        } catch (error: any) {
            throw new Error(`Error deleting Chat: ${error.message}`);
        }
    },


}


export default ChatService;