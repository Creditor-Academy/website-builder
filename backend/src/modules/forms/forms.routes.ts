import { Router } from 'express';
import { FormsController } from './forms.controller.js';
import { authenticate } from '../../middlewares/auth.middleware.js';
import { requireWebsiteOwnership } from '../../middlewares/resource-access.middleware.js';
import { validateRequest } from '../../middlewares/validation.middleware.js';
import { 
  submitFormSchema, 
  getSubmissionsQuerySchema, 
  formIdParamsSchema, 
  websiteIdParamsSchema 
} from './forms.validation.js';

const router = Router();
const controller = new FormsController();

// POST /forms/submit — Public endpoint for published site form submissions
// Does not require authentication or CSRF
router.post('/submit', 
  validateRequest(submitFormSchema),
  controller.submitForm
);

// GET /forms/websites/:id — List submissions for a website
router.get('/websites/:id',
  authenticate,
  validateRequest(websiteIdParamsSchema, 'params'),
  validateRequest(getSubmissionsQuerySchema, 'query'),
  requireWebsiteOwnership,
  controller.getWebsiteSubmissions
);

// PATCH /forms/:id/read — Mark submission as read
router.patch('/:id/read',
  authenticate,
  validateRequest(formIdParamsSchema, 'params'),
  controller.markAsRead
);

// DELETE /forms/:id — Delete a submission
router.delete('/:id',
  authenticate,
  validateRequest(formIdParamsSchema, 'params'),
  controller.deleteSubmission
);

export default router;
