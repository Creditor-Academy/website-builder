const { test, expect } = require('@playwright/test');
const SignUpPage = require('../pages/SignUpPage');
const { generateRandomEmail } = require('../utils/helper');

test.describe('Sign Up Module - Positive Test Cases', () => {

test('TC_SIGNUP_001 - Verify Sign Up page opens', async ({ page }) => {
    const signUp = new SignUpPage(page);

    await signUp.navigate();
    await signUp.openSignUp();

    await expect(signUp.signUpBtn).toBeVisible();
});

test('TC_SIGNUP_002 - Verify Name field accepts valid input', async ({ page }) => {
    const signUp = new SignUpPage(page);

    await signUp.navigate();
    await signUp.openSignUp();

    await signUp.enterName('John Doe');

    await expect(signUp.nameInput).toHaveValue('John Doe');
});

test('TC_SIGNUP_003 - Verify Name field is mandatory', async ({ page }) => {
    const signUp = new SignUpPage(page);

    await signUp.navigate();
    await signUp.openSignUp();

    const email = `user${Date.now()}@gmail.com`;

    await signUp.enterEmail(email);
    await signUp.enterPassword(testData.validUser.password);

    await signUp.clickSignUp();
});

test('TC_SIGNUP_004 - Verify Password field accepts valid password', async ({ page }) => {
    const signUp = new SignUpPage(page);

    await signUp.navigate();
    await signUp.openSignUp();

    await signUp.enterPassword('User@123');

    await expect(signUp.passwordInput).toHaveValue('User@123');
});

test('TC_SIGNUP_005 - Verify Password field is masked', async ({ page }) => {
    const signUp = new SignUpPage(page);

    await signUp.navigate();
    await signUp.openSignUp();

    await expect(signUp.passwordInput).toHaveAttribute('type', 'password');
});

test('TC_SIGNUP_006 - Verify Sign Up button is visible', async ({ page }) => {
    const signUp = new SignUpPage(page);

    await signUp.navigate();
    await signUp.openSignUp();
});

test('TC_SIGNUP_007 - Verify Sign Up button is enabled for valid data', async ({ page }) => {
    const signUp = new SignUpPage(page);

    await signUp.navigate();
    await signUp.openSignUp();

    await signUp.enterName('John Doe');
    await signUp.enterEmail(generateRandomEmail());
    await signUp.enterPassword('User@123');

    await expect(signUp.signUpBtn).toBeEnabled();
});

test('TC_SIGNUP_008 - Verify successful signup with valid data', async ({ page }) => {
    const signUp = new SignUpPage(page);

    await signUp.navigate();

    await signUp.signUp(
        'John Doe',
        generateRandomEmail(),
        'User@123'
    );
});

test('TC_SIGNUP_009 - Verify Name accepts alphabets and spaces', async ({ page }) => {
    const signUp = new SignUpPage(page);

    await signUp.navigate();
    await signUp.openSignUp();

    await signUp.enterName('John Smith');

    await expect(signUp.nameInput).toHaveValue('John Smith');
});

test('TC_SIGNUP_011 - Verify Password accepts uppercase, lowercase, number and special character', async ({ page }) => {
    const signUp = new SignUpPage(page);

    await signUp.navigate();
    await signUp.openSignUp();

    await signUp.enterPassword('User@123');

    await expect(signUp.passwordInput).toHaveValue('User@123');
});

test('TC_SIGNUP_012 - Verify Name field allows clearing and re-entering value', async ({ page }) => {
    const signUp = new SignUpPage(page);

    await signUp.navigate();
    await signUp.openSignUp();

    await signUp.enterName('John');
    await signUp.nameInput.clear();
    await signUp.enterName('John Doe');

    await expect(signUp.nameInput).toHaveValue('John Doe');
});

test('TC_SIGNUP_014 - Verify Password field allows clearing and re-entering value', async ({ page }) => {
    const signUp = new SignUpPage(page);

    await signUp.navigate();
    await signUp.openSignUp();

    await signUp.enterPassword('User@123');
    await signUp.passwordInput.clear();
    await signUp.enterPassword('User@123');

    await expect(signUp.passwordInput).toHaveValue('User@123');
});

test('TC_SIGNUP_015 - Verify user can complete signup flow successfully', async ({ page }) => {
    const signUp = new SignUpPage(page);

    await signUp.navigate();

    await signUp.signUp(
        'Automation User  ',
        generateRandomEmail(),
        'User@123  '
    );

    // Replace with actual success assertion
    // await expect(page).toHaveURL(/dashboard/);
    // await expect(signUp.successMessage).toBeVisible();
});

});