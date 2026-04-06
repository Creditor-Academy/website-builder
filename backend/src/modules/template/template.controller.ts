import type { Request, Response } from 'express';
import templateDao from './template.dao.js';

class TemplateController {

    // ═══════════════════════════════════════════════════════════════════════════
    // WEBSITE TEMPLATES
    // ═══════════════════════════════════════════════════════════════════════════

    /**
     * GET /templates/websites
     * Public — returns all active website templates grouped by category
     */
    getAllWebsiteTemplates = async (req: Request, res: Response) => {
        try {
            const templates = await templateDao.getAllWebsiteTemplates();

            // Group by category
            const grouped = templates.reduce((acc: Record<string, any[]>, t) => {
                const cat = t.category || 'General';
                if (!acc[cat]) acc[cat] = [];
                acc[cat].push(t);
                return acc;
            }, {});

            res.status(200).json({
                success: true,
                data: grouped,
            });
        } catch (error) {
            console.error('[TemplateController] getAllWebsiteTemplates:', error);
            res.status(500).json({ success: false, message: 'Failed to fetch templates' });
        }
    };

    /**
     * GET /templates/websites/:id
     * Admin only — full template data
     */
    getWebsiteTemplateById = async (req: Request, res: Response) => {
        try {
            const { id } = req.params;
            const template = await templateDao.getWebsiteTemplateById(id);

            if (!template) {
                return res.status(404).json({ success: false, message: 'Template not found' });
            }

            res.status(200).json({ success: true, data: template });
        } catch (error) {
            console.error('[TemplateController] getWebsiteTemplateById:', error);
            res.status(500).json({ success: false, message: 'Failed to fetch template' });
        }
    };

    /**
     * POST /templates/websites
     * Admin only — create a new website template
     */
    createWebsiteTemplate = async (req: Request, res: Response) => {
        try {
            const { name, description, category, image, global_styles, navbar, footer, home_layout } = req.body;

            const template = await templateDao.createWebsiteTemplate({
                name,
                description,
                category,
                image: image ?? null,
                global_styles: global_styles ?? {},
                navbar: navbar ?? {},
                footer: footer ?? {},
                home_layout: home_layout ?? {},
            });

            res.status(201).json({ success: true, data: template });
        } catch (error) {
            console.error('[TemplateController] createWebsiteTemplate:', error);
            res.status(500).json({ success: false, message: 'Failed to create template' });
        }
    };

    /**
     * PATCH /templates/websites/:id
     * Admin only — update an existing website template
     */
    updateWebsiteTemplate = async (req: Request, res: Response) => {
        try {
            const { id } = req.params;

            const existing = await templateDao.getWebsiteTemplateById(id);
            if (!existing) {
                return res.status(404).json({ success: false, message: 'Template not found' });
            }

            const updated = await templateDao.updateWebsiteTemplate(id, req.body);
            res.status(200).json({ success: true, data: updated });
        } catch (error) {
            console.error('[TemplateController] updateWebsiteTemplate:', error);
            res.status(500).json({ success: false, message: 'Failed to update template' });
        }
    };

    /**
     * DELETE /templates/websites/:id
     * Admin only — soft delete
     */
    deleteWebsiteTemplate = async (req: Request, res: Response) => {
        try {
            const { id } = req.params;

            const existing = await templateDao.getWebsiteTemplateById(id);
            if (!existing) {
                return res.status(404).json({ success: false, message: 'Template not found' });
            }

            await templateDao.deleteWebsiteTemplate(id);
            res.status(200).json({ success: true, message: 'Template deleted successfully' });
        } catch (error) {
            console.error('[TemplateController] deleteWebsiteTemplate:', error);
            res.status(500).json({ success: false, message: 'Failed to delete template' });
        }
    };

    /**
     * POST /templates/websites/:id/restore
     * Admin only — restore soft-deleted template
     */
    restoreWebsiteTemplate = async (req: Request, res: Response) => {
        try {
            const { id } = req.params;

            const existing = await templateDao.getWebsiteTemplateById(id);
            if (!existing) {
                return res.status(404).json({ success: false, message: 'Template not found' });
            }

            const restored = await templateDao.restoreWebsiteTemplate(id);
            res.status(200).json({ success: true, data: restored });
        } catch (error) {
            console.error('[TemplateController] restoreWebsiteTemplate:', error);
            res.status(500).json({ success: false, message: 'Failed to restore template' });
        }
    };

    // ═══════════════════════════════════════════════════════════════════════════
    // SECTION TEMPLATES
    // ═══════════════════════════════════════════════════════════════════════════

    /**
     * GET /templates/sections
     * Public — all active section templates grouped by category
     */
    getAllSectionTemplates = async (req: Request, res: Response) => {
        try {
            const sections = await templateDao.getAllSectionTemplates();

            const grouped = sections.reduce((acc: Record<string, any[]>, s) => {
                const cat = s.category || 'General';
                if (!acc[cat]) acc[cat] = [];
                acc[cat].push(s);
                return acc;
            }, {});

            res.status(200).json({ success: true, data: grouped });
        } catch (error) {
            console.error('[TemplateController] getAllSectionTemplates:', error);
            res.status(500).json({ success: false, message: 'Failed to fetch section templates' });
        }
    };

    /**
     * GET /templates/sections/:id
     * Auth required
     */
    getSectionTemplateById = async (req: Request, res: Response) => {
        try {
            const { id } = req.params;
            const section = await templateDao.getSectionTemplateById(id);

            if (!section) {
                return res.status(404).json({ success: false, message: 'Section template not found' });
            }

            res.status(200).json({ success: true, data: section });
        } catch (error) {
            console.error('[TemplateController] getSectionTemplateById:', error);
            res.status(500).json({ success: false, message: 'Failed to fetch section template' });
        }
    };

    /**
     * POST /templates/sections
     * Admin only
     */
    createSectionTemplate = async (req: Request, res: Response) => {
        try {
            const { name, category, props } = req.body;
            const section = await templateDao.createSectionTemplate({ name, category, props });
            res.status(201).json({ success: true, data: section });
        } catch (error) {
            console.error('[TemplateController] createSectionTemplate:', error);
            res.status(500).json({ success: false, message: 'Failed to create section template' });
        }
    };

    /**
     * PATCH /templates/sections/:id
     * Admin only
     */
    updateSectionTemplate = async (req: Request, res: Response) => {
        try {
            const { id } = req.params;

            const existing = await templateDao.getSectionTemplateById(id);
            if (!existing) {
                return res.status(404).json({ success: false, message: 'Section template not found' });
            }

            const updated = await templateDao.updateSectionTemplate(id, req.body);
            res.status(200).json({ success: true, data: updated });
        } catch (error) {
            console.error('[TemplateController] updateSectionTemplate:', error);
            res.status(500).json({ success: false, message: 'Failed to update section template' });
        }
    };

    /**
     * DELETE /templates/sections/:id
     * Admin only — soft delete
     */
    deleteSectionTemplate = async (req: Request, res: Response) => {
        try {
            const { id } = req.params;

            const existing = await templateDao.getSectionTemplateById(id);
            if (!existing) {
                return res.status(404).json({ success: false, message: 'Section template not found' });
            }

            await templateDao.deleteSectionTemplate(id);
            res.status(200).json({ success: true, message: 'Section template deleted successfully' });
        } catch (error) {
            console.error('[TemplateController] deleteSectionTemplate:', error);
            res.status(500).json({ success: false, message: 'Failed to delete section template' });
        }
    };

    /**
     * POST /templates/sections/:id/restore
     * Admin only
     */
    restoreSectionTemplate = async (req: Request, res: Response) => {
        try {
            const { id } = req.params;

            const existing = await templateDao.getSectionTemplateById(id);
            if (!existing) {
                return res.status(404).json({ success: false, message: 'Section template not found' });
            }

            const restored = await templateDao.restoreSectionTemplate(id);
            res.status(200).json({ success: true, data: restored });
        } catch (error) {
            console.error('[TemplateController] restoreSectionTemplate:', error);
            res.status(500).json({ success: false, message: 'Failed to restore section template' });
        }
    };
}

export default new TemplateController();