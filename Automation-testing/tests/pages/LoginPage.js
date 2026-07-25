const { expect } = require('@playwright/test');

class LoginPage {

    constructor(page) {
        this.page = page;

        this.emailInput = page.getByRole('textbox', { name: 'Input your email' });
        this.passwordInput = page.getByRole('textbox', { name: 'Input your password' });

        this.loginButton = page.getByRole('button', { name: 'Login' });

        this.rememberMe = page.getByRole('checkbox', { name: 'Remember Me' });

        this.eyeIcon = page.locator('svg').last();

        this.errorMessage = page.locator('.text-red-500');
    }

    async navigate() {
        await this.page.goto('http://localhost:8081/login');
    }

    async enterEmail(email) {
        await this.emailInput.fill(email);
    }

    async enterPassword(password) {
        await this.passwordInput.fill(password);
    }

    async clickLogin() {
        await this.loginButton.click();
    }

    async login(email, password) {
        await this.enterEmail(email);
        await this.enterPassword(password);
        await this.clickLogin();
    }

    // Login with leading and trailing spaces in email
    async loginWithEmailSpaces(email, password) {
        await this.enterEmail(`   ${email}   `);
        await this.enterPassword(password);
        await this.clickLogin();
    }

    // Login with leading and trailing spaces in password
    async loginWithPasswordSpaces(email, password) {
        await this.enterEmail(email);
        await this.enterPassword(`   ${password}   `);
        await this.clickLogin();
    }

    // Login with leading and trailing spaces in both email and password
    async loginWithSpaces(email, password) {
        await this.enterEmail(`   ${email}   `);
        await this.enterPassword(`   ${password}   `);
        await this.clickLogin();
    }

    async checkRememberMe() {
        await this.rememberMe.check();
    }

    async uncheckRememberMe() {
        await this.rememberMe.uncheck();
    }

    async togglePassword() {
        await this.eyeIcon.click();
    }

}

module.exports = LoginPage;