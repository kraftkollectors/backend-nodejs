import User from "../models/users";

export const checkIfArtisan = async (email: any) => {

    const user = await User.findOne({ email })
    return user.isArtisan
}