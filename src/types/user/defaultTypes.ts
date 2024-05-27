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

export interface UserDataArtisan {
    userId: string,
    userEmail: string,
    picture: string,
    workHourFrom: string,
    workHourTo: string,
    website: string,
    instagram: string,
    twitter: string,
    facebook: string,
    linkedln: string,
    phoneNumber: string,
    description: string,
    firstName: string,
    lastName: string,
    businessName: string,
    location: string,
    areaOfSpecialization: string,
    nin: string,
}


export interface UserDataCertificate {
    userId: string,
    userEmail: string
    certificate: string,
    certifiedBy: string,
    year: string,
}


export interface UserDataEducation {
    userId: string,
    userEmail: string,
    university: string,
    degree: string,
    areaOfStudy: string,
    year: string
}