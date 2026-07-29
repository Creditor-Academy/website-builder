const { expect } = require('@playwright/test');

class DashboardPage {
    constructor(page) {
        this.page = page;

        // Navigation
        this.dashboardBtn = page.getByRole('button', { name: 'Dashboard' });

        // Sorting
        this.sortDropdown = page.getByRole('combobox');
        this.nameOption = page.getByRole('option', { name: 'Name' });

        // Filter
        this.filterIcon = page.locator('.absolute.left-2').first();

        this.draftBtn = page.getByRole('button', { name: 'Draft' });
        this.publishedBtn = page.getByRole('button', { name: 'Published' });
        this.deletedBtn = page.getByRole('button', { name: 'Deleted' });
        this.allBtn = page.getByRole('button', { name: 'All' });

        // New Project
        this.newProjectBtn = page.getByRole('button', { name: 'New Project' });
        this.projectNameInput = page.getByRole('textbox', {
            name: 'e.g., My Awesome Site'
        });

        this.businessCategory = page
            .locator('div')
            .filter({ hasText: /^BusinessBusiness$/ })
            .first();

        this.startBuildingBtn = page.getByRole('button', {
            name: 'Start Building'
        });

        // Walkthrough
        this.gotItBtn = page.getByRole('button', { name: 'Got it!' });
        this.nextStep = page.locator('.p-3').first();

        this.startCreatingBtn = page.getByRole('button', {
            name: 'Start Creating'
        });
         this.searchInput = page.getByRole('textbox', { name: 'Search projects...' });

        this.sortDropdown = page.getByRole('combobox');
        this.recentOption = page.getByRole('option', { name: 'Recent' });
        this.nameOption = page.getByRole('option', { name: 'Name' });

        this.newProjectBtn = page.getByRole('button', { name: 'New Project' });
        this.projectNameInput = page.getByRole('textbox', {
            name: 'e.g., My Awesome Site'
        });

        this.startBuildingBtn = page.getByRole('button', {
            name: 'Start Building'
        });

        this.gotItBtn = page.getByRole('button', { name: 'Got it!' });

        this.startCreatingBtn = page.getByRole('button', {
            name: 'Start Creating'
        });

        this.publishSiteBtn = page.getByRole('button', {
            name: 'Publish Site'
        });

        this.publishWebsiteBtn = page.getByRole('button', {
            name: 'Publish Website'
        });

        this.subdomainInput = page.getByRole('textbox', {
            name: 'Buildora Subdomain'
        });
        // ---------------- Sort ----------------
this.sortDropdown = page.getByRole('combobox');

this.recentOption = page.getByRole('option', {
    name: 'Recent'
});

this.nameOption = page.getByRole('option', {
    name: 'Name'
});

// ---------------- Filter Tabs ----------------
this.allBtn = page.getByRole('button', {
    name: 'All'
});

this.draftBtn = page.getByRole('button', {
    name: 'Draft'
});

this.publishedBtn = page.getByRole('button', {
    name: 'Published'
});

this.deletedBtn = page.getByRole('button', {
    name: 'Deleted'
});
// ---------------- Plan Limit ----------------
// Change text according to your application
this.planLimitMessage = page.getByText(/limit|upgrade|plan/i);

// ---------------- Project Cards ----------------
this.projectCards = page.locator('.project-card'); // Update selector if needed

this.projectTitle = page.locator('.project-card h3');

this.projectStatusBadge = page.locator('.status-badge');

this.projectDate = page.locator('.project-date');

// ---------------- Stats Cards ----------------
this.totalWebsiteCard = page.getByText('Total Websites');

this.templateCard = page.getByText('Templates Available');

// ---------------- Empty State ----------------
this.emptyState = page.getByText('No projects found');

// Search
this.searchInput = page.getByRole('textbox', {
    name: 'Search projects...'
});

// Empty State
this.noProjectsFound = page.getByText('No projects found'); // Update if your application uses different text

// Project Cards
this.projectCards = page.locator('.project-card'); // Replace with actual project card locator
this.noProjectsFound = page.getByText('No projects found');
// Sidebar
this.sidebar = page.locator('aside');

// Project Grid
this.projectGrid = page.locator('.grid');

// Project Cards
this.projectCards = page.locator('.project-card');

// Skeleton Loader
this.skeletonLoader = page.locator('.animate-pulse');

// Empty State
this.emptyStateTitle = page.getByText(/No projects|Create your first project/i);

// Keyboard Navigation
this.searchInput = page.getByRole('textbox', {
    name: 'Search projects...'
});

this.newProjectBtn = page.getByRole('button', {
    name: 'New Project'
});

this.firstProjectCard = this.projectCards.first();

// Builder Locators
this.heroSection = page.getByRole('button', {
    name: 'Hero Full-screen hero section'
}).first();

this.heroHeading = page.getByRole('textbox').first();

this.heroDescription = page.locator('textarea');

this.buttonText = page.getByRole('textbox').nth(2);

this.buttonType = page.getByRole('combobox').nth(1);

this.externalOption = page.getByRole('option', {
    name: 'External'
});

this.ctaText = page.getByRole('textbox').nth(4);

this.addTab = page.locator('#tour-nav-add');

this.pagesTab = page.locator('#tour-nav-pages');

this.assetsTab = page.locator('#tour-nav-assets');

this.layersTab = page.locator('#tour-nav-layers');

this.colorPicker = page.locator('input[type="color"]').first();

this.toggleSwitch = page.getByRole('switch').first();

this.sharpBtn = page.getByRole('button', { name: '° Sharp' });

this.slightBtn = page.getByRole('button', { name: '° Slight' });

this.curvedBtn = page.getByRole('button', { name: '° Curved' });

this.mediumBtn = page.getByRole('button', { name: '° Medium' });

this.featuresSection = page.getByRole('button', {
    name: 'Features Showcase key features'
}).first();

this.servicesSection = page.getByRole('button', {
    name: 'Services List your services'
}).first();

this.aboutSection = page.getByRole('button', {
    name: 'About Us Tell your story'
}).first();

this.pricingSection = page.getByRole('button', {
    name: 'Pricing Pricing tiers & plans'
});

this.testimonialSection = page.getByRole('button', {
    name: 'Testimonials Customer reviews'
});

this.contactSection = page.getByRole('button', {
    name: 'Contact Contact form &'
});

this.teamSection = page.getByRole('button', {
    name: 'Team Team members grid'
});

    }

    async openDashboard() {
        await this.dashboardBtn.click();
    }

    async sortByName() {
        await this.sortDropdown.click();
        await this.nameOption.click();
    }

    async openFilter() {
        await this.filterIcon.click();
    }

    async clickDraft() {
        await this.draftBtn.click();
    }

    async clickPublished() {
        await this.publishedBtn.click();
    }

    async clickDeleted() {
        await this.deletedBtn.click();
    }

    async clickAll() {
        await this.allBtn.click();
    }

    async createProject(projectName) {
        await this.newProjectBtn.click();
        await this.projectNameInput.fill(projectName);
        await this.businessCategory.click();
        await this.startBuildingBtn.click();
    }

    async completeTutorial() {
        for (let i = 0; i < 5; i++) {
            await this.gotItBtn.click();
            await this.nextStep.click();
        }

        for (let i = 0; i < 6; i++) {
            await this.gotItBtn.click();
        }

        await this.startCreatingBtn.click();
    }

    async searchProject(projectName) {
        await this.searchInput.fill(projectName);
        await this.searchInput.press('Enter');
    }

    async clearSearch() {
        await this.searchInput.fill('');
    }

    async sortByRecent() {
        await this.sortDropdown.click();
        await this.recentOption.click();
    }

    async sortByName() {
        await this.sortDropdown.click();
        await this.nameOption.click();
    }

    async openNewProject() {
        await this.newProjectBtn.click();
    }

    async enterProjectName(projectName) {
        await this.projectNameInput.fill(projectName);
    }

    async clickStartBuilding() {
        await this.startBuildingBtn.click();
    }

    async completeTutorial() {
        for (let i = 0; i < 6; i++) {
            if (await this.gotItBtn.isVisible()) {
                await this.gotItBtn.click();
            }
        }

        if (await this.startCreatingBtn.isVisible()) {
            await this.startCreatingBtn.click();
        }
    }

    async publishWebsite(subdomain) {
        await this.publishSiteBtn.click();
        await this.subdomainInput.fill(subdomain);
        await this.publishWebsiteBtn.click();
    }
    async verifyProjectCreationPopup() {
    await expect(this.projectNameInput).toBeVisible();
    await expect(this.startBuildingBtn).toBeVisible();
}

async verifyPlanLimitMessage() {
    await expect(this.planLimitMessage).toBeVisible();
}

async verifySearchPlaceholder() {
    await expect(this.searchInput)
        .toHaveAttribute('placeholder', 'Search projects...');
}

async verifySearchResults(projectName) {
    await expect(this.page.getByText(projectName)).toBeVisible();
}

async verifyNoProjectsFound() {
    await expect(this.noProjectsFoundText).toBeVisible();
}

async verifyDefaultSort() {
    await expect(this.sortDropdown).toContainText('Recent');
}

async verifyRecentSorting() {
    // Add sorting validation logic based on timestamps
}

async verifyFilterTabs() {
    await expect(this.allBtn).toBeVisible();
    await expect(this.draftBtn).toBeVisible();
    await expect(this.publishedBtn).toBeVisible();
    await expect(this.deletedBtn).toBeVisible();
}

async verifyAllFilterSelected() {
    await expect(this.allBtn).toHaveAttribute('data-state', 'active');
}

async verifyDraftProjects() {
    await expect(this.page.locator('.status-badge')).toContainText('DRAFT');
}

async verifyPublishedProjects() {
    await expect(this.page.locator('.status-badge')).toContainText('PUBLISHED');
}

async verifyDeletedProjects() {
    await expect(this.page.locator('.status-badge')).toContainText('DELETED');
}
async openNewProject() {
    await this.newProjectBtn.click();
}

async verifyProjectCreationPopup() {
    await expect(this.projectNameInput).toBeVisible();
    await expect(this.startBuildingBtn).toBeVisible();
}

async searchProject(projectName) {
    await this.searchInput.fill(projectName);
    await this.searchInput.press('Enter');
}

async clearSearch() {
    await this.searchInput.clear();
}

async verifySearchPlaceholder() {
    await expect(this.searchInput)
        .toHaveAttribute('placeholder', 'Search projects...');
}

async verifySearchResults(projectName) {
    await expect(this.page.getByText(projectName)).toBeVisible();
}

async verifyNoProjectsFound() {
    await expect(this.emptyState).toBeVisible();
}

async sortByRecent() {
    await this.sortDropdown.click();
    await this.recentOption.click();
}

async sortByName() {
    await this.sortDropdown.click();
    await this.nameOption.click();
}

async verifyDefaultSort() {
    await expect(this.sortDropdown).toContainText('Recent');
}

async verifyFilterTabs() {
    await expect(this.allBtn).toBeVisible();
    await expect(this.draftBtn).toBeVisible();
    await expect(this.publishedBtn).toBeVisible();
    await expect(this.deletedBtn).toBeVisible();
}

async clickAll() {
    await this.allBtn.click();
}

async clickDraft() {
    await this.draftBtn.click();
}

async clickPublished() {
    await this.publishedBtn.click();
}

async clickDeleted() {
    await this.deletedBtn.click();
}

async verifyDraftProjects() {
    await expect(this.projectStatusBadge).toContainText('Draft');
}

async verifyPublishedProjects() {
    await expect(this.projectStatusBadge).toContainText('Published');
}

async verifyDeletedProjects() {
    await expect(this.projectStatusBadge).toContainText('Deleted');
}

async verifyPlanLimitMessage() {
    await expect(this.planLimitMessage).toBeVisible();
}
async searchProject(projectName) {
    await this.searchInput.fill(projectName);
    await this.searchInput.press('Enter');
}

async verifyNoProjectsFound() {
    await expect(this.projectCards).toHaveCount(0);
}
async verifyTabletLayout() {

    await expect(this.sidebar).toBeVisible();

    await expect(this.projectGrid).toBeVisible();

}

async verifyMobileLayout() {

    await expect(this.sidebar).toBeVisible();

    await expect(this.projectGrid).toBeVisible();

}

async waitForProjectsToLoad() {

    await this.projectCards.first().waitFor();

}

async simulateSlowNetwork() {

    const client = await this.page.context().newCDPSession(this.page);

    await client.send('Network.enable');

    await client.send('Network.emulateNetworkConditions', {
        offline: false,
        latency: 400,
        downloadThroughput: 50000,
        uploadThroughput: 50000
    });

}

async verifySkeletonLoader() {

    await expect(this.skeletonLoader.first()).toBeVisible();

}

async verifyKeyboardNavigation() {

    await this.page.keyboard.press('Tab');
    await expect(this.newProjectBtn).toBeFocused();

    await this.page.keyboard.press('Tab');
    await expect(this.searchInput).toBeFocused();

    await this.page.keyboard.press('Tab');

}

async verifyEmptyState() {

    await expect(this.emptyStateTitle).toBeVisible();

}
async verifyTabletLayout() {

    await expect(this.sidebar).toBeVisible();

}

async verifyMobileLayout() {

    await expect(this.sidebar).toBeVisible();

    

}

async waitForProjectsToLoad() {
    await this.projectCards.first().waitFor({
        state: 'visible',
        timeout: 10000
    });
}

async simulateSlowNetwork() {

    const client = await this.page.context().newCDPSession(this.page);

    await client.send('Network.enable');

    await client.send('Network.emulateNetworkConditions', {
        offline: false,
        latency: 400,
        downloadThroughput: 50000,
        uploadThroughput: 50000
    });

}

async verifySkeletonLoader() {

    await expect(this.skeletonLoader.first()).toBeVisible();

}

async verifyKeyboardNavigation() {

    await this.newProjectBtn.focus();

    await expect(this.newProjectBtn).toBeFocused();

    await this.page.keyboard.press('Enter');

}
async verifyEmptyState() {

    await expect(this.emptyStateTitle).toBeVisible();

}
async createNewProject(projectName) {

    // Create Project
    await this.page.getByRole('button', { name: 'New Project' }).click();

    await this.page.getByRole('textbox', {
        name: 'e.g., My Awesome Site'
    }).fill(projectName);

    await this.page.getByRole('button', {
        name: 'Start Building'
    }).click();

    // Close onboarding popup
    await this.page.locator('.absolute.top-10').click();

    // Open Add Section
    await this.page.locator('#tour-nav-add').click();

    // ---------------- Hero Section ----------------

    await this.page.getByRole('button', {
        name: 'Hero Full-screen hero section'
    }).first().click();

    // Layout
    await this.page.getByRole('combobox')
        .filter({ hasText: 'Split Layout' }).click();
    await this.page.getByRole('option', {
        name: 'Split Layout'
    }).click();

    // Alignment
    await this.page.getByRole('combobox')
        .filter({ hasText: 'Split Layout' }).click();
    await this.page.getByRole('option', {
        name: 'Centered'
    }).click();

    // Background
    await this.page.getByRole('combobox')
        .filter({ hasText: 'Centered' }).click();
    await this.page.getByText('Video Background').click();

    // Style
    await this.page.getByRole('combobox')
        .filter({ hasText: 'Video Background' }).click();
    await this.page.getByRole('option', {
        name: 'Minimal'
    }).click();

    await this.page.getByRole('combobox')
        .filter({ hasText: 'Minimal' }).click();
    await this.page.getByText('Bold Gradient').click();

    // Heading
    await this.page.getByRole('textbox').first().fill(
        'Build websites for web application'
    );

    // Description
    await this.page.locator('textarea').fill(
        'Mainteained the all the modules such as text ,homw,abiut,sbvcgdsjchdsc'
    );

    // Primary Button Text
    await this.page.getByRole('textbox').nth(2)
        .fill('first trail free');

    // Button Action
    await this.page.getByRole('combobox').nth(1).click();
    await this.page.getByText('External').click();

    await this.page.getByRole('combobox')
        .filter({ hasText: 'External' }).click();
    await this.page.getByText('Internal').click();

    await this.page.getByRole('combobox')
        .filter({ hasText: 'Internal' }).click();
    await this.page.getByRole('option', {
        name: 'Email'
    }).click();

    await this.page.getByRole('combobox')
        .filter({ hasText: 'Email' }).click();
    await this.page.getByText('Phone').click();

    // Phone Number
    await this.page.getByRole('textbox', {
        name: 'tel:+'
    }).fill('767687879878979879878779797777877');

    // Assets
    await this.page.locator('#tour-nav-assets').click();
    await this.page.getByRole('button', {
        name: 'Copy Link'
    }).nth(4).click();

    // Edit Panel
    await this.page.locator('#tour-nav-pages').click();
    await this.page.locator('#tour-nav-add').click();
    await this.page.locator('#tour-nav-edit').click();

    // Image URL
    const imageUrl =
        'https://buildora-assets.s3.us-east-1.amazonaws.com/assets/cmp0zsac90000gifp2oqdd5ed/global/1be37000-1f59-4ccf-a0ce-9b887920a62f.webp';

    await this.page.getByRole('textbox', {
        name: 'https://...'
    }).fill(imageUrl);

    // Background Color
    await this.page.locator(
        'div:nth-child(2) > .flex.gap-2 > .flex'
    ).first().click();

    await this.page.locator('input[type="color"]')
        .nth(1)
        .fill('#1445b8');

    // Padding
    await this.page.getByRole('textbox', {
        name: '120px'
    }).fill('19px 0');
}
async editHeroSection() {

    // Open Add Section
    await this.page.locator('#tour-nav-add').click();

    await this.page.getByRole('button', {
        name: 'Hero Full-screen hero section'
    }).first().click();

    // Layout
    await this.page.getByRole('combobox')
        .filter({ hasText: 'Split Layout' }).click();
    await this.page.getByRole('option', { name: 'Split Layout' }).click();

    // Alignment
    await this.page.getByRole('combobox')
        .filter({ hasText: 'Split Layout' }).click();
    await this.page.getByRole('option', { name: 'Centered' }).click();

    // Background
    await this.page.getByRole('combobox')
        .filter({ hasText: 'Centered' }).click();
    await this.page.getByText('Video Background').click();

    // Style
    await this.page.getByRole('combobox')
        .filter({ hasText: 'Video Background' }).click();
    await this.page.getByRole('option', { name: 'Minimal' }).click();

    await this.page.getByRole('textbox').first()
        .fill('Build websites for web application');

    await this.page.locator('textarea').first()
        .fill('Maintained all website modules.');

    await this.page.getByRole('textbox').nth(2)
        .fill('Start Free');

    await this.page.locator('input[type="color"]')
        .first()
        .fill('#1445b8');
}
async openDashboard() {
        await expect(
            this.page.getByRole('button', { name: 'New Project' })
        ).toBeVisible();
    }

    async createNewProject(projectName) {

        // Create Project
        await this.page.getByRole('button', { name: 'New Project' }).click();

        await this.page.getByRole('textbox', {
            name: 'e.g., My Awesome Site'
        }).fill(projectName);

        await this.page.getByRole('button', {
            name: 'Start Building'
        }).click();

        // Close onboarding popup
        await this.page.locator('.absolute.top-10').click();

        // Open Add Section
        await this.page.locator('#tour-nav-add').click();

        // Add Hero Section
        await this.page.getByRole('button', {
            name: 'Hero Full-screen hero section'
        }).first().click();
    }

    async editHeroSection() {

        // Select Hero Section
        await this.page.getByRole('button', {
            name: 'Hero Full-screen hero section'
        }).first().click();

        // Layout
        await this.page.getByRole('combobox')
            .filter({ hasText: 'Split Layout' }).click();

        await this.page.getByRole('option', {
            name: 'Split Layout'
        }).click();

        // Alignment
        await this.page.getByRole('combobox')
            .filter({ hasText: 'Split Layout' }).click();

        await this.page.getByRole('option', {
            name: 'Centered'
        }).click();

        // Background
        await this.page.getByRole('combobox')
            .filter({ hasText: 'Centered' }).click();

        await this.page.getByRole('option', {
            name: 'Video Background'
        }).click();

        // Style
        await this.page.getByRole('combobox')
            .filter({ hasText: 'Video Background' }).click();

        await this.page.getByRole('option', {
            name: 'Minimal'
        }).click();

        await this.page.getByRole('combobox')
            .filter({ hasText: 'Minimal' }).click();

        await this.page.getByRole('option', {
            name: 'Bold Gradient'
        }).click();

        await this.page.getByRole('combobox')
            .filter({ hasText: 'Bold Gradient' }).click();

        await this.page.getByRole('option', {
            name: 'Video Background'
        }).click();

        // Heading
        await this.page.getByRole('textbox').first().fill(
            'Build Beautiful Websites Without Code and with code'
        );

        // Description
        await this.page.locator('textarea').fill(
            'This website belongs to digital marketing and stock market.'
        );

        // Primary Button
        await this.page.getByRole('textbox').nth(2)
            .fill('Get Started Paid');

        // Primary Button Link
        await this.page.getByRole('textbox', {
            name: 'https://example.com'
        }).first().fill('https://example.com');

        // Secondary Button
        await this.page.getByRole('textbox').nth(4)
            .fill('Watch Demo Start');

        // Secondary Button Link
        await this.page.getByRole('textbox', {
            name: 'https://example.com'
        }).nth(1).fill('https://example.com');

        // Assets
        await this.page.locator('#tour-nav-assets').click();

        await this.page.getByRole('button', {
            name: 'Copy Link'
        }).first().click();

        // Layers
        await this.page.locator('#tour-nav-layers').click();

        await this.page.getByRole('button', {
            name: 'Hero Section hero'
        }).first().click();

        // Image URL
        await this.page.getByRole('textbox', {
            name: 'https://...'
        }).fill(
            'https://buildora-assets.s3.us-east-1.amazonaws.com/assets/cmp0zsac90000gifp2oqdd5ed/global/1a5c71f9-2433-410a-9504-522b467898ce.webp'
        );

        // Video URL
        await this.page.getByRole('textbox', {
            name: 'https://www.youtube.com/embed/'
        }).fill('https://www.youtube.com/embed/');

        // Toggle Switches
        await this.page.getByRole('switch').first().click();
        await this.page.getByRole('switch').first().click();
        await this.page.getByRole('switch').nth(1).click();
        await this.page.getByRole('switch').nth(1).click();

        // Border Radius
        await this.page.getByRole('button', { name: '° Sharp' }).click();
        await this.page.getByRole('button', { name: '° Slight' }).click();
        await this.page.getByRole('button', { name: '° Medium' }).click();
        await this.page.getByRole('button', { name: '° Curved' }).click();
    }

    async openDashboard() {
        await expect(
            this.page.getByRole('button', { name: 'New Project' })
        ).toBeVisible();
    }

    async createNewProject(projectName) {

        // Create Project
        await this.page.getByRole('button', { name: 'New Project' }).click();

        await this.page.getByRole('textbox', {
            name: 'e.g., My Awesome Site'
        }).fill(projectName);

        await this.page.getByRole('button', {
            name: 'Start Building'
        }).click();

        // Close Tour
        await this.page.locator('.absolute.top-10').click();
    }

    async customizeHeroSection() {

        // Select Hero Section
        await this.page.getByRole('button', {
            name: 'Hero Full-screen hero section'
        }).first().click();

        // Layout
        await this.page.getByRole('combobox')
            .filter({ hasText: 'Split Layout' }).click();

        await this.page.getByRole('option', {
            name: 'Centered'
        }).click();

        // Background
        await this.page.getByRole('combobox')
            .filter({ hasText: 'Centered' }).click();

        await this.page.getByRole('option', {
            name: 'Video Background'
        }).click();

        // Style
        await this.page.getByRole('combobox')
            .filter({ hasText: 'Video Background' }).click();

        await this.page.getByRole('option', {
            name: 'Minimal'
        }).click();

        await this.page.getByRole('combobox')
            .filter({ hasText: 'Minimal' }).click();

        await this.page.getByText('Bold Gradient').click();

        // Description
        await this.page.locator('textarea').fill(
            'Drag, drop, and design your dream website with our intuitive builder.'
        );

        // Primary Button
        await this.page.getByRole('textbox').nth(2)
            .fill('Get Started Paid');

        // Primary Button Link
        await this.page.getByRole('combobox').nth(1).click();
        await this.page.getByText('External').click();

        await this.page.getByRole('textbox', {
            name: 'https://example.com'
        }).first().fill('https://example.com');

        // Secondary Button
        await this.page.getByRole('textbox').nth(4)
            .fill('Watch Demo Start');

        // Secondary Button Action
        await this.page.getByRole('combobox')
            .filter({ hasText: 'None' }).click();

        await this.page.getByLabel('External')
            .getByText('External').click();

        await this.page.getByRole('textbox', {
            name: 'https://example.com'
        }).nth(1).fill('https://example.com');

        // Assets
        await this.page.locator('#tour-nav-assets').click();

        await this.page.getByRole('button', {
            name: 'Copy Link'
        }).nth(3).click();

        // Layers
        await this.page.locator('#tour-nav-layers').click();

        await this.page.getByRole('button', {
            name: 'Hero Section hero'
        }).first().click();

        // Image URL
        await this.page.getByRole('textbox', {
            name: 'https://...'
        }).fill(
            'https://buildora-assets.s3.us-east-1.amazonaws.com/assets/cmp0zsac90000gifp2oqdd5ed/global/05fa0304-ecb7-47bd-98bc-ed648bd25ab3.webp'
        );

        // Assets → Videos
       // Assets
await this.page.locator('#tour-nav-assets').click();

await this.page.getByRole('tab', {
    name: 'Videos'
}).click();

// Open Edit Panel
await this.page.locator('#tour-nav-edit').click();

// Border Radius
await this.page.getByRole('button', { name: '° Sharp' }).click();
await this.page.getByRole('button', { name: '° Medium' }).click();

// Primary Button Color
await this.page.locator('input[type="color"]').nth(3).fill('#0b3eb7');

// Secondary Button Color
await this.page.locator('input[type="color"]').nth(4).fill('#eed8d8');

// Background Color
await this.page.locator('input[type="color"]').first().fill('#9a2828');

// Border Radius Variants
await this.page.getByRole('button', { name: '° Slight' }).click();
await this.page.getByRole('button', { name: '° Curved' }).click();
await this.page.getByRole('button', { name: '° Medium' }).click();
await this.page.getByRole('button', { name: '° Sharp' }).click();

// Toggle
await this.page.getByRole('switch').nth(1).click();
await this.page.getByRole('switch').nth(1).click();

// Padding
await this.page.getByRole('textbox', {
    name: '120px'
}).fill('15px 0');

// Height
await this.page.getByRole('textbox', {
    name: '80vh'
}).click();
    }
}

module.exports = DashboardPage;