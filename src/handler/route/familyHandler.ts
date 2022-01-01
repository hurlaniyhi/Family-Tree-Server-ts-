import { Request, Response } from 'express'
import familyQuery from '@src/handler/query/familyQuery'
import { CreateFamilyReq, FamilySearchReq } from '@src/model/interface/request.interface'
import { FamilyDataResp, FamilyDetails, FamilyDetailsMax, ResponseDto, ResponseModel, UserDetailsMax } from '@src/model/interface/response.interface'
import { ResponseCode, ResponseDescription } from '@src/provider/others/constant'

const createFamily = async(req: Request, res: Response) => {
    let reqData: CreateFamilyReq = req.body
    let response = <ResponseDto<FamilyDataResp>>{}

    try{
        response = await familyQuery.createFamilyQuery(reqData)
        console.log({createFamilyResponse: response})
        return res.send(response)
    }
    catch(err){
        response.responseCode = ResponseCode.CATCH_ERROR
        response.responseDescription = ResponseDescription.CATCH_ERROR
        response.exception = `${err} : createFamily handler`
        return res.send(response)
    } 
}

const searchFamily = async (req: Request, res: Response) => {
    let reqData: FamilySearchReq = req.body
    let response = <ResponseModel | ResponseDto<FamilyDetailsMax> | ResponseDto<FamilyDetails> | ResponseDto<UserDetailsMax[]>>{};

    try{
        if(reqData.searchType === '1'){
            response =  await familyQuery.searchFamilyByPhoneNumber(reqData.phoneNumber)
            return res.send(response)
        }
        if(reqData.searchType === '2'){
            response = await familyQuery.searchFamilyByFamilyDetails(reqData)
            return res.send(response)
        }
        if(reqData.searchType === '3'){
            response = await familyQuery.searchByFamilyName_homeTown(reqData.familyName)
            return res.send(response)
        }
        if(reqData.searchType === '4'){
            response =  await familyQuery.searchUserFamilyByUsername(reqData.userName)
            return res.send(response)
        }
    }
    catch(err){
        response.responseCode = ResponseCode.CATCH_ERROR
        response.responseDescription = ResponseDescription.CATCH_ERROR
        response.exception = `${err} : from searchFamily handler`
        return res.send(response)
    }
}


export default {
    createFamily,
    searchFamily
}