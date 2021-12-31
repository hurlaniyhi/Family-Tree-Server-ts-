import { Document } from 'mongoose'
import { IUser } from "@src/model/interface/request.interface";

export interface ResponseModel {
    responseCode: string,
    responseDescription: string,
    exception?: string,
    error?: string
}
export interface ResponseDto<T> extends ResponseModel {
    data?: T
}

export interface FamilyDataResp extends Document {
    familyName: string,
    homeTown: string,
    state: string,
    country: string
}

export interface FamilyDetails {
    familyMembers: Array<IUser> | string,
    familyData: FamilyDataResp | string
}

export interface FamilyDataRespII extends FamilyDataResp {
    familyMembers: Array<IUser> | []
}

export interface FamilyDetailsII {
    familiesData: Array<FamilyDataRespII>
}