import express, {Request, Response, Router} from 'express';
import validateRequest from '@src/handler/middleware/validateRequest';
const router: Router = express.Router();
import userHandler from '@src/handler/route/userHandler';
router.use(validateRequest)

router.post('/create-user', userHandler.createUser)
router.post('/login', userHandler.login)

export default router;