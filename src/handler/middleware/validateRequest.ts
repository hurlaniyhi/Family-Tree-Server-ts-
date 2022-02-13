import {Request, Response, NextFunction} from 'express';
import { ResponseModel } from '@src/model/interface/response.interface'
import utility from '@src/provider/utility/utility'
import { constant, ResponseCode } from '@src/provider/others/constant'
import helpers from '@src/provider/others/helpers'


export default async(req: Request, res: Response, next: NextFunction) => {
    var response = <ResponseModel>{}
    console.log({path: req.path})

    switch(req.path) {
        case '/create-family': 
        case '/update-family-details': {
            let { familyName, homeTown, country, state} = req.body
            if(
                (!familyName || typeof familyName != 'string') || (!homeTown || typeof homeTown != 'string')
                || (!country || typeof country != 'string') || (!state || typeof state != 'string')
                ){
                    Object.assign(response, helpers.getResponse(ResponseCode.BAD_REQUEST))
                    return res.send(response)
            }

            if(req.path === '/update-family-details' && !req.body._id){
                response = helpers.getResponse(ResponseCode.BAD_REQUEST)
                return res.send(response)
            }
            req.body.familyName = utility.capitalizer(familyName.trim())
            req.body.homeTown = utility.capitalizer(homeTown.trim())
            req.body.state = utility.capitalizer(state.trim())
            req.body.country = utility.capitalizer(country.trim())
            //console.log({reqBody: req.body})
            break;
        }
        case '/search-family': {
            let { phoneNumber, familyName, country, state, homeTown, userName, searchType } = req.body
            console.log({payload: req.body})

            if(!searchType || typeof searchType !== 'string'){
                Object.assign(response, helpers.getResponse(ResponseCode.BAD_REQUEST))
                return res.send(response)
            }

            if(searchType > constant.SEARCHFAMILY_USERNAME || searchType < constant.SEARCHFAMILY_PHONENUMBER){
                Object.assign(response, helpers.getResponse(ResponseCode.BAD_REQUEST))
                return res.send(response)
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
                return res.send(response)
            }

            req.body.familyName = req.body.familyName ? utility.capitalizer(familyName.trim()) : null
            req.body.homeTown = req.body.homeTown ? utility.capitalizer(homeTown.trim()) : null
            req.body.state = req.body.state ? utility.capitalizer(state.trim()) : null
            req.body.country = req.body.country ? utility.capitalizer(country.trim()) : null
            req.body.userName = req.body.userName ? utility.capitalizer(userName.trim()) : null
            console.log({reqBody: req.body})
            break;
        }
        case '/create-user': 
        case '/update-user-details': {
            console.log({middleware: req.body})
            break;
        }
        case '/login': {
            let {phoneNumber, password} = req.body

            if(
                (!phoneNumber || typeof phoneNumber != 'string') || (!password || typeof password != 'string')
            ){
                Object.assign(response, helpers.getResponse(ResponseCode.BAD_REQUEST))
                return res.send(response)
            }

            break;
        }
        case '/send-otp': {
            let { email, emailType } = req.body

            if(
                (!email || typeof email != 'string') || (!emailType || typeof emailType != 'string') ||
                (emailType != constant.EMAIL_ONBOARDING && emailType != constant.EMAIL_FORGET_PASSWORD)
            ){
                Object.assign(response, helpers.getResponse(ResponseCode.BAD_REQUEST))
                return res.status(400).send(response)
            }

            req.body.email = email.trim()
            break;
        }
        case '/change-password': {
            let { email, password, phoneNumber} = req.body
            if(
                (!email || typeof email != 'string') ||  (!password || typeof password != 'string') ||  (!phoneNumber || typeof phoneNumber != 'string')
            ){
                Object.assign(response, helpers.getResponse(ResponseCode.BAD_REQUEST))
                return res.status(400).send(response)
            }
            
            req.body.email = email.trim()
            break;
        }
        default: {
            Object.assign(response, helpers.getResponse(ResponseCode.NOT_FOUND))
            return res.send(response)
        }
    }

    next()
}