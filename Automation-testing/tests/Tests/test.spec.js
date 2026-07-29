const { test } = require('@playwright/test');
const LoginPage = require('../pages/LoginPage');
const TemplatePage = require('../pages/TemplatePage');
const data = require('../utils/testData');

test.describe('Template Module', () => {

    test.beforeEach(async ({ page }) => {

        const login = new LoginPage(page);

        await login.navigate();

        await login.login(
            data.validUser.email,
            data.validUser.password
        );

    });

   test('TC-TMPL-022 Verify Template Keyboard Accessibility', async ({ page }) => {

    const template = new TemplatePage(page);

    await template.openTemplates();

    await template.verifyKeyboardAccessibility();

});
}); 