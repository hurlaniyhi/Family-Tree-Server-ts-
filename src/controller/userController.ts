import express, {Router} from 'express';
import validateRequest from '@src/handler/middleware/validateRequest';
const router: Router = express.Router();
import userHandler from '@src/handler/route/userHandler';
router.use(validateRequest)

router.post('/create-user', userHandler.createUser)
router.post('/login', userHandler.login)
router.post('/send-otp', userHandler.sendOtp)
router.post('/change-password', userHandler.changePassword)

export default router;