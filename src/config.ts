import dotenv from 'dotenv'

dotenv.config()

export default {
    platform: (process.env.PLATFORM as string)
}