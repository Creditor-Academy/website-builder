import AuthService from '../modules/auth/auth.service.js';
import UserService from '../modules/user/user.service.js';
import TemplateService from '../modules/templates/template.service.js';
import PageService from '../modules/presentation/pages/page.service.js';
import WebsiteService from '../modules/website/website.service.js';

class CleanupService {
  private authService: AuthService;
  private userService: UserService;
  private websiteService: WebsiteService;
  private templateService: TemplateService;
  private pageService: PageService;

  constructor() {
    this.authService = new AuthService();
    this.userService = new UserService();
    this.websiteService = new WebsiteService();
    this.templateService = new TemplateService();
    this.pageService = new PageService();
  }

  // Method to clean up expired tokens
  // can be scheduled to run periodically using a scheduler (like node-cron)
  async cleanupExpiredTokens() {
    await this.authService.cleanupExpiredTokens();
  }

  // Method to clean up deleted user accounts
  async cleanupDeletedUsers() {
    await this.userService.cleanupDeletedUsers();
  }

  // Method to clean up deleted websites
  async cleanupDeletedWebsites() {
    await this.websiteService.cleanupDeletedWebsites();
  }

  // Method to clean up deleted templates
  async cleanupDeletedTemplates() {
    await this.templateService.cleanupDeletedTemplates();
  }

  // Method to clean up deleted pages
  async cleanupDeletedPages() {
    await this.pageService.cleanupDeletedPages();
  }
}

export default CleanupService;