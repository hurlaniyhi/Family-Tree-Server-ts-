import mongoose from 'mongoose'
import nodemailer from 'nodemailer'
import { ResponseModel, ResponseDto } from '@src/model/interface/response.interface'
import { IUser } from '@src/model/interface/request.interface'
import { ResponseCode, ResponseDescription } from '@src/provider/others/constant'
import config from '@src/config/config'
import utility from '@src/provider/utility/utility'
import multer from 'multer'
import fs from 'fs-extra';

const cloudinary = require('cloudinary').v2


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
                response = getResponse(ResponseCode.SUCCESS)
            })
            .catch(error => {
                console.log(error)
                response = getResponse(ResponseCode.PROCESS_FAILED, `${error} :  sendMail method`)
            })      
        return response
    }
    catch(err){
        response = catchErrorResponse(`${err} : sendMail method`)
        return response
    }
}

function validateFormData (req: any): ResponseDto<IUser>{
     let {
        firstName, lastName, email, password, phoneNumber, fatherName, familyId,
        fatherPhoneNo, motherName, motherPhoneNo, address, dateOfBirth, gender
    } = req.body

    if(!req.file) return getResponse(ResponseCode.BAD_REQUEST)
    if(req.file.size > 2000000) return getResponse(ResponseCode.LARGE_FILE)
    if(
        (!firstName || typeof firstName != 'string') || (!lastName || typeof lastName != 'string')
        || (!email || typeof email != 'string') || (!password || typeof password != 'string')
        || (!phoneNumber || typeof phoneNumber != 'string') || (!fatherName || typeof fatherName != 'string')
        || (!familyId || typeof familyId != 'string') || (!fatherPhoneNo || typeof fatherPhoneNo != 'string')
        || (!motherName || typeof motherName != 'string') || (!motherPhoneNo || typeof motherPhoneNo != 'string')
        || (!address || typeof address != 'string') || (!dateOfBirth || typeof dateOfBirth != 'string')
        || (!gender || typeof gender != 'string')
        ){
            return getResponse(ResponseCode.BAD_REQUEST)
    }

    req.body.firstName = utility.capitalizer(firstName.trim())
    req.body.lastName = utility.capitalizer(lastName.trim())
    req.body.email = email.trim()
    let result: ResponseDto<IUser> = getResponse(ResponseCode.SUCCESS)
    result.data = req.body
    return result
}

async function uploadPicture (req: any): Promise<ResponseDto<string>> {
    let result = <ResponseDto<string>>{}
    console.log({file: req.file})
    if(!req.file){
        result = getResponse(ResponseCode.PROCESS_FAILED)
        return result
    }

    try{
        cloudinary.config({
            cloud_name: config.cloudName,
            api_key: config.cloudinaryApiKey,
            api_secret: config.cloudinaryApiSecret
        })
        console.log("welcome to cloudinary")
        const path = req.file.path
        const uniqueFilename = new Date().toISOString()
        let imageData = await cloudinary.uploader.upload(
            path,
            {
                public_id: `blog/${uniqueFilename}`, tags: `blog`
            }
        )
        fs.unlinkSync(path)

        result = getResponse(ResponseCode.SUCCESS)
        result.data = imageData.secure_url
        return result
    }
    catch(err){
        result = catchErrorResponse(`${err} : from uploadPicture method`)
        return result
    }
}

function catchErrorResponse (exception: string, responseType?: string): ResponseModel {
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
    if(responseType === ResponseCode.SUCCESS){
        result.responseCode = ResponseCode.SUCCESS
        result.responseDescription = ResponseDescription.SUCCESS
    }
    if(responseType === ResponseCode.LARGE_FILE){
        result.responseCode = ResponseCode.LARGE_FILE
        result.responseDescription = ResponseDescription.LARGE_FILE
    }

    return result
}

function getUploadStorage(){
    const storage = multer.diskStorage({
        destination: function(req, file, cb){
            cb(null, 'uploads/')
        },
        filename: function(req, file, cb){
            cb(null, file.originalname)
        }
    }) 

    const dir = './uploads';
    fs.ensureDirSync(dir);
    return storage
}

export default {
    connectToDatabase,
    sendMail,
    catchErrorResponse,
    getResponse,
    validateFormData,
    uploadPicture,
    getUploadStorage
}