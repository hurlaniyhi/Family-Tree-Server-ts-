import mongoose from 'mongoose'
import { Family } from '@src/model/interface/utility.interface'


const familySchema = new mongoose.Schema<Family>({
    familyName: {
        type: String,
        required: true
    },
    country: {
        type: String,
        required: true
    },
    homeTown: {
        type: String,
        required: true
    },
    state: {
        type: String,
        required: true
    },
})

mongoose.model<Family>('Family', familySchema)