import { Request, Response } from 'express'
import userQuery from '@src/handler/query/userQuery'
import { CreateFamilyReq, FamilySearchReq, IUser, LoginResp } from '@src/model/interface/request.interface'
import { FamilyDetailsMax, ResponseDto, UserDetailsMax } from '@src/model/interface/response.interface'
import helpers from '@src/provider/others/helpers'


const createUser = async (req: Request, res: Response) => {
    let reqData: IUser = req.body
    let response = <ResponseDto<UserDetailsMax>>{}

    try{
        reqData.registrationDate = `${new Date().getDate()}/${new Date().getMonth()+1}/${new Date().getFullYear()}`

        response = await userQuery.createUserQuery(reqData)
        return res.send(response)
    }
    catch(err){
        Object.assign(response, helpers.catchError(`${err} : createUser handler`))
        return res.send(response)
    }
}

const login = async (req: Request, res: Response) => {
    let reqData: LoginResp = req.body
    let response;

    try{
        response = await userQuery.loginQuery(reqData)
        return res.send(response)
    }
    catch(err){
        Object.assign(response, helpers.catchError(`${err} : login handler`))
        return res.send(response)
    }
}

export default {
    createUser,
    login
}