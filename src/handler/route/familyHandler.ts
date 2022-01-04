import { Request, Response } from 'express'
import familyQuery from '@src/handler/query/familyQuery'
import { CreateFamilyReq, FamilySearchReq } from '@src/model/interface/request.interface'
import { FamilyDataResp, FamilyDetails, FamilyDetailsMax, ResponseDto, ResponseModel, UserDetailsMax } from '@src/model/interface/response.interface'
import helpers from '@src/provider/others/helpers'
import { constant } from '@src/provider/others/constant'

const createFamily = async(req: Request, res: Response) => {
    let reqData: CreateFamilyReq = req.body
    let response = <ResponseDto<FamilyDataResp>>{}

    try{
        response = await familyQuery.createFamilyQuery(reqData)
        console.log({createFamilyResponse: response})
        return res.send(response)
    }
    catch(err){
        response = helpers.catchErrorResponse(`${err} : createFamily handler`)
        return res.send(response)
    } 
}

const searchFamily = async (req: Request, res: Response) => {
    let reqData: FamilySearchReq = req.body
    let response = <ResponseModel | ResponseDto<FamilyDetailsMax> | ResponseDto<FamilyDetails> | ResponseDto<UserDetailsMax[]>>{};

    try{
        if(reqData.searchType === constant.SEARCHFAMILY_PHONENUMBER){
            response =  await familyQuery.searchFamilyByPhoneNumber(reqData.phoneNumber)
            return res.send(response)
        }
        if(reqData.searchType === constant.SEARCHFAMILY_FAMILYDETAILS){
            response = await familyQuery.searchFamilyByFamilyDetails(reqData)
            return res.send(response)
        }
        if(reqData.searchType === constant.SEARCHFAMILY_NAME_HOMETOWN){
            response = await familyQuery.searchByFamilyName_homeTown(reqData.familyName)
            return res.send(response)
        }
        if(reqData.searchType === constant.SEARCHFAMILY_USERNAME){
            response =  await familyQuery.searchUserFamilyByUsername(reqData.userName)
            return res.send(response)
        }
    }
    catch(err){
        response = helpers.catchErrorResponse(`${err} : searchFamily handler`)
        return res.send(response)
    }
}

const updateFamilyDetails = async (req: Request, res: Response) => {
    let reqData: CreateFamilyReq = req.body
    let response = <ResponseDto<FamilyDataResp>>{}

    try{
        const response = await familyQuery.updateFamilyDetailsQuery(reqData)
        return res.send(response)
    }
    catch(err){
        response = helpers.catchErrorResponse(`${err} : searchFamily handler`)
        return res.send(response)
    }
}


export default {
    createFamily,
    searchFamily,
    updateFamilyDetails
}