import mongoose from "mongoose";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt"
import { IUser, LoginResp } from "@src/model/interface/request.interface";
import  config from "@src/config/config"
import { FamilyDetails, FamilyDataResp, UserDetailsMax, ResponseDto } from '@src/model/interface/response.interface'
import { ResponseCode, ResponseDescription } from '@src/provider/others/constant'
import helpers from '@src/provider/others/helpers'

const User = mongoose.model("User");
const Family = mongoose.model("Family");


const createUserQuery = async (data: IUser): Promise<ResponseDto<UserDetailsMax>> => {
    let result = <ResponseDto<UserDetailsMax>>{};

    try{
        const userExistence = await User.findOne({phoneNumber: data.phoneNumber})
        if(userExistence){
            Object.assign(result, helpers.getResponse(ResponseCode.FOUND_RECORD))
            return result;
        }

        const user = new User(data)
        await user.save()
        .then( async doc => {
            const token: string = jwt.sign({userId: doc._id}, config.secretKey)
            const otherData = await getUserOtherDetails(doc as IUser)
            result.responseCode = ResponseCode.SUCCESS
            result.responseDescription = ResponseDescription.SUCCESS
            result.token = token
            result.data = <UserDetailsMax>{
                userData: doc,
                familyMembers: otherData.familyMembers,
                familyData: otherData.familyData
            }
        })
        .catch(err => {
            Object.assign(result, helpers.getResponse(ResponseCode.PROCESS_FAILED, `${err} : createUser query`))
        })

        return result;
    }
    catch(err){
        Object.assign(result, helpers.catchError(`${err} : createUser query`))
        return result;
    }
}

const loginQuery = async (data: LoginResp): Promise<ResponseDto<UserDetailsMax>> => {
    let result = <ResponseDto<UserDetailsMax>>{}
    const user = (await User.findOne({phoneNumber: data.phoneNumber}) as IUser)
    if(!user){
        Object.assign(result, helpers.getResponse(ResponseCode.NO_RECORD))
        return result;
    }

    try{
        await user.comparePassword(data.password)
        const token = jwt.sign({userId: user._id}, config.secretKey)
        const otherData = await getUserOtherDetails(user)
        result.responseCode = ResponseCode.SUCCESS
        result.responseDescription = ResponseDescription.SUCCESS
        result.token = token
        result.data = <UserDetailsMax>{
            userData: user,
            familyMembers: otherData.familyMembers,
            familyData: otherData.familyData
        }
        return result;
    }           
    catch(err){
        return { responseCode: "101", responseDescription: "Invalid username or password", exception: `${err} : from login query`}
    }  
}

const getUserOtherDetails = async (data: IUser): Promise<FamilyDetails> => {
    let result = <FamilyDetails>{}

    const familyMembers = (await User.find({ familyId: data.familyId }) as [IUser] | [])
    result.familyMembers = familyMembers.length > 0 ? familyMembers : "No family members could be found"

    const familyData = (await Family.findById(data.familyId) as FamilyDataResp)
    result.familyData = !familyData ? "No family data could be found" : familyData

    return result
}

export default {
    getUserOtherDetails,
    createUserQuery,
    loginQuery
}