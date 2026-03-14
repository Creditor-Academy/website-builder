import type { WebsiteWithIncludes } from "./website.types";
import type { Page, PageTemplate, Section, SectionTemplate } from "@prisma/client";
import "express";

declare global {
  namespace Express {
    interface Request {
      validated: {
        body?: any;
        query?: any;
        params?: any;
      };
      context: {
        user: AuthUser;
        sessionId: string;

        website?: WebsiteWithIncludes;
        page?: Page;
        section?: Section;

        pageTemplate?: PageTemplate;
        sectionTemplate?: SectionTemplate;
      }
    }
  }
}

export { };
