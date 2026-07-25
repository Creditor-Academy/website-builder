const { expect } = require('@playwright/test');

class SignUpPage {
    constructor(page) {
        this.page = page;

        // Buttons
        this.signUpHereBtn = page.getByRole('button', { name: 'Sign up here' });
        this.signUpBtn = page.getByRole('button', { name: 'Sign Up' });

        // Input Fields
        this.nameInput = page.getByRole('textbox', { name: 'John Doe' });
        this.emailInput = page.getByRole('textbox').nth(1);
        this.passwordInput = page.getByRole('textbox').nth(2);

        // Password Eye Icon (if available)
        this.eyeIcon = page.locator('svg').last();

        // Validation Messages
        this.nameError = page.getByText(/name/i);
        this.emailError = page.getByText(/email/i);
        this.passwordError = page.getByText(/password/i);
        this.emailExistsError = page.getByText(/already exists/i);

       // Validation Messages
this.invalidEmailError = page
    .getByRole('paragraph')
    .filter({ hasText: 'email: Invalid email address' });
    }

    async navigate() {
    await this.page.goto('/login');
}

    async openSignUp() {
        await this.signUpHereBtn.click();
    }

    async enterName(name) {
        await this.nameInput.fill(name);
    }

    async enterEmail(email) {
        await this.emailInput.fill(email);
    }

    async enterPassword(password) {
        await this.passwordInput.fill(password);
    }

    async clickSignUp() {
        await this.signUpBtn.click();
    }

    async signUp(name, email, password) {
        await this.openSignUp();
        await this.enterName(name);
        await this.enterEmail(email);
        await this.enterPassword(password);
        await this.clickSignUp();
    }

    async clearFields() {
        await this.nameInput.clear();
        await this.emailInput.clear();
        await this.passwordInput.clear();
    }
}

module.exports = SignUpPage;