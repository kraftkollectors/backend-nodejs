export interface UserData {
    firstname: string,
    lastname: string,
    username: string,
    email: string;
    password: string;
    gender: string;
}

export interface UserDataLogin {
    email: string;
    password: string;
}

export interface UserDataForgot {
    email: string;
}