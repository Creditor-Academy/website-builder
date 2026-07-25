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

    test('TC_DASHBOARD_001 Verify Dashboard opens successfully', async () => {
        await dashboard.openDashboard();
    });
    test('TC_DASHBOARD_002 - Verify Search project', async () => {
            await dashboard.openDashboard();
            await dashboard.searchProject('First Project');
        });
    
    test('TC_DASHBOARD_003 - Verify Clear search', async () => {
            await dashboard.openDashboard();
            await dashboard.searchProject('First Project');
            await dashboard.clearSearch();
        });
     test('TC_DASHBOARD_004 - Verify Sort by Recent', async () => {
            await dashboard.openDashboard();
            await dashboard.sortByRecent();
        });

    test('TC_DASHBOARD_005 Verify Sort by Name', async () => {
        await dashboard.openDashboard();
        await dashboard.sortByName();
    });

    test('TC_DASHBOARD_006 Verify Draft filter', async () => {
        await dashboard.openDashboard();
        await dashboard.clickDraft();
    });

    test('TC_DASHBOARD_007 Verify Published filter', async () => {
        await dashboard.openDashboard();
        await dashboard.clickPublished();
    });

    test('TC_DASHBOARD_008 Verify Deleted filter', async () => {
        await dashboard.openDashboard();
        await dashboard.clickDeleted();
    });

    test('TC_DASHBOARD_009 Verify All filter', async () => {
        await dashboard.openDashboard();
        await dashboard.clickAll();
    });

    test('TC_DASHBOARD_0010 Verify New Project popup opens', async () => {
        await dashboard.openDashboard();
        await dashboard.newProjectBtn.click();
        await expect(dashboard.projectNameInput).toBeVisible();
    });
    test('TC_DASH_0011 - Verify search with non-matching term shows empty state', async () => {
    
        await dashboard.openDashboard();
    
        await dashboard.searchProject('zzzNoMatch123');
    
        await dashboard.verifyNoProjectsFound();
    
    });
    
    
    // TC_DASH_010
    test('TC_DASH_012 - Verify search input sanitizes special characters', async () => {
    
        await dashboard.openDashboard();
    
        await dashboard.searchProject('<script>alert(1)</script>');
    
        await dashboard.verifyNoProjectsFound();
    
    });
    test('TC_DASH_013 - Verify Project Hub layout adapts on tablet/mobile', async () => {

    await page.setViewportSize({ width: 768, height: 1024 });

    await dashboard.openDashboard();

    await expect(dashboard.dashboardBtn).toBeVisible();
    await expect(dashboard.searchInput).toBeVisible();

    await page.setViewportSize({ width: 375, height: 812 });

    await expect(dashboard.dashboardBtn).toBeVisible();
    await expect(dashboard.searchInput).toBeVisible();
});
test('TC_DASH_014 - Verify dashboard loads within acceptable time', async () => {

    const startTime = Date.now();

    await dashboard.openDashboard();

    await dashboard.searchInput.waitFor({
        state: 'visible'
    });

    const loadTime = Date.now() - startTime;

    expect(loadTime).toBeLessThan(3000);
});
test('TC_DASH_015 - Verify dashboard content loads successfully', async () => {

    await dashboard.openDashboard();

    await dashboard.searchInput.waitFor({
        state: 'visible'
    });

    await expect(dashboard.searchInput).toBeVisible();
});
test('TC_DASH_016 - Verify keyboard accessibility', async () => {

    await dashboard.openDashboard();

    await dashboard.newProjectBtn.focus();
    await expect(dashboard.newProjectBtn).toBeFocused();

    await dashboard.searchInput.focus();
    await expect(dashboard.searchInput).toBeFocused();

    await dashboard.sortDropdown.focus();
    await expect(dashboard.sortDropdown).toBeFocused();

});
    });