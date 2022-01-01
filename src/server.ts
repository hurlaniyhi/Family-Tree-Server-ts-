import '@src/model/dB/family'
import '@src/model/dB/user'
import express, { Application} from 'express'
import bodyParser from 'body-parser'
import helpers from '@src/provider/others/helpers'
import config from '@src/config/config'
import familyController from '@src/controller/familyController'
import userController from '@src/controller/userController'

const port: string|number = process.env.PORT || 5000 
const app:Application = express() 

app.use(bodyParser.json())
app.use("/family/", familyController)
app.use("/user/", userController)

helpers.connectToDatabase(config.dBConnectionString)

app.listen(port, ()=>{
    console.log(`Server is running on port ${port}`)
})