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
    async getGlobalDesign(globalDesignId: string) {
        return await this.dao.getGlobalDesignById(globalDesignId);
    }

    /**
     * Update global styles on existing global design.
     */
    async updateGlobalDesign(globalDesignId: string, data: UpdateGlobalDesignInput) {
        const globalDesign = await this.dao.getGlobalDesignById(globalDesignId);
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
    async createGlobalSlot(globalDesignId: string, data: CreateGlobalSlotInput) {
        return await this.dao.createGlobalSlot(globalDesignId, data);
    }

    /**
     * Update global slot
     */
    async updateGlobalSlot(globalDesignId: string, slotId: string, data: UpdateGlobalSlotInput) {
        const globalSlot = await this.dao.getGlobalSlotById(slotId, globalDesignId);
        if (!globalSlot) {
            throw new NotFoundError('Global slot not found for this website');
        }
        return await this.dao.updateGlobalSlot(slotId, data);
    }

    /**
     * Delete global slot
     */
    async deleteGlobalSlot(globalDesignId: string, slotId: string) {
        const globalSlot = await this.dao.getGlobalSlotById(slotId, globalDesignId);
        if (!globalSlot) {
            throw new NotFoundError('Global slot not found for this website');
        }
        return await this.dao.deleteGlobalSlot(slotId);
    }
}

export default GlobalDesignService;
