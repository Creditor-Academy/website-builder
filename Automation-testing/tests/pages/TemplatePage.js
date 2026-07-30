const { expect } = require('@playwright/test');

class TemplatePage {

    constructor(page) {
        this.page = page;

        /* ==========================
           Template Navigation
        ========================== */

        this.templatesBtn = page.getByRole('button', { name: 'Templates' });
        this.businessBtn = page.getByRole('button', { name: 'Business' });
        this.portfolioBtn = page.getByRole('button', { name: 'Portfolio' });
        this.allBtn = page.getByRole('button', { name: 'All' });

        this.searchBox = page.getByRole('textbox', {
            name: 'Search templates...'
        });

        this.useTemplateBtn = page.getByText('Use Template').first();
        this.templatePopup = page.locator('.absolute.top-10');

        /* ==========================
           Hero Section
        ========================== */

        this.heroSection = page.getByRole('button', {
            name: 'Hero Full-screen hero section'
        }).first();

        this.layoutDropdown = page.getByRole('combobox').first();

        this.heroHeading = page.getByRole('heading', {
            name: 'Make sure Business Up'
        });

        this.heroDescription = page.locator('textarea');

        this.buttonText = page.getByRole('textbox').nth(2);

        this.buttonLink = page.getByRole('textbox', {
            name: 'https://example.com'
        }).first();

        this.linkTypeDropdown = page.getByRole('combobox').nth(1);

        this.externalOption = page.getByText('External');

        this.previewButton = page.getByRole('button', {
            name: 'Get Started Paid'
        });
        // CTA
this.callToAction = page.getByRole('button', {
    name: 'Call to Action Action-'
});

this.ctaLayout = page.getByRole('combobox').first();

this.ctaStyle = page.getByRole('combobox').first();

this.title = page.getByRole('textbox').first();

this.description = page.locator('textarea');

this.buttonText = page.getByRole('textbox').nth(2);

this.linkType = page.getByRole('combobox').nth(1);

this.internal = page.getByText('Internal');

this.email = page.getByText('Email');

this.phone = page.getByText('Phone');

this.emailTextbox = page.getByRole('textbox', {
    name: 'mailto:example@email.com'
});

this.phoneTextbox = page.getByRole('textbox', {
    name: 'tel:+'
});

this.imagePicker = page.getByRole('textbox', {
    name: 'https://...'
});

this.imageCard = page.locator('.inline-flex.items-center.justify-center.gap-2.whitespace-nowrap.rounded-lg.text-sm.font-medium.ring-offset-background.transition-all.duration-200.focus-visible\\:outline-none.focus-visible\\:ring-2.focus-visible\\:ring-ring.focus-visible\\:ring-offset-2.disabled\\:pointer-events-none.disabled\\:opacity-50.\\[\\&_svg\\]\\:pointer-events-none.\\[\\&_svg\\]\\:size-4.\\[\\&_svg\\]\\:shrink-0.relative.overflow-hidden.group.border-2');

this.selectImage = page.getByText('Select').first();

this.insertImageBtn = page.getByRole('button', {
    name: 'Insert into site (1)'
});

this.videoURL = page.getByRole('textbox', {
    name: 'https://www.youtube.com/embed/'
});

this.gradientSwitch = page.getByRole('switch').first();

this.gradientTextbox = page.getByRole('textbox', {
    name: 'linear-gradient(...)'
});

this.curvedBtn = page.getByRole('button', {
    name: '° Curved'
});

this.mediumBtn = page.getByRole('button', {
    name: '° Medium'
});

this.slightBtn = page.getByRole('button', {
    name: '° Slight'
});

this.animationSwitch = page.getByRole('switch').nth(1);

this.assetsTab = page.locator('#tour-nav-assets');

this.pagesTab = page.locator('#tour-nav-pages');

this.allTab = page.getByRole('button', {
    name: 'All'
});

this.businessTab = page.getByRole('button', {
    name: 'Business'
});

this.portfolioTab = page.getByRole('button', {
    name: 'Portfolio'
});

this.useTemplateBtn = page.getByText('Use Template').first();
 /* ==========================
           Content
        ========================== */

        this.titleTextbox = page.getByRole('textbox').first();

        this.descriptionTextbox = page.locator('textarea');

        this.buttonTextbox = page.getByRole('textbox').nth(2);

         /* ==========================
           Image
        ========================== */

        this.imageTextbox = page.getByRole('textbox', {
            name: 'https://...'
        });

        this.imageCard = page.locator(
            '.inline-flex.items-center.justify-center.gap-2.whitespace-nowrap.rounded-lg.text-sm.font-medium.ring-offset-background.transition-all.duration-200.focus-visible\\:outline-none.focus-visible\\:ring-2.focus-visible\\:ring-ring.focus-visible\\:ring-offset-2.disabled\\:pointer-events-none.disabled\\:opacity-50.\\[\\&_svg\\]\\:pointer-events-none.\\[\\&_svg\\]\\:size-4.\\[\\&_svg\\]\\:shrink-0.relative.overflow-hidden.group.border-2'
        );

        this.selectImageBtn = page.getByText('Select').first();

        this.insertImageBtn = page.getByRole('button', {
            name: 'Insert into site (1)'
        });

        /* ==========================
           Video
        ========================== */

        this.videoTextbox = page.getByRole('textbox', {
            name: 'https://www.youtube.com/embed/'
        });

        /* ==========================
           Gradient
        ========================== */

        this.gradientSwitch = page.getByRole('switch').first();

        this.gradientTextbox = page.getByRole('textbox', {
            name: 'linear-gradient(...)'
        });

        /* ==========================
           Border Radius
        ========================== */

        this.curvedBtn = page.getByRole('button', {
            name: '° Curved'
        });

        this.mediumBtn = page.getByRole('button', {
            name: '° Medium'
        });

        this.slightBtn = page.getByRole('button', {
            name: '° Slight'
        });

        /* ==========================
           Toggle
        ========================== */

        this.secondSwitch = page.getByRole('switch').nth(1);

        /* ==========================
           Navigation
        ========================== */

        this.assetsTab = page.locator('#tour-nav-assets');

        this.pagesTab = page.locator('#tour-nav-pages');

        this.pageButton = page.getByRole('button').nth(4);

        this.templateCards = this.page.locator('[class*="cursor-pointer"]');

        // Template Cards
this.templateCards = page.locator('[class*="cursor-pointer"]');

// Load More Button (if available)
this.loadMoreBtn = page.getByRole('button', {
    name: /load more/i
});
// Navigation
this.layersTab = page.locator('#tour-nav-layers');
this.designTab = page.locator('#tour-nav-design');
this.editTab = page.locator('#tour-nav-edit');
this.historyTab = page.locator('#tour-nav-history');
this.assetsTab = page.locator('#tour-nav-assets');

// Hero
this.heroSection = page.getByRole('button', { name: 'Hero Section hero' });
// Hero Content
    this.headingTextbox = page.getByRole('textbox').first();
    this.descriptionTextbox = page.locator('textarea');
    this.primaryButtonTextbox = page.getByRole('textbox').nth(2);
    this.secondaryButtonTextbox = page.getByRole('textbox').nth(4);
    // Primary Route
    this.primaryRouteDropdown = page.locator('div').filter({ hasText: /^None$/ }).first();
    this.externalOption = page.getByRole('option', { name: 'External Link' });

    this.primaryUrlTextbox = page.getByPlaceholder('https://example.com').first();

    // Secondary Route
    this.secondaryRouteDropdown = page.locator('div').filter({ hasText: /^None$/ }).nth(1);
    this.secondaryUrlTextbox = page.getByPlaceholder('https://example.com').nth(1);
    }

    /* ==========================
       Navigation
    ========================== */

    async openTemplates() {
        await this.templatesBtn.click();
    }

    async openBusiness() {
        await this.businessBtn.click();
    }

    async openPortfolio() {
        await this.portfolioBtn.click();
    }

    async openAll() {
        await this.allBtn.click();
    }

    async searchTemplate(value = '') {
        await this.searchBox.fill(value);
    }

    async useTemplate() {
        await this.useTemplateBtn.click();
        await this.templatePopup.click();
    }

    /* ==========================
       Hero
    ========================== */

    async openHero() {
        await this.heroSection.click();
    }

    async selectLayout(layout) {
        await this.layoutDropdown.click();
        await this.page.getByRole('option', { name: layout }).click();
    }

    async clickHeroHeading() {
        await this.heroHeading.click();
    }

    async updateDescription(text) {
        await this.heroDescription.fill(text);
    }

    async updateButtonText(text) {
        await this.buttonText.fill(text);
    }

    async selectExternalLink() {
        await this.linkTypeDropdown.click();
        await this.externalOption.click();
    }

    async updateButtonLink(url) {
        await this.buttonLink.fill(url);
    }

    async previewButtonClick() {
        await this.previewButton.click();
    }

    async openTemplates() {
        await this.templatesBtn.click();
    }

    async useTemplate() {
        await this.useTemplateBtn.click();
        await this.templatePopup.click();
    }

    async openCallToAction() {
        await this.callToAction.click();
    }

    async selectLayout(layout) {
        await this.layoutDropdown.click();
        await this.page.getByRole('option', { name: layout }).click();
    }

    async selectBannerStyle() {
        await this.layoutDropdown.click();
        await this.page.getByText('Banner Style').click();
    }

    async selectFloatingCard() {
        await this.layoutDropdown.click();
        await this.page.getByText('Floating Card').click();
    }

    async clickTitle() {
        await this.titleTextbox.click();
    }

    async clickDescription() {
        await this.descriptionTextbox.click();
    }

    async clickButtonText() {
        await this.buttonTextbox.click();
    }

    async selectInternalLink() {
        await this.linkTypeDropdown.click();
        await this.internalOption.click();
    }

    async selectEmailLink(email) {
        await this.linkTypeDropdown.click();
        await this.emailOption.click();
        await this.emailTextbox.fill(email);
    }

    async selectPhoneLink(phone) {
        await this.linkTypeDropdown.click();
        await this.phoneOption.click();
        await this.phoneTextbox.fill(phone);
    }

    async uploadImage() {
        await this.imageTextbox.click();
        await this.imageCard.click();
        await this.selectImageBtn.click();
        await this.insertImageBtn.click();
    }

    async enterVideoUrl(url) {
        await this.videoTextbox.fill(url);
    }

    async enableGradient() {
        await this.gradientSwitch.click();
    }

    async clickGradientTextbox() {
        await this.gradientTextbox.click();
    }

    async selectBorderRadius() {
        await this.curvedBtn.click();
        await this.mediumBtn.click();
        await this.slightBtn.click();
    }

    async toggleSetting() {
        await this.secondSwitch.click();
        await this.secondSwitch.click();
    }

    async openAssets() {
        await this.assetsTab.click();
    }

    async openPages() {
        await this.pagesTab.click();
    }

    async clickPageButton() {
        await this.pageButton.click();
    }
    async openTemplates() {
        await this.templatesBtn.click();
    }

    async useTemplate() {
        await this.useTemplateBtn.click();
        await this.templatePopup.click();
    }

    async openCallToAction() {
        await this.callToAction.click();
    }

    async selectLayout(layout) {
        await this.layoutDropdown.click();
        await this.page.getByRole('option', { name: layout }).click();
    }

    async selectBannerStyle() {
        await this.layoutDropdown.click();
        await this.page.getByText('Banner Style').click();
    }

    async selectFloatingCard() {
        await this.layoutDropdown.click();
        await this.page.getByText('Floating Card').click();
    }

    async clickTitle() {
        await this.titleTextbox.click();
    }

    async clickDescription() {
        await this.descriptionTextbox.click();
    }

    async clickButtonText() {
        await this.buttonTextbox.click();
    }

    async selectEmailLink(email) {
        await this.linkTypeDropdown.click();
        await this.emailOption.click();
        await this.emailTextbox.fill("user@gmail.com");
    }

    async selectPhoneLink(phone) {
        await this.linkTypeDropdown.click();
        await this.phoneOption.click();
        await this.phoneTextbox.fill("");
    }

    async uploadImage() {
        await this.imageTextbox.click();
        await this.imageCard.click();
        await this.selectImageBtn.click();
        await this.insertImageBtn.click();
    }

    async enterVideoUrl(url) {
        await this.videoTextbox.fill(url);
    }

    async enableGradient() {
        await this.gradientSwitch.click();
    }

    async clickGradientTextbox() {
        await this.gradientTextbox.click();
    }

    async selectBorderRadius() {
        await this.curvedBtn.click();
        await this.mediumBtn.click();
        await this.slightBtn.click();
    }

    async toggleSetting() {
        await this.secondSwitch.click();
        await this.secondSwitch.click();
    }

    async openAssets() {
        await this.assetsTab.click();
    }

    async openPages() {
        await this.pagesTab.click();
    }

    async clickPageButton() {
        await this.pageButton.click();
    }
    async verifyDesktopGrid() {
    await expect(this.templateCards.first()).toBeVisible();
}

async verifyTabletGrid() {
    await expect(this.templateCards.first()).toBeVisible();
}

async verifyMobileGrid() {
    await expect(this.templateCards.first()).toBeVisible();
}
async verifyTemplatePagination() {

    const initialCount = await this.templateCards.count();

    await this.page.mouse.wheel(0, 5000);

    await this.page.waitForTimeout(2000);

    if (await this.loadMoreBtn.isVisible().catch(() => false)) {
        await this.loadMoreBtn.click();
    }

    await this.page.waitForTimeout(2000);

    const finalCount = await this.templateCards.count();

    expect(finalCount).toBeGreaterThanOrEqual(initialCount);

}
async verifyKeyboardAccessibility() {

    // Navigate to All
    await this.page.keyboard.press('Tab');
    await expect(this.allTab).toBeFocused();

    // Navigate to Business
    await this.page.keyboard.press('Tab');
    await expect(this.businessTab).toBeFocused();

    // Navigate to Portfolio
    await this.page.keyboard.press('Tab');
    await expect(this.portfolioTab).toBeFocused();

    // Navigate to first template
    await this.page.keyboard.press('Tab');
    await expect(this.useTemplateBtn).toBeFocused();

    // Activate using keyboard
    await this.page.keyboard.press('Enter');

}
// Hero Section
async openHeroSection() {
    await this.layersTab.click();
    await this.heroSection.click();
}

// Hero Layout
async selectHeroLayout(option) {
    await this.layoutDropdown.click();
    await this.page.getByRole('option', { name: option }).click();
}

// Hero Content
async clickHeroHeadingTextbox() {
    await this.heroHeading.click();
}
async clickHeroDescriptionTextbox() {
    await this.descriptionTextbox.click();
}

async clickHeroPrimaryButtonTextbox() {
    await this.primaryButtonTextbox.click();
}

async clickHeroSecondaryButtonTextbox() {
    await this.secondaryButtonTextbox.click();
}

// ==========================
// Primary Button Route
// ==========================

async selectHeroPrimaryExternalLink() {
    await this.primaryRouteDropdown.click();
    await this.externalOption.click();
    await this.primaryUrlTextbox.fill('https://example.com');
}

// ==========================
// Secondary Button Route
// ==========================

async selectHeroSecondaryExternalLink() {
    await this.secondaryRouteDropdown.click();
    await this.externalOption.click();
}

async enterHeroSecondaryButtonUrl(url) {
    await this.secondaryUrlTextbox.fill("https://example.com");
}

// ==========================
// Hero Image
// ==========================

async selectHeroImage() {
    await this.imagePicker.click();
    await this.selectImageBtn.click();
}

async insertHeroImage() {
    await this.insertImageBtn.click();
}

// ==========================
// Hero Gradient
// ==========================

async enableHeroGradient() {
    await this.gradientSwitch.click();
}

async enterHeroGradient(gradient) {
    await this.gradientTextbox.fill(gradient);
}

// ==========================
// Hero Border Radius
// ==========================

async selectHeroSharpRadius() {
    await this.sharpRadius.click();
}

async selectHeroSlightRadius() {
    await this.slightRadius.click();
}

async selectHeroMediumRadius() {
    await this.mediumRadius.click();
}

async selectHeroCurvedRadius() {
    await this.curvedRadius.click();
}

// ==========================
// Hero Animation
// ==========================

async toggleHeroAnimation() {
    await this.animationSwitch.click();
}

// ==========================
// Hero Design
// ==========================

async openHeroDesign() {
    await this.designTab.click();
}

async applyModernBlueTheme() {
    await this.modernBlue.click();
}

async applyOceanTealTheme() {
    await this.oceanTeal.click();
}

async applySunriseRoseTheme() {
    await this.sunriseRose.click();
}

async applyElegantGrayTheme() {
    await this.elegantGray.click();
}

async applyNatureGreenTheme() {
    await this.natureGreen.click();
}

async applyMidnightDeepTheme() {
    await this.midnightDeep.click();
}

// ==========================
// Hero Edit
// ==========================

async openHeroEdit() {
    await this.editTab.click();
}

async updateHeroPrimaryButtonText(text) {
    await this.primaryButtonTextbox.fill(text);
}

// ==========================
// Hero History
// ==========================

async openHeroHistory() {
    await this.historyTab.click();
}

// ==========================
// Hero Assets
// ==========================

async openHeroAssets() {
    await this.assetsTab.click();
}

async openHeroImages() {
    await this.imagesTab.click();
}

async openHeroVideos() {
    await this.videosTab.click();
}

async openHeroAllAssets() {
    await this.allTab.click();
}
    

}

module.exports = TemplatePage;