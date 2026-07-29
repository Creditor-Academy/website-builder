const { test, expect } = require('@playwright/test');
const LoginPage = require('../pages/LoginPage');
const loginData = require('../utils/loginData');

test.describe('Login Page', () => {

    test.beforeEach(async ({ page }) => {
        const login = new LoginPage(page);
        await login.navigate();
    });

    test('TC_LOGIN_001 Verify Login page loads', async ({ page }) => {
        await expect(page).toHaveURL(/login/);
    });

    test('TC_LOGIN_002 Verify Email textbox is visible', async ({ page }) => {
        const login = new LoginPage(page);
        await expect(login.emailInput).toBeVisible();
    });

    test('TC_LOGIN_003 Verify Password textbox is visible', async ({ page }) => {
        const login = new LoginPage(page);
        await expect(login.passwordInput).toBeVisible();
    });

    test('TC_LOGIN_004 Verify Login button visible', async ({ page }) => {
        const login = new LoginPage(page);
        await expect(login.loginButton).toBeVisible();
    });

    test('TC_LOGIN_005 Login with valid credentials', async ({ page }) => {
        const login = new LoginPage(page);

        await login.login(
            loginData.validUser.email,
            loginData.validUser.password
        );

        await expect(page).not.toHaveURL(/login/);
    });

    test('TC_LOGIN_009 Empty Email', async ({ page }) => {
        const login = new LoginPage(page);

        await login.login(
            '',
            loginData.validUser.password
        );

        await expect(login.emailInput).toBeVisible();
    });

    test('TC_LOGIN_010 Empty Password', async ({ page }) => {
        const login = new LoginPage(page);

        await login.login(
            loginData.validUser.email,
            ''
        );

        await expect(login.passwordInput).toBeVisible();
    });

    test('TC_LOGIN_011 Empty Fields', async ({ page }) => {
        const login = new LoginPage(page);

        await login.clickLogin();

        await expect(login.loginButton).toBeVisible();
    });

    test('TC_LOGIN_013 Remember Me Checkbox', async ({ page }) => {
        const login = new LoginPage(page);

        await login.checkRememberMe();

        await expect(login.rememberMe).toBeChecked();
    });

    test('TC_LOGIN_014 Uncheck Remember Me', async ({ page }) => {
        const login = new LoginPage(page);

        await login.checkRememberMe();
        await login.uncheckRememberMe();

        await expect(login.rememberMe).not.toBeChecked();
    });

    test('TC_LOGIN_015 Password Visibility Toggle', async ({ page }) => {
        const login = new LoginPage(page);

        await login.enterPassword(loginData.validUser.password);
        await login.togglePassword();

        await expect(login.passwordInput).toHaveAttribute('type', 'text');
    });

    test('TC_LOGIN_016 Email accepts uppercase', async ({ page }) => {
        const login = new LoginPage(page);

        await login.enterEmail('USER@GMAIL.COM');

        await expect(login.emailInput).toHaveValue('USER@GMAIL.COM');
    });

    test('TC_LOGIN_017 Password accepts special characters', async ({ page }) => {
        const login = new LoginPage(page);

        await login.enterPassword('User@123!');

        await expect(login.passwordInput).toHaveValue('User@123!');
    });

    test('TC_LOGIN_020 Verify Login button enabled', async ({ page }) => {
        const login = new LoginPage(page);

        await expect(login.loginButton).toBeEnabled();
    });
    test('TC_LOGIN_021 - Verify login succeeds with leading and trailing spaces in Email', async ({ page }) => {
    const login = new LoginPage(page);

    await login.login(
        '   user@gmail.com   ',
        loginData.validUser.password
    );

    // Verify user is redirected after successful login
    await expect(page).not.toHaveURL(/login/);
});
test('TC_LOGIN_006 - Verify login fails with Invalid Email', async ({ page }) => {
    const login = new LoginPage(page);

    await login.login(
        loginData.invalidUser.email,
        loginData.validUser.password
    );
    await expect(page).toHaveURL(/login/);
});
test('TC_LOGIN_007 - Verify login fails with Invalid Password', async ({ page }) => {
    const login = new LoginPage(page);

    await login.login(
        loginData.validUser.email,
        loginData.invalidUser.password
    );
    await expect(page).toHaveURL(/login/);
});
test('TC_LOGIN_008 - Verify login fails with Invalid Email & Password', async ({ page }) => {
    const login = new LoginPage(page);

    await login.login(
        loginData.invalidUser.email,
        loginData.invalidUser.password
    );
    await expect(page).toHaveURL(/login/);
});
test('TC_LOGIN_022 - Verify login fails with leading and trailing spaces in Password', async ({ page }) => {
    const login = new LoginPage(page);

    await login.login(
        loginData.validUser.email,
        '   User@123   '
    );
    await expect(page).toHaveURL(/login/);
});
test('TC_LOGIN_012 - Verify login fails with invalid email', async ({ page }) => {
    const login = new LoginPage(page);

    await login.login(
        loginData.invalidEmail.email,
        loginData.invalidEmail.password
    );

    // Verify login is not successful
    await expect(page).toHaveURL(/login/);
});
test('TC_LOGIN_019 - Verify Email with spaces is rejected', async ({ page }) => {
    const login = new LoginPage(page);

    await login.login(
        loginData.spaces.email,
        loginData.spaces.password
    );

    // Verify user is not logged in
    await expect(page).toHaveURL(/login/);
})
test('TC_LOGIN_020 - Verify Login with password containing spaces', async ({ page }) => {
    const login = new LoginPage(page);

    await login.navigate();

    await login.loginWithPasswordSpaces(
        loginData.validUser.email,
        loginData.validUser.password
    );

    // Verify user is redirected to Dashboard
    await expect(page).toHaveURL(/dashboard/);
});
});