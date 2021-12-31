import mongoose from "mongoose";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt"
import { IUser } from "@src/model/interface/request.interface";
import  config from "@src/config/config"
import { FamilyDetails, FamilyDataResp } from '@src/model/interface/response.interface'

const User = mongoose.model("User");
const Family = mongoose.model("Family");


const getUserOtherDetails = async (data: IUser): Promise<FamilyDetails> => {
    let result = <FamilyDetails>{}

    const familyMembers = (await User.find({ familyId: data.familyId }) as [IUser] | [])
    result.familyMembers = familyMembers.length > 0 ? familyMembers : "No family members could be found"

    const familyData = (await Family.findById(data.familyId) as FamilyDataResp)
    result.familyData = !familyData ? "No family data could be found" : familyData

    return result
}

export default {
    getUserOtherDetails
}