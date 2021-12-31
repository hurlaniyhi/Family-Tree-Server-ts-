import mongoose from 'mongoose'
import nodemailer from 'nodemailer'
import { ResponseModel } from '@src/model/interface/response.interface'
import { ResponseCode, ResponseDescription } from '@src/provider/others/constant'
const { emailUser, emailPass, otpMailContent } = require('@src/config/config')

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
               user: emailUser,
               pass: emailPass
             },
           });
         
        let mailOptions = {
            from: `"Family Tree App" <newcoretechnologies@gmail.com>`, 
            to: receiver, 
            subject: "Account Verification", 
            html: `<div>
                    <p>${otpMailContent}</p>
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

export default {
    connectToDatabase,
    sendMail
}