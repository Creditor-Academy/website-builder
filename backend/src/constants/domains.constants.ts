// List of reserved domain names that cannot be used
export const RESERVED_DOMAINS = [
    "www", "mail", "smtp", "ftp", "api", "docs", "blog", "support", "help", "admin", "dashboard",
    "portal", "login", "signup", "register", "signin", "signout", "oauth", "openid", "saml", "jwt",
    "token", "session", "auth", "authorize", "callback", "logout", "reset", "forgot", "verify",
    "confirm", "activate", "deactivate", "suspend", "resume", "cancel", "upgrade", "downgrade",
    "renew", "billing", "payment", "subscription", "plan", "pricing", "feature", "product", "service",
    "app", "application", "website", "site", "page", "post", "article", "blog", "news", "media", "image"
];

// Regex to validate domain name
export const DOMAIN_REGEX = /^[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

// 30 days in milliseconds
export const DELETED_DOMAIN_RETENTION_TIME = 30 * 24 * 60 * 60 * 1000;