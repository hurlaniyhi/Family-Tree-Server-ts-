import {Request, Response, NextFunction} from 'express';
import { ResponseModel } from '@src/model/interface/response.interface'
import utility from '@src/provider/utility/utility'
import { ResponseCode, ResponseDescription } from '@src/provider/others/constant'

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
                    response.responseCode = ResponseCode.BAD_REQUEST
                    response.responseDescription = ResponseDescription.BAD_REQUEST
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
                response.responseCode = "400"
                response.responseDescription = "Bad request. Kindly check your request parameters"
                return res.status(400).send(response)
            }

            if(Number(searchType) > 4 || Number(searchType) < 1){
                response.responseCode = ResponseCode.BAD_REQUEST
                response.responseDescription = ResponseDescription.BAD_REQUEST
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
                response.responseCode = ResponseCode.BAD_REQUEST
                response.responseDescription = ResponseDescription.BAD_REQUEST
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
        default: {
            response.responseCode = ResponseCode.NOT_FOUND
            response.responseDescription = ResponseDescription.NOT_FOUND
            return res.status(404).send(response)
        }
    }

    next()
}