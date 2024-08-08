const mongoose = require('mongoose');

enum Status{
    SEEN = 'seen',
    DELIVERED = 'delivered',
    SENT = 'sent'
}

enum Type{
    TEXT = 'text',
    FILE = 'file'
}

const ChatSchema = new mongoose.Schema({
    senderId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    receiverId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    serviceId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Ad',
        required: false
    },
    message: {
        type: String,
        required: true
    },
    status: {
        type: String,
        enum: Object.values(Status),
        default: Status.SENT
    },
    type: {
        type: String,
        enum: Object.values(Type),
        required: true
    },
    data: {
        type: mongoose.Schema.Types.Mixed,
        required: true
    }

},
{ timestamps: true }
);

const Chat: any = mongoose.models.Chat ||  mongoose.model('Chat', ChatSchema);

export default Chat