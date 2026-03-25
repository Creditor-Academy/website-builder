import type { WebsiteWithIncludes } from "./website.types";
import type { Page, WebsiteTemplate, Section, SectionTemplate } from "@prisma/client";
import "express";

declare global {
  namespace Express {
    interface Request {
      validated: {
        body?: any;
        query?: any;
        params?: any;
        file?: Express.Multer.File;
        files?: Express.Multer.File[];
      };
      context: {
        user: AuthUser;
        sessionId: string;

        website?: WebsiteWithIncludes;
        page?: Page & { sections: Section[] };
        section?: Section;

        websiteTemplate?: WebsiteTemplate;
        sectionTemplate?: SectionTemplate;

        assetCategory?: string;
      }
    }
  }
}

export { };
