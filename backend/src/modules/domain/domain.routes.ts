import express from 'express';
import DomainController from './domain.controller.js';
import { authenticate, authorize } from '../../middlewares/auth.middleware.js';
import { UserRole } from '@prisma/client';
import { validateRequest } from '../../middlewares/validation.middleware.js';
import {
    registerDomainSchema,
    domainIdParamsSchema,
    hostnameCheckQuerySchema,
    listDomainsQuerySchema,
    updateDomainSchema,
    websiteIdParamsSchema
} from './domain.validation.js';
import { requireWebsiteAccess } from '../../middlewares/resource-access.middleware.js';

const router = express.Router();
const domainController = new DomainController();

// GET /domains/check - Check if domain is available
router.get(
    '/check',
    validateRequest(hostnameCheckQuerySchema, 'query'),
    domainController.checkDomainAvailability
);

// All other routes require authentication
router.use(authenticate);

// GET /domains - Get all custom domains (Admin)
router.get(
    '/',
    authorize([UserRole.ADMIN]),
    validateRequest(listDomainsQuerySchema, 'query'),
    domainController.listAllCustomDomains
);

// GET /domains/website/:id - Get domain by website id
router.get(
    '/website/:id',
    validateRequest(websiteIdParamsSchema, 'params'),
    requireWebsiteAccess,
    domainController.getDomainsByWebsiteId
);

// POST /domains/website/:id - Register Custom domain
router.post(
    '/website/:id',
    validateRequest(websiteIdParamsSchema, 'params'),
    validateRequest(registerDomainSchema),
    requireWebsiteAccess,
    domainController.registerDomain
);

// PUT /domains/website/:id - Update Custom domain
router.put(
    '/website/:id',
    validateRequest(websiteIdParamsSchema, 'params'),
    validateRequest(updateDomainSchema),
    requireWebsiteAccess,
    domainController.updateDomain
);

// POST /domains/website/:id/verify - Verify Custom domain
router.post(
    '/website/:id/verify',
    validateRequest(websiteIdParamsSchema, 'params'),
    requireWebsiteAccess,
    domainController.verifyDomain
);

// DELETE /domains/website/:id - Delete custom domain
router.delete(
    '/website/:id',
    validateRequest(websiteIdParamsSchema, 'params'),
    requireWebsiteAccess,
    domainController.deleteDomain
);

export default router;