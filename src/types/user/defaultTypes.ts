export interface UserData {
    fullname: string,
    email: string;
    password: string;
    gender: string;
    startDate: string;
    livingArrangement: string;
    questions: string;
}

export interface UserDataLogin {
    email: string;
    password: string;
}

export interface UserDataForgot {
    email: string;
}