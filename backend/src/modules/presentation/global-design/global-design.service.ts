import GlobalDesignDao from './global-design.dao.js';
import { NotFoundError, BadRequestError } from '../../../utils/error.utils.js';
import type { CreateGlobalSlotInput, UpdateGlobalDesignInput, UpdateGlobalSlotInput } from './global-design.validation.js';
import type { WebsiteWithIncludes } from '../../../types/website.types.js';

class GlobalDesignService {
    private dao: InstanceType<typeof GlobalDesignDao>;

    constructor() {
        this.dao = new GlobalDesignDao();
    }

    /**
     * Get global design for a website.
     * Returns null if not yet initialized.
     */
    async getGlobalDesign(websiteId: string) {
        return await this.dao.getByWebsiteId(websiteId);
    }

    /**
     * Update global styles on existing global design.
     */
    async updateGlobalDesign(websiteId: string, data: UpdateGlobalDesignInput) {
        const globalDesign = await this.dao.getByWebsiteId(websiteId);
        if (!globalDesign) {
            throw new NotFoundError('Global design not found. Initialize it first.');
        }

        if (!data.global_styles || Object.keys(data.global_styles).length === 0) {
            throw new BadRequestError('No valid fields to update');
        }

        return await this.dao.update(globalDesign.id, {
            global_styles: data.global_styles
        });
    }

    /**
     * Create global slot
     */
    async createGlobalSlot(websiteId: string, data: CreateGlobalSlotInput) {
        const globalDesign = await this.dao.getByWebsiteId(websiteId);

        return await this.dao.createGlobalSlot(globalDesign!.id, data);
    }

    /**
     * Update global slot
     */
    async updateGlobalSlot(website: WebsiteWithIncludes, slotId: string, data: UpdateGlobalSlotInput) {
        if (!website.globalDesign || website.globalDesign.id !== slotId) {
            throw new BadRequestError('WebsiteId not matched with slotId');
        }
        return await this.dao.updateGlobalSlot(slotId, data);
    }

    /**
     * Delete global slot
     */
    async deleteGlobalSlot(website: WebsiteWithIncludes, slotId: string) {
        if (!website.globalDesign || website.globalDesign.id !== slotId) {
            throw new BadRequestError('WebsiteId not matched with slotId');
        }
        return await this.dao.deleteGlobalSlot(slotId);
    }
}

export default GlobalDesignService;
