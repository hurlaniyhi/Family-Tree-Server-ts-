import dotenv from 'dotenv'

dotenv.config()

export default {
    emailUser: (process.env.EMAIL_USER as string),
    emailPass: (process.env.EMAIL_PASSWORD as string),
    dBConnectionString: (process.env.DB_CONNECTION_STRING as string),
    secretKey: (process.env.TOKEN_KEY as string),
    cloudName: (process.env.CLOUDINARY_CLOUD_NAME as string),
    cloudinaryApiKey: (process.env.CLOUDINARY_API_KEY as string),
    cloudinaryApiSecret: (process.env.CLOUDINARY_API_SECRET as string),
    otpMailContent: (process.env.OTP_MAIL_CONTENT as string)
}