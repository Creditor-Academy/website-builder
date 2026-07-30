const { expect } = require('@playwright/test');

class AssetsPage {
    constructor(page) {
        this.page = page;

        // Assets Navigation
        this.assetsBtn = page.getByRole('button', { name: 'Assets' });
        this.imagesTab = page.getByRole('tab', { name: 'Images' });
        this.videosTab = page.getByRole('tab', { name: 'Videos' });
        this.allAssetsTab = page.getByRole('tab', { name: 'All Assets' });

        // Add Assets
        this.addAssetsBtn = page.getByRole('button', { name: 'Add Assets' });
        this.uploadFromDisk = page.getByRole('menuitem', { name: 'Upload from Disk' });
        this.importFromUrl = page.getByRole('menuitem', { name: 'Import from URL' });

        // Import Form
        this.assetName = page.getByRole('textbox', { name: 'Asset Name' });
        this.mediaUrl = page.getByRole('textbox', { name: 'Media Source URL' });
        this.importAssetBtn = page.getByRole('button', { name: 'Import Asset' });

        // Search
        this.searchBox = page.getByRole('textbox', { name: 'Search assets...' });

        // Asset Actions
        this.copyLinkBtn = page.getByRole('button', { name: 'Copy Link' }).first();
        this.deleteBtn = page.getByRole('button', { name: 'Delete' }).first();
        // View Buttons
this.totalText = page.getByText('Total:');

// Add Assets
this.addAssetsBtn = page.getByRole('button', { name: 'Add Assets' });

// Total
this.totalText = page.getByText('Total:');

// Add Assets
this.addAssetsBtn = page.getByRole('button', { name: 'Add Assets' });

// Desktop View
this.desktopViewBtn = page.getByRole('button').filter({
    has: page.locator('.lucide-monitor')
});
this.fileInput = page.locator('input[type="file"]');
this.addAssetsBtn = page.getByRole('button', { name: 'Add Assets' });
this.desktopViewBtn = page.locator('.lucide.lucide-monitor > rect');
this.fileInput = page.locator('input[type="file"]');


        this.allAssetsTab = page.getByRole('tab', { name: 'All Assets' });
        this.imagesTab = page.getByRole('tab', { name: 'Images' });
        this.videosTab = page.getByRole('tab', { name: 'Videos' });

        this.searchBox = page.getByRole('textbox', { name: 'Search assets...' });

        this.addAssetsBtn = page.getByRole('button', { name: 'Add Assets' });
        this.emptyStateMessage = page.getByText(/No videos|No assets|No media/i);
        this.assetCards = page.locator('[data-testid="asset-card"]');
    }

    async openAssets() {
        await this.assetsBtn.click();
    }

    async openImages() {
        await this.imagesTab.click();
    }

    async openVideos() {
        await this.videosTab.click();
    }

    async openAllAssets() {
        await this.allAssetsTab.click();
    }

    async clickAddAssets() {
        await this.addAssetsBtn.click();
    }

    async uploadFromDisk() {
        await this.addAssetsBtn.click();
        await this.uploadFromDisk.click();
    }

    async importAssetFromUrl(name, url) {
        await this.addAssetsBtn.click();
        await this.importFromUrl.click();

        await this.assetName.fill(name);
        await this.mediaUrl.fill(url);

        await this.importAssetBtn.click();
    }

     async searchAsset(value) {
        await this.searchBox.fill(value);
    }

    async clickAddAssets() {
        await this.addAssetsBtn.click();
    }

    async openDesktopView() {
        await this.page.locator('.lucide-monitor').first().click({ force: true });
    }

    async uploadImage(filePath) {
        await this.fileInput.setInputFiles(filePath);
    }

    async uploadMultiple(files) {
        await this.fileInput.setInputFiles(files);
    }

    async copyFirstAssetLink() {
        await this.copyLinkBtn.click();
    }

    async deleteFirstAsset() {
        await this.deleteBtn.click();
    }

    async clickTotal() {
    await this.totalText.click();
}

async openDesktopView() {
    await this.desktopViewBtn.click();
}

async openTabletView() {
    await this.tabletViewBtn.click();
}

async openMobileView() {
    await this.mobileViewBtn.click();
}

async clickAddAssets() {
    await this.addAssetsBtn.click();
}
async clickTotal() {
    await this.totalText.click();
}

async clickAddAssets() {
    await this.addAssetsBtn.click();
}

async openDesktopView() {
    await this.desktopViewBtn.click();
}
async uploadAsset(filePath) {
    await this.fileInput.setInputFiles(filePath);
}
async clickAddAssets() {
    await this.addAssetsBtn.click();
}

async openDesktopView() {
    await this.desktopViewBtn.click();
}

async uploadImage() {
    await this.fileInput.setInputFiles('tests/Tests/OIP.jfif');
}

async uploadImageTwice() {
    await this.fileInput.setInputFiles('tests/Tests/OIP.jfif');
    await this.fileInput.setInputFiles('tests/Tests/OIP.jfif');
}

async verifyKeyboardAccessibility() {

    await this.allAssetsTab.focus();
    await expect(this.allAssetsTab).toBeFocused();

    await this.page.keyboard.press('ArrowRight');
    await expect(this.imagesTab).toBeFocused();

    await this.page.keyboard.press('ArrowRight');
    await expect(this.videosTab).toBeFocused();
}

 async verifyAccessibilityAttributes() {
        await expect(this.allAssetsTab).toHaveAttribute('role', 'tab');
        await expect(this.imagesTab).toHaveAttribute('role', 'tab');
        await expect(this.videosTab).toHaveAttribute('role', 'tab');

        await expect(this.searchBox).toHaveAttribute('placeholder', 'Search assets...');

        await expect(this.addAssetsBtn).toHaveAttribute('type', /button|submit/);
    }
}

module.exports = AssetsPage;