import { Document } from "mongoose"

export interface CreateFamilyReq {
    familyName: string
    homeTown: string
    country: string
    state: string
}

export interface FamilySearchReq {
    phoneNumber: string,
    familyName: string, 
    country?: string, 
    state?: string, 
    homeTown?: string, 
    userName: string, 
    searchType?: string,
}

export interface IUser extends Document {
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
    comparePassword: (password: string) => boolean
}

export interface LoginResp {
    phoneNumber: string,
    password: string,
}

export interface SendOtpReq {
    email: string,
    emailType: string,
}

export interface ForgetPasswordReq {
    email: string,
    password: string,
    phoneNumber: string,
}