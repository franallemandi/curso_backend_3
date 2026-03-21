import { Router} from 'express';
import mocksController from '../controllers/mocks.controller.js';

const router = Router();

router.get('/mockingusers', mocksController.getMockingUsers);
router.get('/:n', mocksController.getMockingUsers);

export default router;