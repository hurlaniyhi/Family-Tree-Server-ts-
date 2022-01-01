import {Request, Response, NextFunction} from 'express';
import { ResponseModel } from '@src/model/interface/response.interface'
import utility from '@src/provider/utility/utility'
import { ResponseCode, ResponseDescription } from '@src/provider/others/constant'
import helpers from '@src/provider/others/helpers'

export default (req: Request, res: Response, next: NextFunction) => {
    var response = <ResponseModel>{}
    console.log({path: req.path})
    switch(req.path) {
        case '/create-family': {
            let { familyName, homeTown, country, state} = req.body
            if(
                (!familyName || typeof familyName != 'string') || (!homeTown || typeof homeTown != 'string')
                || (!country || typeof country != 'string') || (!state || typeof state != 'string')
                ){
                    Object.assign(response, helpers.getResponse(ResponseCode.BAD_REQUEST))
                    return res.status(400).send(response)
            }
            req.body.familyName = utility.capitalizer(familyName.trim())
            req.body.homeTown = utility.capitalizer(homeTown.trim())
            req.body.state = utility.capitalizer(state.trim())
            req.body.country = utility.capitalizer(country.trim())
            console.log({reqBody: req.body})
            break;
        }
        case '/search-family': {
            let { phoneNumber, familyName, country, state, homeTown, userName, searchType } = req.body

            if(!searchType || typeof searchType !== 'string'){
                Object.assign(response, helpers.getResponse(ResponseCode.BAD_REQUEST))
                return res.status(400).send(response)
            }

            if(Number(searchType) > 4 || Number(searchType) < 1){
                Object.assign(response, helpers.getResponse(ResponseCode.BAD_REQUEST))
                return res.status(400).send(response)
            }

            if(
                (searchType === "1" && (!phoneNumber || typeof phoneNumber !== 'string'))
                || (searchType === "2" &&  (
                    (!familyName || typeof familyName != 'string') || (!homeTown || typeof homeTown != 'string')
                    || (!country || typeof country != 'string') || (!state || typeof state != 'string')
                ))
                || (searchType === "3" &&  (!familyName || typeof familyName != 'string'))
                || (searchType === "4" && (!userName || typeof userName != 'string'))
            ){
                Object.assign(response, helpers.getResponse(ResponseCode.BAD_REQUEST))
                return res.status(400).send(response)
            }

            req.body.familyName = req.body.familyName ? utility.capitalizer(familyName.trim()) : null
            req.body.homeTown = req.body.homeTown ? utility.capitalizer(homeTown.trim()) : null
            req.body.state = req.body.state ? utility.capitalizer(state.trim()) : null
            req.body.country = req.body.country ? utility.capitalizer(country.trim()) : null
            req.body.userName = req.body.userName ? utility.capitalizer(userName.trim()) : null
            console.log({reqBody: req.body})
            break;
        }
        case '/create-user': {
            let {
                firstName, lastName, email, password, phoneNumber, fatherName, familyId,
                fatherPhoneNo, motherName, motherPhoneNo, address, dateOfBirth, gender
            } = req.body

            if(
                (!firstName || typeof firstName != 'string') || (!lastName || typeof lastName != 'string')
                || (!email || typeof email != 'string') || (!password || typeof password != 'string')
                || (!phoneNumber || typeof phoneNumber != 'string') || (!fatherName || typeof fatherName != 'string')
                || (!familyId || typeof familyId != 'string') || (!fatherPhoneNo || typeof fatherPhoneNo != 'string')
                || (!motherName || typeof motherName != 'string') || (!motherPhoneNo || typeof motherPhoneNo != 'string')
                || (!address || typeof address != 'string') || (!dateOfBirth || typeof dateOfBirth != 'string')
                || (!gender || typeof gender != 'string')
                ){
                    Object.assign(response, helpers.getResponse(ResponseCode.BAD_REQUEST))
                    return res.status(400).send(response)
            }

            req.body.firstName = utility.capitalizer(firstName.trim())
            req.body.lastName = utility.capitalizer(lastName.trim())
            req.body.email = utility.capitalizer(email.trim())
            console.log({reqBody: req.body})
            break;
        }
        case '/login': {
            let {phoneNumber, password} = req.body

            if(
                (!phoneNumber || typeof phoneNumber != 'string') || (!password || typeof password != 'string')
            ){
                Object.assign(response, helpers.getResponse(ResponseCode.BAD_REQUEST))
                return res.status(400).send(response)
            }
            
            break;
        }
        default: {
            Object.assign(response, helpers.getResponse(ResponseCode.NOT_FOUND))
            return res.status(404).send(response)
        }
    }

    next()
}