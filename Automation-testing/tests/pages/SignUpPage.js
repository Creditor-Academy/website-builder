const { expect } = require('@playwright/test');

class SignUpPage {

    constructor(page) {
        this.page = page;

        // Buttons
        this.signUpHereBtn = page.getByRole('button', { name: 'Sign up here' });
        this.signUpBtn = page.getByRole('button', { name: 'Sign Up' });

        // Inputs
        this.nameInput = page.getByRole('textbox', { name: 'John Doe' });
        this.emailInput = page.getByRole('textbox').nth(1);
        this.passwordInput = page.getByRole('textbox').nth(2);

        // Validation Messages
        this.emailError = page.getByText(/Invalid email address/i);
        this.passwordError = page.getByText(/Password must/i);
        this.nameError = page.getByText(/Name must/i);
    }

    async navigate() {
        await this.page.goto('http://localhost:8081/login');
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

}

module.exports = SignUpPage;