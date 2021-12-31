export interface CreateFamilyReq {
    familyName: string
    homeTown: string
    country: string
    state: string
}

export interface FamilySearchReq {
    phoneNumber: string,
    familyName?: string, 
    country?: string, 
    state?: string, 
    homeTown?: string, 
    userName?: string, 
    searchType?: string,
}

export interface IUser {
    firstName: string,
    lastName: string,
    email: string,
    phoneNumber: string,
    fatherName: string,
    fatherPhoneNo: string,
    motherName: string,
    motherPhoneNo: string,
    familyId: string,
    address: string,
    password: string,
    gender: string,
    dateOfBirth: string,
    registrationDate: string,
}