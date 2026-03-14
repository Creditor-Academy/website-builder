import React, { useState } from 'react';
import { Menu, X } from 'lucide-react';
import { useBuilder } from '@/contexts/BuilderContext';
import { useNavigate } from 'react-router-dom';
import {
  createDefaultHeroSection,
  createDefaultCTASection,
  createDefaultFooter,
  createDefaultNavbar,
  createFeaturesPage,
  createServicesPage,
  createPricingPage,
  createContactPage,
  createStartPage,
  createTemplatesPage,
  createAboutPage,
  createBlogPage,
  createCareersPage,
  createHelpPage,
  createStatusPage,
  createPrivacyPolicyPage,
  createTermsOfServicePage,
  createMarketingPage,
  createDesignPage,
  createDevPage,
  createExecutiveStrategyPage,
  createRevenueGrowthPage,
  createMarketExpansionPage
} from '@/lib/defaultPageData';
import { v4 as uuidv4 } from 'uuid';

export function NavbarPreview({ config: rawConfig, isEditing, onUpdate }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showBgPicker, setShowBgPicker] = useState(false);

  const { pages, setActivePage, updatePageName, createPage, selectSection } = useBuilder();

  // Merge with safe defaults so null/undefined navbar from DB never crashes the component
  const safeRaw = rawConfig || {};
  const config = {
    logo: { text: 'My Site', imageUrl: '', ...((safeRaw as any).logo || {}) },
    links: (safeRaw as any).links || [],
    styles: {
      backgroundColor: 'transparent',
      textColor: '#000000',
      sticky: true,
      ...((safeRaw as any).styles || {}),
    },
  };

  /* ------------------------------
     NAVBAR STYLES (dynamic)
  ------------------------------ */
  // Use config bg if set and not 'transparent', else default to white
  const navBg =
    config.styles.backgroundColor && config.styles.backgroundColor !== 'transparent'
      ? config.styles.backgroundColor
      : '#ffffff';

  const navStyle = {
    backgroundColor: navBg,
    color: config.styles.textColor,
  };

  const navigate = useNavigate();

  const handleNavClick = (e, link) => {
    // 1. Handle anchor links (e.g., #about, #services)
    if (link.href && link.href.startsWith('#')) {
      e.preventDefault();
      const targetId = link.href.substring(1);
      const element = document.getElementById(targetId);

      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'start' });
      } else {
        // Switch to home page if section not found on current page
        const homePage = pages.find(p => p.slug === '/' || p.name?.toLowerCase().includes('home')) || pages[0];
        if (homePage) {
          setActivePage(homePage.id);
        }
      }
      setMobileMenuOpen(false);
      return;
    }

    // 2. Handle internal pages (e.g., /about, /privacy)
    if (link.href && link.href.startsWith('/')) {
      e.preventDefault();
      const targetPage = pages.find((p) => p.slug === link.href);

      if (targetPage) {
        setActivePage(targetPage.id);
        setMobileMenuOpen(false);
        return;
      }

      // If page doesn't exist, try to create it (Even in Preview mode for standard routes)
      const slug = link.href;
      let newPage = null;
      switch (slug) {
        case '/about': newPage = createAboutPage(); break;
        case '/services': newPage = createServicesPage(); break;
        case '/pricing': newPage = createPricingPage(); break;
        case '/contact': newPage = createContactPage(); break;
        case '/start': newPage = createStartPage(); break;
        case '/templates': newPage = createTemplatesPage(); break;
        case '/features': newPage = createFeaturesPage(); break;
        case '/blog': newPage = createBlogPage(); break;
        case '/careers': newPage = createCareersPage(); break;
        case '/help': newPage = createHelpPage(); break;
        case '/status': newPage = createStatusPage(); break;
        case '/privacy': newPage = createPrivacyPolicyPage(); break;
        case '/terms': newPage = createTermsOfServicePage(); break;
        case '/marketing': newPage = createMarketingPage(); break;
        case '/design': newPage = createDesignPage(); break;
        case '/dev': newPage = createDevPage(); break;
        case '/executive-strategy': newPage = createExecutiveStrategyPage(); break;
        case '/revenue-growth': newPage = createRevenueGrowthPage(); break;
        case '/market-expansion': newPage = createMarketExpansionPage(); break;
        default:
          if (isEditing) {
            newPage = {
              id: uuidv4(),
              name: link.label || slug.replace('/', '') || 'New Page',
              slug: slug,
              navbar: createDefaultNavbar(),
              sections: [createDefaultHeroSection(), createDefaultCTASection()],
              footer: createDefaultFooter(),
            };
          }
      }

      if (newPage) {
        createPage(newPage);
        setMobileMenuOpen(false);
      } else if (!isEditing) {
        // Preview mode but page doesn't exist and isn't a standard route
        console.warn('Page not found in this project:', link.href);
      }
      return;
    }
  };

  const handleNavbarClick = (e) => {
    if (isEditing && e.target.closest('a, button') === null) {
      e.stopPropagation();
      selectSection(null);
    }
  };

  return (
    <nav
      className={`${config.styles.sticky ? 'sticky top-0' : 'relative'
        } z-50 backdrop-blur-lg ${isEditing ? 'cursor-pointer' : ''} transition-all duration-300`}
      style={navStyle}
      onClick={handleNavbarClick}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16 md:h-20">

          {/* =====================================================
              LOGO SECTION
          ===================================================== */}
          <div className="flex items-center shrink-0 group">
            {config.logo.imageUrl ? (
              <div className="relative">
                <img
                  src={config.logo.imageUrl}
                  alt="Logo"
                  className="h-9 md:h-10 transition-transform duration-300 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-accent/20 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
              </div>
            ) : (
              <span
                className="text-xl md:text-2xl font-bold transition-all duration-300 hover:scale-105"
                style={{ color: config.styles.textColor }}
                contentEditable={isEditing}
                suppressContentEditableWarning
                onBlur={(e) =>
                  onUpdate({
                    logo: {
                      ...config.logo,
                      text: e.target.innerText,
                    },
                  })
                }
              >
                {config.logo.text}
              </span>
            )}
          </div>

          {/* =====================================================
              DESKTOP NAVIGATION
          ===================================================== */}
          <div className="hidden md:flex items-center gap-8">
            {config.links.map((link) =>
              link.isButton ? (
                <a
                  key={link.id}
                  href={link.href}
                  onClick={(e) => handleNavClick(e, link)}
                  className="px-6 py-2.5 rounded-xl font-semibold transition-all duration-300 hover:shadow-lg hover:shadow-primary/25 transform hover:scale-105 active:scale-95 relative overflow-hidden group"
                  style={{
                    background:
                      'linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)',
                    color: '#ffffff',
                  }}
                >
                  <span className="relative z-10">{link.label}</span>
                  <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </a>
              ) : (
                <a
                  key={link.id}
                  href={link.href}
                  onClick={(e) => handleNavClick(e, link)}
                  className="font-medium transition-all duration-300 hover:text-primary hover:scale-105 relative group"
                  style={{ color: config.styles.textColor }}
                  contentEditable={isEditing}
                  suppressContentEditableWarning
                  onBlur={(e) => {
                    const newLabel = e.target.innerText;
                    onUpdate({
                      links: config.links.map((l) =>
                        l.id === link.id
                          ? { ...l, label: newLabel }
                          : l
                      ),
                    });
                    if (link.href && link.href.startsWith('/')) {
                      updatePageName(link.href, newLabel);
                    }
                  }}
                >
                  {link.label}
                  <div className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary transition-all duration-300 group-hover:w-full" />
                </a>
              )
            )}
          </div>



        </div>
      </div>

      {/* =====================================================
          MOBILE MENU
      ===================================================== */}
      <div
        className={`md:hidden absolute top-full left-0 w-full overflow-hidden transition-all duration-300 ${mobileMenuOpen ? 'max-h-screen opacity-100' : 'max-h-0 opacity-0'
          }`}
        style={navStyle}
      >
        <div className="px-6 py-6 border-t border-white/10 flex flex-col gap-4">
          {config.links.map((link) => (
            <a
              key={link.id}
              href={link.href}
              onClick={(e) => handleNavClick(e, link)}
              className={`font-medium py-3 ${link.isButton
                ? 'rounded-lg text-center'
                : 'border-b border-white/10'
                }`}
              style={
                link.isButton
                  ? {
                    background:
                      'linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)',
                    color: '#ffffff',
                  }
                  : { color: config.styles.textColor }
              }
              contentEditable={isEditing}
              suppressContentEditableWarning
              onBlur={(e) =>
                onUpdate({
                  links: config.links.map((l) =>
                    l.id === link.id
                      ? { ...l, label: e.target.innerText }
                      : l
                  ),
                })
              }
            >
              {link.label}
            </a>
          ))}
        </div>
      </div>
    </nav>
  );
}