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

// enum Data{
//     SEEN = 'seen',
//     DELIVERED = 'delivered',
//     SENT = 'sent'
// }

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
        type: [String, Array],
        required: true
    }

},
{ timestamps: true }
);

const Chat: any = mongoose.models.Chat ||  mongoose.model('Chat', ChatSchema);

export default Chat