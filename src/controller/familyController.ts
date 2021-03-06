import express, {Router} from 'express';
import validateRequest from '@src/handler/middleware/validateRequest';
const router: Router = express.Router();
import familyHandler from '@src/handler/route/familyHandler';
router.use(validateRequest)

router.post('/create-family', familyHandler.createFamily)
router.post('/search-family', familyHandler.searchFamily)
router.post('/update-family-details', familyHandler.updateFamilyDetails)
    
export default router;