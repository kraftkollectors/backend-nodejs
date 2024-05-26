const mongoose = require('mongoose');

const ChatSchema = new mongoose.Schema({
    sender_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    receiver_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    message: {
        type: String,
        required: true
    }
},
{ timestamps: true }
);

const Chat: any = mongoose.models.Chat ||  mongoose.model('Chat', ChatSchema);

export default Chat