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
    firstName: string,
    lastName: string,
    workHourFrom?: string,
    workHourTo?: string,
    website?: string,
    instagram?: string,
    twitter?: string,
    facebook?: string,
    linkedin?: string,
    phoneNumber: string,
    description?: string,
    state?: string,
    lga?: string,
    areaOfSpecialization: string,
    awayMessage?: string,
    showContact?: boolean,
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

export interface UserDataAds {
    userId: string,
    title: string,
    description: string,
    estimatedPrice: number,
    charge: string,
    state: string,
    location: string,
    coverPhoto: string,
    category: string,
    subCategory: string,
    portfolio: []
}

export interface UserDataReport {
    reporterId: string,
    reportedId: string,
    postId: string,
    text: string
}

export interface UserDataContact {
    email: string,
    name: string,
    phone: string,
    subject: string
    message: string
}