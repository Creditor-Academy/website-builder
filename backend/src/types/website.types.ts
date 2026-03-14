import type { GlobalDesign, Website } from "@prisma/client";

export interface WebsiteWithIncludes extends Website {
    globalDesign?: GlobalDesign | null;
}