import mongoose from 'mongoose'
import nodemailer from 'nodemailer'
import { ResponseModel } from '@src/model/interface/response.interface'
import { ResponseCode, ResponseDescription } from '@src/provider/others/constant'
import config from '@src/config/config'

function connectToDatabase (connectionString: string): void{
    const mongoUri = connectionString

    mongoose.connect(mongoUri)
    mongoose.connection.on('connected', () => {
        console.log("connected to mongodb cloud")
    })

    mongoose.connection.on('error', (err: string) => {
        console.error("Error connecting to mongodb cloud", err)
    })
}

async function sendMail (receiver: string): Promise<ResponseModel>{
    let response = <ResponseModel>{}
    let otp: number = Math.floor(100000 + Math.random() * 900000)
    try{
        let transporter = nodemailer.createTransport({
            host: "smtp.gmail.com", 
            port: 465,
            secure: true,
             auth: {
               user: config.emailUser,
               pass: config.emailPass
             },
           });
         
        let mailOptions = {
            from: `"Family Tree App" <newcoretechnologies@gmail.com>`, 
            to: receiver, 
            subject: "Account Verification", 
            html: `<div>
                    <p>${config.otpMailContent}</p>
                    <p style="margin-bottom: 20px">Otp: <strong>${otp}</strong></p>
                    <p>Thank you.</p>
                </div>`
        };
        
        await transporter.sendMail(mailOptions)
            .then(info => {
                console.log("Message sent: %s", info.messageId);
                response.responseCode = ResponseCode.SUCCESS
                response.responseDescription = ResponseDescription.SUCCESS
            })
            .catch(error => {
                console.log(error)
                response.responseCode = ResponseCode.PROCESS_FAILED
                response.responseDescription = ResponseDescription.PROCESS_FAILED
                response.error = error
            })      
        return response
    }
    catch(err){
        response.responseCode = ResponseCode.CATCH_ERROR
        response.responseDescription = ResponseDescription.CATCH_ERROR
        response.exception = `${err} : from sendMail method`
        return response
    }
}

function catchError (exception: string, responseType?: string, ): ResponseModel {
    let result = <ResponseModel>{}
    if(responseType === ResponseCode.INVALID_USER){
        result.responseCode = ResponseCode.INVALID_USER
        result.responseDescription = ResponseDescription.INVALID_USER
        result.exception = exception
    }
    else{
        result.responseCode = ResponseCode.CATCH_ERROR
        result.responseDescription = ResponseDescription.CATCH_ERROR
        result.exception = exception
    }

    return result
}

function getResponse (responseType: string, error?: string): ResponseModel {
    let result = <ResponseModel>{}

    if(responseType === ResponseCode.FOUND_RECORD){
        result.responseCode = ResponseCode.FOUND_RECORD
        result.responseDescription = ResponseDescription.FOUND_RECORD
    }
    if(responseType === ResponseCode.PROCESS_FAILED){
        result.responseCode = ResponseCode.PROCESS_FAILED
        result.responseDescription = ResponseDescription.PROCESS_FAILED
        result.exception = error
    }
    if(responseType === ResponseCode.NO_RECORD){
        result.responseCode = ResponseCode.NO_RECORD
        result.responseDescription = ResponseDescription.NO_RECORD
    }
    if(responseType === ResponseCode.BAD_REQUEST){
        result.responseCode = ResponseCode.BAD_REQUEST
        result.responseDescription = ResponseDescription.BAD_REQUEST
    }
    if(responseType === ResponseCode.NOT_FOUND){
        result.responseCode = ResponseCode.NOT_FOUND
        result.responseDescription = ResponseDescription.NOT_FOUND
    }
    if(responseType === ResponseCode.INVALID_USER){
        result.responseCode = ResponseCode.INVALID_USER
        result.responseDescription = ResponseDescription.INVALID_USER
    }

    return result
}

export default {
    connectToDatabase,
    sendMail,
    catchError,
    getResponse
}