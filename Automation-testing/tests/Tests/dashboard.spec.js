const { test, expect, chromium } = require('@playwright/test');
const LoginPage = require('../pages/LoginPage');
const DashboardPage = require('../pages/DashboardPage');
const testData = require('../utils/testData');
const AxeBuilder = require('@axe-core/playwright').default;

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
test('TC_DASH_017- Verify user can create a new project', async () => {

    await dashboard.openDashboard();

    await dashboard.createNewProject('Project');

});
test('TC_DASH_018 - Verify user can edit Hero section', async () => {

        await dashboard.openDashboard();

        // Create new project
        await dashboard.createNewProject('Project');

        // Edit Hero Section
        await dashboard.editHeroSection();

    });
    //Negative test cases

        test('TC-DASH-NEG-001 - Verify Dashboard handles API 500 gracefully', async ({ page }) => {
    
        await page.route('**/api/projects**', async route => {
            await route.fulfill({
                status: 500,
                contentType: 'application/json',
                body: JSON.stringify({
                })
            });
        });
    
        await dashboard.openDashboard();
    
        // Test fails if an error message is displayed
        await expect(
            page.getByText(/error|failed|try again|something went wrong/i)
        ).not.toBeVisible();
    });
     test('TC-DASH-NEG-002 - Verify project creation is blocked when Free plan limit is reached', async ({ page }) => {
    
        await dashboard.openDashboard();
    
        await dashboard.newProjectBtn.click();
    
        await dashboard.projectNameInput.fill('Test Project');
    
        await dashboard.startBuildingBtn.click();
    
    });
    test('TC-DASH-NEG-004 - Verify project name exceeding maximum character limit', async ({ page }) => {
    
        const longName = 'A'.repeat(300);
    
        await dashboard.openDashboard();
    
        await dashboard.newProjectBtn.click();
    
        await dashboard.projectNameInput.fill(longName);
    
        await dashboard.startBuildingBtn.click();
    
    });
    test('TC-DASH-NEG-007 - Verify search using a non-existing project name', async () => {
    
        await dashboard.openDashboard();
    
        await dashboard.searchProject('zzzNoMatch123');
    
        await dashboard.verifyNoProjectsFound();
    });
    
    test('TC-DASH-NEG-008 - Verify HTML/JavaScript injection in Search', async () => {
    
        await dashboard.openDashboard();
    
        await dashboard.searchProject('<script>alert(1)</script>');
    
        await dashboard.verifyNoProjectsFound();
    
        // Verify the page is still functional
        await expect(dashboard.searchInput).toBeVisible();
    });
    test('TC-DASH-NEG-009 - Verify rapid tab switching does not display incorrect data', async () => {

    await dashboard.openDashboard();

    await dashboard.clickDraft();
    await dashboard.clickPublished();
    await dashboard.clickDeleted();
    await dashboard.clickAll();
    await dashboard.clickDraft();
    await dashboard.clickPublished();
    await dashboard.clickAll();
});
     test('TC-DASH-NEG-012 - Verify session expiration during usage', async ({ page }) => {
    
        await page.evaluate(() => {
            localStorage.clear();
            sessionStorage.clear();
        });
    
        await page.reload();
    
        // Verify user is redirected to Login page
        await expect(page).toHaveURL(/login/);
    });
    test('TC-DASH-EDGE-015 - Verify dashboard behavior when Projects API response is delayed beyond timeout', async ({ page }) => {

    await page.route('**/api/projects**', async route => {

        await page.waitForTimeout(15000);

        await route.continue();

    });

    await dashboard.openDashboard();

    // Verify Dashboard loads successfully after delay
    await expect(dashboard.dashboardBtn).toBeVisible();
});
test('TC-DASH-EDGE-016 - Verify dashboard when project count is zero', async () => {

    await dashboard.openDashboard();
});
test('TC-DASH-EDGE-017 - Verify dashboard with maximum project count', async () => {

    await dashboard.openDashboard();

    // Verify Dashboard loads successfully
    await expect(dashboard.dashboardBtn).toBeVisible();

    // Verify search is available
    await expect(dashboard.searchInput).toBeVisible();

});
test('TC-DASH-EDGE-021 - Verify search with maximum input length', async () => {

    const longSearch = 'A'.repeat(500);

    await dashboard.openDashboard();

    await dashboard.searchProject(longSearch);

    // Verify search input accepts long text
    await expect(dashboard.searchInput).toHaveValue(longSearch);
});
test('TC-DASH-EDGE-024 - Verify Deleted tab when no deleted projects exist', async () => {

    await dashboard.openDashboard();

    await dashboard.clickDeleted();

    // Verify empty state
    await dashboard.verifyNoProjectsFound();
});
test('TC-DASH-EDGE-028 - Verify dashboard performance with 500 projects', async () => {

    const startTime = Date.now();

    await dashboard.openDashboard();

    const loadTime = Date.now() - startTime;

    expect(loadTime).toBeLessThan(3000);
});
test('TC-DASH-EDGE-018 - Verify project name with maximum allowed length', async () => {

    const projectName = 'A'.repeat(100);

    await dashboard.openDashboard();

    await dashboard.createNewProject(projectName);
});

test('TC-DASH-EDGE-019 - Verify project name containing special characters and emojis', async () => {

    const projectName = "My Site <>&%'💥";

    await dashboard.openDashboard();

    await dashboard.createNewProject(projectName);
});

test('TC-DASH-EDGE-022 - Verify search with leading and trailing spaces', async () => {

    await dashboard.openDashboard();

    await dashboard.searchProject('   First Project   ');

});

test('TC-DASH-EDGE-023 - Verify clearing search restores complete project list', async () => {

    await dashboard.openDashboard();

    await dashboard.searchProject('First Project');

    await dashboard.clearSearch();
});
test('TC-DASH-EDGE-029...', async ({ page }) => {

    await page.setViewportSize({
        width: 320,
        height: 640
    });

    await dashboard.openDashboard();

    await expect(dashboard.dashboardBtn).toBeVisible();
});
});