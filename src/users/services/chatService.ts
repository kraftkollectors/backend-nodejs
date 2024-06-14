import dotenv from 'dotenv';
dotenv.config();
import User from '../../models/users'
import Chat from '../../models/chats'
import mongoose from 'mongoose';


const ChatService = {
    getAllUserChatHeads: async (userid: string, query: any) => {
        try {
            // check if id is a valid mongoose id
            const isValidId = mongoose.isValidObjectId(userid)

            if(!isValidId){
                return { data: 'Please enter a correct id', statusCode: 404, msg: "Failure" };
            }

            const resPerPage = 15
            const currentPageNum = Number(query.page) || 1
            const skip = resPerPage * (currentPageNum - 1)

            // Load chats involving the user
            const loadchats = await Chat.find({
                $or: [
                    { sender_id: userid },
                    { receiver_id: userid }
                ]
            }).sort({ timestamp: -1 }).limit(resPerPage).skip(skip)


            if (!loadchats || loadchats.length === 0) {
                return { 
                    data: { 
                        existingRecords: loadchats, 
                        totalDocuments: 0,
                        hasPreviousPage: false, 
                        previousPages: 0, 
                        hasNextPage: false,      
                        nextPages: 0,
                        totalPages: 0,
                        currentPage: currentPageNum
                    },  
                    statusCode: 201, 
                    msg: "Success" 
                }
            }

            // Extract unique user IDs and find the last message for each user
            const userMessages: any = {};
            loadchats.forEach((chat: any) => {
                const otherUserId = chat.sender_id.toString() === userid ? chat.receiver_id.toString() : chat.sender_id.toString();
                
                if (!userMessages[otherUserId]) {
                    userMessages[otherUserId] = {
                        lastMessage: chat.message,
                        lastMessageTime: chat.timestamp
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
            
            
            // Count the total number of documents
            const totalDocuments = await Chat.countDocuments(
                {
                    $or: [
                        { sender_id: userid },
                        { receiver_id: userid }
                    ]
                }
            );

            // Calculate the total number of pages
            const totalPages = Math.ceil(totalDocuments / resPerPage);

            // Determine if there are previous and next pages
            const hasPreviousPage = currentPageNum > 1;
            const hasNextPage = currentPageNum < totalPages

            // Calculate the number of previous and next pages available
            const previousPages = currentPageNum - 1;
            const nextPages = (totalPages - currentPageNum) < 0 ? 0 : totalPages - currentPageNum;
               

            return { 
                data: { 
                    existingRecords: usersWithLastMessage,
                    totalDocuments, 
                    hasPreviousPage, 
                    previousPages, 
                    hasNextPage, 
                    nextPages,                    
                    totalPages,
                    currentPage: currentPageNum
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

            let userid: any = query.userid
            let receiverid: any = query.receiverid

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

            const resPerPage = 15
            const currentPageNum = Number(query.page) || 1
            const skip = resPerPage * (currentPageNum - 1)

            // Load chats involving the user
            const loadchats = await Chat.find({
                $or: [
                    { sender_id: userid, receiver_id: receiverid },
                    { receiver_id: userid, sender_id: receiverid }
                ]
            }).sort({ timestamp: 1 }).limit(resPerPage).skip(skip)


            if (!loadchats || loadchats.length === 0) {
                return { 
                    data: { 
                        existingRecords: loadchats, 
                        totalDocuments: 0,
                        hasPreviousPage: false, 
                        previousPages: 0, 
                        hasNextPage: false,      
                        nextPages: 0,
                        totalPages: 0,
                        currentPage: currentPageNum
                    },  
                    statusCode: 201, 
                    msg: "Success" 
                }
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
            const formattedChats = loadchats.map((chat: any) => ({
                _id: chat._id,
                message: chat.message,
                timestamp: chat.timestamp,
                sender: {
                    _id: chat.sender_id,
                    userName: userDetailsMap[chat.sender_id.toString()].userName,
                    image: userDetailsMap[chat.sender_id.toString()].image
                },
                receiver: {
                    _id: chat.receiver_id,
                    userName: userDetailsMap[chat.receiver_id.toString()].userName,
                    image: userDetailsMap[chat.receiver_id.toString()].image
                }
            }));
            
            
            // Count the total number of documents
            const totalDocuments = await Chat.countDocuments(
                {
                    $or: [
                        { sender_id: userid, receiver_id: receiverid },
                        { receiver_id: userid, sender_id: receiverid }
                    ]
                }
            );

            // Calculate the total number of pages
            const totalPages = Math.ceil(totalDocuments / resPerPage);

            // Determine if there are previous and next pages
            const hasPreviousPage = currentPageNum > 1;
            const hasNextPage = currentPageNum < totalPages

            // Calculate the number of previous and next pages available
            const previousPages = currentPageNum - 1;
            const nextPages = (totalPages - currentPageNum) < 0 ? 0 : totalPages - currentPageNum;
               

            return { 
                data: { 
                    existingRecords: formattedChats,
                    totalDocuments, 
                    hasPreviousPage, 
                    previousPages, 
                    hasNextPage, 
                    nextPages,                    
                    totalPages,
                    currentPage: currentPageNum
                }, 
                statusCode: 201, 
                msg: "Success" 
            }

        } catch (error: any) {
            throw new Error(`Error fetching account: ${error.message}`);
        }
    },

}


export default ChatService;