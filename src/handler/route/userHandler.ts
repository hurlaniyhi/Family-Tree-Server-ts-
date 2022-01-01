import { Request, Response } from 'express'
import userQuery from '@src/handler/query/userQuery'
import { ForgetPasswordReq, IUser, LoginResp, SendOtpReq } from '@src/model/interface/request.interface'
import { ResponseDto, ResponseModel, UserDetailsMax } from '@src/model/interface/response.interface'
import helpers from '@src/provider/others/helpers'
import { constant, ResponseCode } from '@src/provider/others/constant'


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

const sendOtp = async (req: Request, res: Response) => {
   let reqData: SendOtpReq = req.body
    let response = <ResponseModel>{};
    try{

        if(reqData.emailType === constant.EMAIL_FORGET_PASSWORD){ 
            response = await userQuery.checkUserWithEmail(reqData.email)
            if(response.responseCode != ResponseCode.SUCCESS){ 
                return res.send(response)
            }
        }

        response = await helpers.sendMail(reqData.email)
        return res.send(response)
    }
    catch(err){
        Object.assign(response, helpers.catchError(`${err} : sendOtp handler`))
        return res.send(response)
    }
}

const changePassword = async (req: Request, res: Response) => {
    let reqData: ForgetPasswordReq = req.body
    let response = <ResponseModel>{}

    try{
        response = await userQuery.changePasswordQuery(reqData)
        return res.send(response)
    }
    catch(err){
        Object.assign(response, helpers.catchError(`${err} : changePassword handler`))
        return res.send(response)
    }
}

export default {
    createUser,
    login,
    sendOtp,
    changePassword
}