const { test, expect } = require('@playwright/test');
const LoginPage = require('../pages/LoginPage');
const loginData = require('../utils/loginData');

test.describe('Login Page', () => {

    let login;

    test.beforeEach(async ({ page }) => {
        login = new LoginPage(page);
        await login.navigate();
    });

    test('TC_LOGIN_024 - Verify login is not allowed with leading and trailing spaces in Email and Password', async ({ page }) => {

        await login.enterEmail('   user@gmail.com   ');
        await login.enterPassword('   User@123   ');

        await login.clickLogin();

        await expect(page).toHaveURL(/login/);
        await expect(login.errorMessage).toBeVisible();
    });

});