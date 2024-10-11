import mongoose, { Document, Schema as MongooseSchema } from 'mongoose';

// Define User interface to type the UserSchema
interface IUser extends Document {
    firstName: string;
    lastName: string;
    userName: string;
    email: string;
    password?: string;
    gender: string;
    image?: string;
    publicId?: string;
    isArtisan?: boolean;
    active?: boolean;
    deleted?: boolean;
    emailVerify?: boolean;
    otp?: string;
    lastSeen?: string;
    paymentPlan?: string;
    notify?: boolean;
    notifyReview?: boolean;
    createdAt?: Date;
    updatedAt?: Date;
}

// Define the User Schema
const UserSchema = new MongooseSchema<IUser>({
    firstName: {
        type: String,
        required: true
    },
    lastName: {
        type: String,
        required: true
    },
    userName: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: false
    },
    gender: {
        type: String,
        required: true
    },
    image: {
        type: String,
        required: false,
        default: ''
    },
    publicId: {
        type: String,
        required: false,
        default: ''
    },
    isArtisan: {
        type: Boolean,
        required: false,
        default: false
    },
    active: {
        type: Boolean,
        required: false,
        default: true
    },
    deleted: {
        type: Boolean,
        required: false,
        default: false
    },
    emailVerify: {
        type: Boolean,
        required: false,
        default: false
    },
    otp: {
        type: String,
        required: false,
        default: ''
    },
    lastSeen: {
        type: String,
        required: false,
        default: ''
    },
    paymentPlan: {
        type: String,
        required: false,
        default: 'None'
    },
    notify: {
        type: Boolean,
        required: false,
        default: true
    },
    notifyReview: {
        type: Boolean,
        required: false,
        default: true
    }
}, { timestamps: true })

// Export the User model
const User = mongoose.models.User || mongoose.model<IUser>('User', UserSchema);
export default User;
