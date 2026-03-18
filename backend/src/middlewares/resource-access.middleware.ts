import type { Request, Response, NextFunction } from 'express';
import WebsiteDao from '../modules/website/website.dao.js';
import PageDao from '../modules/presentation/pages/page.dao.js';
import SectionDao from '../modules/presentation/pages/section.dao.js';
import { UserRole, WebsiteStatus, type PageTemplate, type SectionTemplate } from '@prisma/client';
import TemplateDao from '../modules/templates/template.dao.js';

const websiteDao = new WebsiteDao();
const pageDao = new PageDao();
const sectionDao = new SectionDao();
const templateDao = new TemplateDao();

const canAccess = (user: { id: string; role: string }, website: { owner_id: string }): boolean => {
    return user.role === UserRole.ADMIN || website.owner_id === user.id;
};

/**
 * requireWebsiteAccess
 * For website CRUD routes: GET/PATCH/DELETE /websites/:id
 * Reads params.id, verifies ownership, attaches website to context.
 */
export const requireWebsiteAccess = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const user = req.context.user;
        const websiteId = req.validated.params.id;

        const website = await websiteDao.findWebsiteById(websiteId);
        if (!website) return res.status(404).json({ error: 'Website not found' });

        if (!canAccess(user, website)) {
            return res.status(403).json({ error: 'Access Denied' });
        }

        req.context.website = website;
        next();
    } catch (error: any) {
        console.error('Website Access Error:', error.message);
        res.status(500).json({ error: error.message });
    }
};

/**
 * resolveWebsiteDraft
 * For all presentation routes: /presentation/website/:websiteId/...
 * Reads params.websiteId, verifies ownership, resolves the current website and attaches website to context.
 */
export const resolveWebsiteDraft = (options?: { include_global_design?: boolean }) => {
    return async (req: Request, res: Response, next: NextFunction) => {
        try {
            const user = req.context.user;
            const websiteId = req.validated.params.websiteId;

            const result = await websiteDao.findWebsiteById(websiteId, options);
            if (!result || result.status === WebsiteStatus.DELETED)
                return res.status(404).json({ error: 'Website not found' });

            if (!canAccess(user, result)) {
                return res.status(403).json({ error: 'Access Denied' });
            }

            req.context.website = result;
            next();
        } catch (error: any) {
            console.error('resolveWebsiteDraft Error:', error.message);
            res.status(500).json({ error: error.message });
        }
    };
}

/**
 * validatePage
 * Verifies the page param (:id) belongs to the website already resolved
 * by resolveWebsiteDraft. Must run after resolveWebsiteDraft.
 */
export const validatePage = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const pageId = req.validated.params.id;

        const page = await pageDao.getPageById(pageId);
        if (!page) return res.status(404).json({ error: 'Page not found' });

        if (page.website_id !== req.context.website?.id) {
            return res.status(403).json({ error: 'Access Denied' });
        }

        req.context.page = page;
        next();
    } catch (error: any) {
        console.error('Page Access Error:', error.message);
        res.status(500).json({ error: error.message });
    }
};

/**
 * validateTemplate
 * Verifies template by ID and type (website | section).
 */
export const validateTemplate = (type: 'website' | 'section') => {
    return async (req: Request, res: Response, next: NextFunction) => {
        try {
            const templateId = req.validated.params.templateId;

            if (type === 'website') {
                const template = await templateDao.getWebsiteTemplateById(templateId);
                if (!template) return res.status(404).json({ error: 'Template not found' });
                req.context.websiteTemplate = template;
            } else {
                const template = await templateDao.getSectionTemplateById(templateId);
                if (!template) return res.status(404).json({ error: 'Template not found' });
                req.context.sectionTemplate = template;
            }

            next();
        } catch (error: any) {
            console.error('Template Access Error:', error.message);
            res.status(500).json({ error: error.message });
        }
    };
};
