import prismaClient from '../../../config/prisma.js';
import type { GlobalDesign, GlobalSlot } from '@prisma/client';
import type { CreateGlobalSlotInput, UpdateGlobalSlotInput } from './global-design.validation.js';

class GlobalDesignDao {
    /**
     * Get global design by website ID (includes navbar + footer sections)
     */
    async getByWebsiteId(websiteId: string):
        Promise<GlobalDesign & { globalSlots: GlobalSlot[] } | null> {
        return await prismaClient.globalDesign.findFirst({
            where: { website_id: websiteId },
            include: {
                globalSlots: true
            }
        });
    }

    /**
     * Create global design
     */
    async createGlobalDesign(websiteId: string, data: { global_styles: any }): Promise<GlobalDesign> {
        return await prismaClient.globalDesign.create({
            data: {
                website_id: websiteId,
                ...data
            }
        });
    }

    /**
     * Update global design by its own ID
    */
    async update(globalDesignId: string, data: { global_styles: any }): Promise<GlobalDesign> {
        return await prismaClient.globalDesign.update({
            where: { id: globalDesignId },
            data,
            include: {
                globalSlots: true
            }
        });
    }

    /**
     * Create global slot
     */
    async createGlobalSlot(globalDesignId: string, data: CreateGlobalSlotInput): Promise<GlobalSlot> {
        return await prismaClient.globalSlot.create({
            data: {
                global_design_id: globalDesignId,
                ...data
            }
        });
    }

    /**
     * Update global slot
     */
    async updateGlobalSlot(globalDesignId: string, slotId: string, data: UpdateGlobalSlotInput): Promise<GlobalSlot> {
        return await prismaClient.globalSlot.update({
            where: { id: slotId, global_design_id: globalDesignId },
            data: {
                props: data.props!
            }
        });
    }

    /**
     * Delete global slot
     */
    async deleteGlobalSlot(globalDesignId: string, slotId: string): Promise<void> {
        await prismaClient.globalSlot.delete({
            where: { id: slotId, global_design_id: globalDesignId }
        });
    }
}

export default GlobalDesignDao;
