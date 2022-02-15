import express, {Router} from 'express';
import validateRequest from '@src/handler/middleware/validateRequest';
import userHandler from '@src/handler/route/userHandler';
import helpers from '@src/provider/others/helpers'
import multer from 'multer'

const router: Router = express.Router();
const storage = helpers.getUploadStorage()
const upload = multer({storage})
router.use(validateRequest)

router.post('/create-user', upload.single('Picture'), userHandler.createUser)
router.post('/login', userHandler.login)
router.post('/send-otp', userHandler.sendOtp)
router.post('/change-password', userHandler.changePassword)
router.post('/update-user-details', upload.single('Picture'), userHandler.updateUserDetails)
router.get('/', (req, res) => {
    res.send("Welcome to Family Tree")
})

export default router;