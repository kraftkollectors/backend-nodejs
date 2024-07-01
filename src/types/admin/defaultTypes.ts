export interface AdminData {
    email: string,
    password: string,
}

export interface AdminDataForgot {
    email: string,
}


export interface AdminDataPaidAds {
    title: string,
    startDate: string,
    duration: number,
    isActive: boolean,
    image: string,
    url: string
}
