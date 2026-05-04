# Buildora — AI Coding Style Guide

This document captures the coding conventions and style patterns used in the Buildora backend.
AI assistants should follow these patterns exactly when writing new code.

## TypeScript Style

### Imports Order
1. Node built-ins (`import path from 'path'`)
2. Third-party packages (`import express from 'express'`)
3. Internal absolute paths (`import prismaClient from '../../config/prisma.js'`)
4. Relative sibling imports (`import { MyService } from './my.service.js'`)
5. Type imports last (`import type { Request } from 'express'`)

### Naming Conventions
- **Files**: kebab-case with dot-separator for type: `website.controller.ts`, `redis-key.builder.ts`
- **Classes**: PascalCase: `WebsiteController`, `WebsiteService`, `WebsiteDao`
- **Functions**: camelCase: `createWebsite`, `listWebsites`
- **Constants**: SCREAMING_SNAKE_CASE: `CREATE_WEB_LIMIT`, `JWT_SECRET`
- **Types/Interfaces**: PascalCase: `AuthUser`, `JWTPayload`, `CreateWebsiteInput`
- **Enums (Prisma)**: PascalCase values: `SUPER_ADMIN`, `INSTITUTION_ADMIN`, `DRAFT`
- **Database fields**: snake_case: `owner_id`, `created_at`, `institution_id`
- **API routes**: kebab-case: `/api/v1/websites`, `/api/v1/forgot-password`

### Export Style
- **Default exports**: Controllers (class), DAO (class), Routes (router), Prisma client
- **Named exports**: Services (class), Validation schemas, Types, Utility functions, Middleware functions

### Error Messages
- User-facing: Plain English, no stack traces: `"Website not found"`, `"Email already in use"`
- Log messages: Include context: `req.log?.warn({ err, statusCode }, err.message)`

### Async Pattern
- All async functions in controllers use try/catch with `next(error)`
- Controller methods are arrow functions (for `this` binding)
- Services throw typed errors, don't catch them (let error middleware handle)

## Prisma Conventions

### Model Naming
- Models: PascalCase singular (`Website`, `User`, `FormSubmission`)
- Table mapping: snake_case plural (`@@map("websites")`, `@@map("form_submissions")`)
- Relations: camelCase (`ownedWebsites`, `sourceTemplate`, `formSubmissions`)

### Field Naming
- IDs: `id` (CUID default)
- Foreign keys: `<entity>_id` snake_case (`owner_id`, `website_id`, `institution_id`)
- Timestamps: `created_at`, `updated_at`, `deleted_at`
- Booleans: prefix with `is` when descriptive (`isActive`, `isVerified`, `is_spam`, `is_read`)

### JSON Fields
- Used for flexible/nested data: `content`, `snapshot`, `data`, `metadata`, `dns_records`, `logs`
- Always nullable or with defaults: `Json?` or `@default("{}")`
- Document the expected shape in comments above the field

## Zod Validation Conventions

### Schema Naming
- `create<Entity>Schema` — for POST requests
- `update<Entity>Schema` — for PATCH/PUT requests
- `list<Entity>QuerySchema` — for GET list endpoints (query params)
- `<entity>IdParamsSchema` — for route params with ID

### Type Export
- Always export inferred types alongside schemas:
  ```typescript
  export const createWebsiteSchema = z.object({ ... });
  export type CreateWebsiteInput = z.infer<typeof createWebsiteSchema>;
  ```

## API Route Conventions

### URL Structure
```
/api/v1/<resource>                    # Collection
/api/v1/<resource>/:id                # Single item
/api/v1/<resource>/:id/<sub-resource> # Nested resource
/api/v1/<resource>/:id/<action>       # Action on resource
```

### HTTP Methods
- `GET` — Read (list or single)
- `POST` — Create or action (publish, restore, duplicate)
- `PATCH` — Partial update
- `DELETE` — Soft delete
- `PUT` — Full replacement (used for templates currently)

### Response Structure
Always include a `message` field for mutations:
```json
{ "message": "Website created successfully", "website": { ... } }
```

For lists, use the plural resource name:
```json
{ "websites": [...] }
```
