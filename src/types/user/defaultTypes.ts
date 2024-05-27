export interface UserData {
    firstName: string,
    lastName: string,
    userName: string,
    email: string,
    password: string,
    gender: string,
}

export interface UserDataLogin {
    email: string,
    password: string,
}

export interface UserDataForgot {
    email: string,
}