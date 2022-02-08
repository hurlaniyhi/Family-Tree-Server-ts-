import mongoose from 'mongoose'
import bcrypt from 'bcrypt'
import { IUser, ChildData } from '@src/model/interface/request.interface'

const childSchema = new mongoose.Schema<ChildData>({
    name: String,
    childPhoneNo: String

})

const userSchema = new mongoose.Schema<IUser>({
    firstName: {
        type: String,
        required: true
    },
    lastName: {
        type: String,
        required: true
    },
    phoneNumber: {
        type: String,
        required: true,
        unique: true
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    fatherName: {
        type: String,
        required: true
    },
    fatherPhoneNo: {
        type: String,
        required: true
    },
    motherName: {
        type: String,
        required: true
    },
    motherPhoneNo: {
        type: String,
        required: true
    },
    address: {
        type: String,
        required: true
    },
    dateOfBirth: {
        type: String,
        required: true
    },
    gender: {
        type: String,
        required: true
    },
    registrationDate: {
        type: String,
        required: true
    },
    familyId: {
        type: String,
        required: true
    },
    profilePicture: {
        type: String,
        required: true
    },
    children: [childSchema],
    education: [String],
    workExperience: [String],
    interest: [String]
})

userSchema.pre('save', function(this: any, next: any) { 
    const user = this
    if(!user.isModified('password')){
        return next()
    }
    bcrypt.genSalt(10, (err: any, salt: string) => {
        if(err){
            return next(err) 
        }
        bcrypt.hash(user.password, salt, (err: any, hash: string)=>{
            if(err){
              return next(err)
            }
            user.password = hash
            next()
        })
    })
})

userSchema.methods.comparePassword = function comparePassword(userPassword: string){
    const user = this 

    return new Promise ((resolve, reject) => {
        bcrypt.compare(userPassword, this.password, (err: any, isMatch: any) => {
            if (err){
                return reject(err)
            }
            if(!isMatch){
                return reject(false)
            }
            if(isMatch){
                return resolve(true)
            }
            
        })
    })
}

mongoose.model<IUser>('User', userSchema)