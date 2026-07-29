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

    test('TC_TEMPLATE_001 Verify Complete Template Flow', async ({ page }) => {

        const template = new TemplatePage(page);

        // Open Templates
        await template.openTemplates();

        // Verify Categories
        await template.openBusiness();
        await template.openPortfolio();
        await template.openAll();

        // Search Template
        await template.searchTemplate('');

        // Use Template
        await template.useTemplate();

        // Open Hero Section
        await template.openHero();

        // Change Hero Layout & Style
        await template.selectLayout('Centered');
        await template.selectLayout('Video Background');
        await template.selectLayout('Minimal');
        await template.selectLayout('Bold Gradient');
        await template.selectLayout('Split Layout');
        await template.selectLayout('Centered');

        // Click Hero Heading
        await template.clickHeroHeading();

        // Update Description
        await template.updateDescription('Automation Testing');

        // Update Primary Button
        await template.updateButtonText('Get Started Paid');

        // Select External Link
        await template.selectExternalLink();

        // Update Button URL
        await template.updateButtonLink('https://example.com');

        // Verify Preview Button
        await template.previewButtonClick();

    });
    test('TC_TEMPLATE_002 Verify Call To Action Section', async ({ page }) => {

        const template = new TemplatePage(page);

        // Open Template
        await template.openTemplates();
        await template.useTemplate();

        // Call To Action Section
        await template.openCallToAction();

        // Layout & Style
        await template.selectCTALayout('Split CTA');
        await template.selectCTAStyle('Floating Card');

        // Content
        await template.updateCTATitle();
        await template.updateCTADescription();
        await template.updateCTAButtonText('Get Started');

        // Link Type
        await template.selectInternalLink();
        await template.selectEmailLink();
        await template.enterEmail('user@gmail.com');

        // Phone
        await template.selectPhoneLink();
        await template.enterPhone('1234567890');

        // Image
        await template.selectCTAImage();
        await template.insertImage();

        // Video
        await template.enterVideoURL('https://www.youtube.com/embed/demo');

        // Gradient
        await template.enableGradient();
        await template.updateGradient('linear-gradient(#667EEA,#764BA2)');

        // Border Radius
        await template.selectCurvedRadius();
        await template.selectMediumRadius();
        await template.selectSlightRadius();

        // Toggle
        await template.toggleAnimation();

        // Navigation
        await template.openAssets();
        await template.openPages();

    });
test('TC_TEMPLATE_002 Verify Call To Action Section End-to-End Functionality', async ({ page }) => {

        const template = new TemplatePage(page);

        /* ==========================
            Open Template
        ========================== */

        await template.openTemplates();

        await template.useTemplate();

        /* ==========================
            Call To Action Section
        ========================== */

        await template.openCallToAction();

        /* ==========================
            Layout
        ========================== */

        await template.selectLayout('Split CTA');

        /* ==========================
            Style
        ========================== */

        await template.selectBannerStyle();

        await template.selectFloatingCard();

        /* ==========================
            Content
        ========================== */

        await template.clickTitle();

        await template.clickDescription();

        await template.clickButtonText();

        /* ==========================
            Button Link
        ========================== */

        await template.selectInternalLink();

        await template.selectEmailLink('user@gmail.com');

        await template.selectPhoneLink('1234567890');

        /* ==========================
            Image
        ========================== */

        await template.uploadImage();

        /* ==========================
            Video
        ========================== */

        await template.enterVideoUrl(
            'https://www.youtube.com/embed/demo'
        );

        /* ==========================
            Gradient
        ========================== */

        await template.enableGradient();

        await template.clickGradientTextbox();

        /* ==========================
            Border Radius
        ========================== */

        await template.selectBorderRadius();

        /* ==========================
            Animation Toggle
        ========================== */

        await template.toggleSetting();

        /* ==========================
            Assets & Pages
        ========================== */

        await template.openAssets();

        await template.openPages();

        await template.clickPageButton();

    });
    test('TC-TMPL-020 Verify Responsive Template Grid', async ({ page }) => {

    const template = new TemplatePage(page);

    // Desktop
    await page.setViewportSize({ width: 1440, height: 900 });
    await template.openTemplates();
    await template.verifyDesktopGrid();

    // Tablet
    await page.setViewportSize({ width: 768, height: 1024 });
    await template.verifyTabletGrid();

    // Mobile
    await page.setViewportSize({ width: 375, height: 812 });
    await template.verifyMobileGrid();

});

    test('TC-TMPL-021 Verify Additional Templates Load on Scroll', async ({ page }) => {

    const template = new TemplatePage(page);

    await template.openTemplates();

    await template.verifyTemplatePagination();

});

});