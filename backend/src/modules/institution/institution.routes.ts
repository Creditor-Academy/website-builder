import { Router } from 'express';
import InstitutionController from './institution.controller.js';
import { authenticate, authorize } from '../../middlewares/auth.middleware.js';

const router = Router();

// All organization management routes are restricted to SUPER_ADMIN
router.use(authenticate, authorize(['SUPER_ADMIN']));

router.post('/', InstitutionController.create);
router.get('/', InstitutionController.list);
router.get('/detailed', InstitutionController.listDetailed);
router.get('/:id', InstitutionController.getById);
router.put('/:id', InstitutionController.update);
router.delete('/:id', InstitutionController.delete);

export default router;
