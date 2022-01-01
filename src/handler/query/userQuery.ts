import mongoose from "mongoose";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt"
import { ForgetPasswordReq, IUser, LoginResp } from "@src/model/interface/request.interface";
import { FamilyDetails, FamilyDataResp, UserDetailsMax, ResponseDto, ResponseModel } from '@src/model/interface/response.interface'
import { ResponseCode } from '@src/provider/others/constant'
import helpers from '@src/provider/others/helpers'
import  config from "@src/config/config"

const User = mongoose.model("User");
const Family = mongoose.model("Family");


const createUserQuery = async (data: IUser): Promise<ResponseDto<UserDetailsMax>> => {
    let result = <ResponseDto<UserDetailsMax>>{};

    try{
        const userExistence = await User.findOne({phoneNumber: data.phoneNumber})
        if(userExistence){
            result = helpers.getResponse(ResponseCode.FOUND_RECORD)
            return result;
        }

        const user = new User(data)
        await user.save()
        .then( async doc => {
            const token: string = jwt.sign({userId: doc._id}, config.secretKey)
            const otherData = await getUserOtherDetails(doc as IUser)
            result = helpers.getResponse(ResponseCode.SUCCESS)
            result.token = token
            result.data = <UserDetailsMax>{
                userData: doc,
                familyMembers: otherData.familyMembers,
                familyData: otherData.familyData
            }
        })
        .catch(err => {
            result = helpers.getResponse(ResponseCode.PROCESS_FAILED, `${err} : createUser query`)
        })

        return result;
    }
    catch(err){
        result = helpers.catchErrorResponse(`${err} : createUser query`)
        return result;
    }
}

const loginQuery = async (data: LoginResp): Promise<ResponseDto<UserDetailsMax>> => {
    let result = <ResponseDto<UserDetailsMax>>{}
    const user = (await User.findOne({phoneNumber: data.phoneNumber}) as IUser)
    if(!user){
        result = helpers.getResponse(ResponseCode.INVALID_USER)
        return result;
    }

    try{
        await user.comparePassword(data.password)
        const token = jwt.sign({userId: user._id}, config.secretKey)
        const otherData = await getUserOtherDetails(user)
        result = helpers.getResponse(ResponseCode.SUCCESS)
        result.token = token
        result.data = <UserDetailsMax>{
            userData: user,
            familyMembers: otherData.familyMembers,
            familyData: otherData.familyData
        }
        return result;
    }           
    catch(err){
        result = helpers.catchErrorResponse(`${err} : loginQuery query`, ResponseCode.INVALID_USER)
        return result
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

const checkUserWithEmail = async (email: string): Promise<ResponseModel> => {
    let result = <ResponseModel>{}
    try{
        const user = await User.findOne({email})
        if(!user){
            result = helpers.getResponse(ResponseCode.INVALID_USER)
            return result;
        }

        result = helpers.getResponse(ResponseCode.SUCCESS)
        return  result
    }
    catch(err){
        result = helpers.catchErrorResponse(`${err} : checkUserWithEmail query`)
        return result;
    }
}

const changePasswordQuery = async (data: ForgetPasswordReq): Promise<ResponseModel> => {
    var result = <ResponseModel>{};

    try{
        const user = await User.findOne({phoneNumber: data.phoneNumber, email: data.email})
        if(!user){
            result = helpers.getResponse(ResponseCode.NO_RECORD)
            return result;
        }

        const salt = await bcrypt.genSalt(10)
        const hash = await bcrypt.hash(data.password, salt)
        console.log(hash)
        const userData = (await User.findByIdAndUpdate({_id: user._id}, {     
                        $set: {
                            password: hash
                        }
                    }) as IUser)

        result = helpers.getResponse(ResponseCode.SUCCESS)
        return result;
    }
    catch(err){
        result = helpers.catchErrorResponse(`${err} : changePasswordQuery query`)
        return result;
    }
}

export default {
    getUserOtherDetails,
    createUserQuery,
    loginQuery,
    checkUserWithEmail,
    changePasswordQuery
}