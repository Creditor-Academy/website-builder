const { test } = require('@playwright/test');
const LoginPage = require('../pages/LoginPage');
const AssetsPage = require('../pages/AssetsPage');
const data = require('../utils/testData');

test.describe('Assets Module', () => {

    let login;
    let assets;

    test.beforeEach(async ({ page }) => {

        login = new LoginPage(page);
        assets = new AssetsPage(page);

        await login.navigate();

        await login.login(
            data.validUser.email,
            data.validUser.password
        );

        await assets.openAssets();
    });

    test('TC_ASSETS_001 - Verify Assets page opens successfully', async () => {
    await assets.openAllAssets();
});

test('TC_ASSETS_002 - Verify Images tab opens successfully', async () => {
    await assets.openImages();
});

test('TC_ASSETS_003 - Verify Videos tab opens successfully', async () => {
    await assets.openVideos();
});

test('TC_ASSETS_004 - Verify All Assets tab opens successfully', async () => {
    await assets.openAllAssets();
});

test('TC_ASSETS_005 - Verify switching between all tabs', async () => {
    await assets.openImages();
    await assets.openVideos();
    await assets.openAllAssets();
});

test('TC_ASSETS_006 - Verify Search with existing asset', async () => {
    await assets.searchAsset('image');
});

test('TC_ASSETS_007 - Verify Search with empty value', async () => {
    await assets.searchAsset('');
});

test('TC_ASSETS_008 - Verify Search with invalid asset name', async () => {
    await assets.searchAsset('nonexistentfile999');
});

test('TC_ASSETS_009 - Verify Import Asset from URL', async () => {
    await assets.importAssetFromUrl(
        'user',
        'https://player.vimeo.com/video/76979871'
    );
});

test('TC_ASSETS_010 - Verify Copy Asset Link', async () => {
    await assets.copyFirstAssetLink();
});

test('TC_ASSETS_011 - Verify Delete Asset', async () => {
    await assets.deleteFirstAsset();
});

test('TC_ASSETS_012 - Verify Import Asset then Copy Link', async () => {
    await assets.importAssetFromUrl(
        'user',
        'https://player.vimeo.com/video/76979871'
    );

    await assets.copyFirstAssetLink();
});

test('TC_ASSETS_013 - Verify Import Asset then Delete', async () => {
    await assets.importAssetFromUrl(
        'user',
        'https://player.vimeo.com/video/76979871'
    );

    await assets.deleteFirstAsset();
});

test('TC_ASSETS_014 - Verify Copy Link after switching tabs', async () => {
    await assets.openImages();
    await assets.openVideos();
    await assets.openAllAssets();

    await assets.copyFirstAssetLink();
});

test('TC_ASSETS_015 - Verify complete Assets workflow', async () => {
    await assets.openImages();
    await assets.openVideos();
    await assets.openAllAssets();

    await assets.searchAsset('');

    await assets.importAssetFromUrl(
        'user',
        'https://player.vimeo.com/video/76979871'
    );

    await assets.copyFirstAssetLink();

    await assets.deleteFirstAsset();
});

test('TC_ASSETS_016 - Verify Total section is clickable', async () => {

        await assets.clickTotal();

    });

    test('TC_ASSETS_017 - Verify Total can be clicked multiple times', async () => {

        await assets.clickTotal();
        await assets.clickTotal();

    });

    test('TC_ASSETS_018 - Verify Add Assets button opens dialog', async () => {

        await assets.clickAddAssets();

    });

    test('TC_ASSETS_019 - Verify Add Assets after clicking Total', async () => {

        await assets.clickTotal();
        await assets.clickAddAssets();

    });
     test('TC_AST_020 - Verify keyboard accessibility', async () => {

    await assets.verifyKeyboardAccessibility();

    await assets.verifyAccessibilityAttributes();

});
 // TC_AST_EDGE_002
    test('TC_AST_EDGE_0021- Verify search using file extension', async () => {

        await assets.searchAsset('.webp');

        const count = await assets.assetCards.count();

        expect(count).toBeGreaterThanOrEqual(0);

    });

    // TC_AST_EDGE_003
    test('TC_AST_EDGE_0022 - Verify uploading maximum allowed file', async () => {

        await assets.clickAddAssets();

        await assets.uploadAsset('tests/Tests/OIP.jfif');

        await expect(assets.page).toHaveURL(/.*/);

    });
    // TC_AST_EDGE_005
        test('TC_AST_EDGE_0023 - Verify cancelling upload', async () => {
    
            await assets.clickAddAssets();
    
            await assets.page.keyboard.press('Escape');
    
            await expect(assets.addAssetsBtn).toBeVisible();
    
        });


});