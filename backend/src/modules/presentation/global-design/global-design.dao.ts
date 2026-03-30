import prismaClient from '../../../config/prisma.js';
import type { GlobalDesign, GlobalSlot, Prisma } from '@prisma/client';
import type { CreateGlobalSlotInput, UpdateGlobalSlotInput } from './global-design.validation.js';

class GlobalDesignDao {
    /**
     * Get global design by ID (includes navbar + footer sections)
     */
    async getGlobalDesignById(globalDesignId: string):
        Promise<GlobalDesign & { globalSlots: GlobalSlot[] } | null> {
        return await prismaClient.globalDesign.findFirst({
            where: { id: globalDesignId },
            include: {
                globalSlots: true
            }
        });
    }

    // /**
    //  * Create global design
    //  */
    // async createGlobalDesign(websiteId: string, data: { global_styles: any }): Promise<GlobalDesign> {
    //     return await prismaClient.globalDesign.create({
    //         data: {
    //             website_id: websiteId,
    //             ...data
    //         }
    //     });
    // }

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
     * Get global slot by ID
     */
    async getGlobalSlotById(slotId: string, globalDesignId: string): Promise<GlobalSlot | null> {
        return await prismaClient.globalSlot.findUnique({
            where: { id: slotId, global_design_id: globalDesignId }
        });
    }

    /**
     * Create global slot
     */
    async createGlobalSlot(globalDesignId: string, data: CreateGlobalSlotInput): Promise<GlobalSlot> {
        return await prismaClient.globalSlot.create({
            data: {
                global_design_id: globalDesignId,
                type: data.type,
                section_template_id: data.section_template_id ?? null,
                props: data.props as Prisma.InputJsonValue
            }
        });
    }

    /**
     * Update global slot
     */
    async updateGlobalSlot(slotId: string, data: UpdateGlobalSlotInput): Promise<GlobalSlot> {
        return await prismaClient.globalSlot.update({
            where: { id: slotId },
            data: {
                props: data.props!
            }
        });
    }

    /**
     * Delete global slot
     */
    async deleteGlobalSlot(slotId: string): Promise<void> {
        await prismaClient.globalSlot.delete({
            where: { id: slotId }
        });
    }
}

export default GlobalDesignDao;
