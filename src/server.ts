import express, { Application, Request, Response } from 'express'
import bodyParser from 'body-parser'
import helpers from '@src/utility/utility'
import constant from '@src/config'

const port: string | number = process.env.PORT || 5000
const app: Application = express()
app.use(bodyParser.json())

interface  ResponseDto {
    responseCode: string,
    responseDescription: string
}
interface RequestDto {
    name: string,
    message: string,
    graduate: boolean
}

interface customeResponse<T> extends ResponseDto {
    data: T
}

app.get('/', async (req: Request, res: Response) => {
    try{
        res.send(`Welcome to ${constant.platform}`)
    }
    catch(err: any) {
        res.send(`Something went wrong:  ${err}`)
    }
})


app.listen(port, () => console.log(`Server running on port ${port}`))