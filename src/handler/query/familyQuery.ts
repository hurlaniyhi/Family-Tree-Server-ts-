import mongoose from"mongoose";
import { CreateFamilyReq, FamilySearchReq, IUser } from "@src/model/interface/request.interface";
import { FamilyDataResp, ResponseDto, FamilyDetails, FamilyDataRespMax, FamilyDetailsMax, UserDetailsMax } from '@src/model/interface/response.interface'
import { ResponseCode, ResponseDescription } from '@src/provider/others/constant'
import userQuery from '@src/handler/query/userQuery'
import utility from '@src/provider/utility/utility'

const Family = mongoose.model("Family");
const User = mongoose.model("User");

const createFamilyQuery = async (data: CreateFamilyReq): Promise<ResponseDto<FamilyDataResp>> => {
    const {familyName, homeTown, country, state} = data;
    var result = <ResponseDto<FamilyDataResp>>{}

    const checkExistence = await Family.findOne({familyName, homeTown, country, state})
    if(checkExistence){
        result.responseCode = ResponseCode.FOUND_RECORD
        result.responseDescription = ResponseDescription.FOUND_RECORD
      return result
    }
    
    try{
        const family = new Family({
          familyName,
          homeTown,
          country,
          state
        })
    
      await family.save()
        .then(doc => {
            result.responseCode = ResponseCode.SUCCESS
            result.responseDescription = ResponseDescription.SUCCESS
            result.data = (doc as FamilyDataResp)
        })
        .catch(err => {
            result.responseCode = ResponseCode.PROCESS_FAILED
            result.responseDescription = ResponseDescription.PROCESS_FAILED
            result.exception = `${err} : createFamily query`
        })
      
     return result;
    }
    catch(err){
        result.responseCode = ResponseCode.CATCH_ERROR
        result.responseDescription = ResponseDescription.CATCH_ERROR
        result.exception = `${err} : createFamily query`
        return result
    }
}

const searchFamilyByPhoneNumber = async (phoneNumber: string): Promise<ResponseDto<FamilyDetails>> => {
    let result = <ResponseDto<FamilyDetails>>{}
    try{
        let searchedUser  = (await User.findOne({phoneNumber}) as IUser|null)
        if(!searchedUser){
            result.responseCode = ResponseCode.NO_RECORD
            result.responseDescription = ResponseDescription.NO_RECORD
            return result;
        }
    
        const familyData = (await userQuery.getUserOtherDetails(searchedUser) as FamilyDetails)
      
        result.responseCode = ResponseCode.SUCCESS
        result.responseDescription = ResponseDescription.SUCCESS
        result.data = <FamilyDetails>{
            familyData: familyData.familyData, 
            familyMembers: familyData.familyMembers
        }
        return result;
      
    }
    catch(err){
        result.responseCode = ResponseCode.CATCH_ERROR
        result.responseDescription = ResponseDescription.CATCH_ERROR
        result.exception = `${err} : searchFamilyByPhoneNumber query`
        return result;
    }
  }

  const searchFamilyByFamilyDetails = async (req: FamilySearchReq): Promise<ResponseDto<FamilyDetailsMax>> => {
    let response = <ResponseDto<FamilyDetailsMax>>{}
    const {familyName, homeTown, country, state} = req
  
    try{
        const searchedFamilies = (await Family.find({$or:[{familyName, country, state},{homeTown, country, state}]}) as [FamilyDataResp])
        if(!searchedFamilies.length){
            response.responseCode = ResponseCode.NO_RECORD
            response.responseDescription = ResponseDescription.NO_RECORD
            return response;
        }
    
        response = (await getFamilyMembers(searchedFamilies) as ResponseDto<FamilyDetailsMax>)
        return response;
    }
    catch(err){
        response.responseCode = ResponseCode.CATCH_ERROR
        response.responseDescription = ResponseDescription.CATCH_ERROR
        response.exception = `${err} : searchFamilyByFamilyDetails query`
        return response;
    }
  }

  const searchByFamilyName_homeTown = async (familyName: string): Promise<ResponseDto<FamilyDetailsMax>> => {
    let response = <ResponseDto<FamilyDetailsMax>>{}

    try{
      const searchedFamilies = (await Family.find({$or:[{familyName},{homeTown: familyName}]}) as [FamilyDataResp])
      if(!searchedFamilies.length){
        response.responseCode = ResponseCode.NO_RECORD
        response.responseDescription = ResponseDescription.NO_RECORD
        return response;
      }
  
      response = (await getFamilyMembers(searchedFamilies) as ResponseDto<FamilyDetailsMax>)
      return response
    }
    catch(err){
        response.responseCode = ResponseCode.CATCH_ERROR
        response.responseDescription = ResponseDescription.CATCH_ERROR
        response.exception = `${err} : searchByFamilyName_homeTown query`
        return response;
    }
  }

  const searchUserFamilyByUsername = async (username: string): Promise<ResponseDto<UserDetailsMax[]>> => {
      let result = <ResponseDto<UserDetailsMax[]>>{}

    try{
      var usersData: Array<UserDetailsMax> = []
      let nameToArray: Array<string> = username.split(" ")
      
      if(nameToArray.length > 1){
        var [firstName, lastName] = nameToArray
        firstName = utility.capitalizer(firstName)
        lastName = utility.capitalizer(lastName)
  
        var users = (await User.find({ $or: [{ firstName, lastName }, { firstName: lastName, lastName: firstName }] }) as Array<IUser> | [])
        if(!users.length){
            result.responseCode = ResponseCode.NO_RECORD
            result.responseDescription = ResponseDescription.NO_RECORD
            return result;
        }
      }
      else{
        var users = (await User.find({$or:[{firstName: username}, {lastName: username}]}) as Array<IUser> | [])
        console.log({user: users})
        if(!users.length){
            result.responseCode = ResponseCode.NO_RECORD
            result.responseDescription = ResponseDescription.NO_RECORD
            return result;
        }
      }
  
      for(let user of users){
        const resp: FamilyDetails = await userQuery.getUserOtherDetails(user)
        const userData = {
          userData: user, familyData: resp.familyData, familyMembers: resp.familyMembers
        }
        usersData.push(userData as UserDetailsMax)
      }
      
      result.responseCode = ResponseCode.SUCCESS
      result.responseDescription = ResponseDescription.SUCCESS
      result.data = usersData
      return result
    }
    catch(err){
        result.responseCode = ResponseCode.CATCH_ERROR
        result.responseDescription = ResponseDescription.CATCH_ERROR
        result.exception = `${err} : searchUserFamilyByUsername query`
        return result;
    }
  }

  async function getFamilyMembers(families: Array<FamilyDataResp>): Promise<ResponseDto<FamilyDetailsMax>>{
      let result = <ResponseDto<FamilyDetailsMax>>{}
    let familiesData = []
  
    try{
        for(let family of families){
            const members = (await User.find({familyId: family._id}) as Array<IUser> | [])
            let familyDetail = ({
            _id: family._id, familyName: family.familyName, state: family.state, 
            homeTown: family.homeTown, country: family.country, familyMembers: members
            } as FamilyDataRespMax)
    
            familiesData.push(familyDetail)
        }
        
        result.responseCode = ResponseCode.SUCCESS
        result.responseDescription = ResponseDescription.SUCCESS
        result.data = { familiesData }
        return result;
    }
    catch(err){
        result.responseCode = ResponseCode.CATCH_ERROR
        result.responseDescription = ResponseDescription.CATCH_ERROR
        result.exception = `${err} : getFamilyMembers query`
        return result;
    }
  }
  


export default {
    createFamilyQuery,
    searchFamilyByPhoneNumber,
    searchFamilyByFamilyDetails,
    searchByFamilyName_homeTown,
    searchUserFamilyByUsername
}