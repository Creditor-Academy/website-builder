const { test, expect, chromium } = require('@playwright/test');
const LoginPage = require('../pages/LoginPage');
const DashboardPage = require('../pages/DashboardPage');
const testData = require('../utils/testData');

let browser;
let context;
let page;
let dashboard;

test.describe('Dashboard Module', () => {

    test.beforeAll(async () => {
        browser = await chromium.launch({ headless: false });

        context = await browser.newContext();
        page = await context.newPage();

        const login = new LoginPage(page);

        await login.navigate();
        await login.login(
            testData.validUser.email,
            testData.validUser.password
        );

        dashboard = new DashboardPage(page);
    });

    test.afterAll(async () => {
        await browser.close();
    });
    

test('TC_DASH_031 - Verify user can create a new project', async () => {

    await dashboard.openDashboard();

    await dashboard.createNewProject('Project');

});
});