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

export function NavbarPreview({ config, isEditing, onUpdate }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const { pages, setActivePage, updatePageName, createPage, selectSection } = useBuilder();

  /* ------------------------------
     NAVBAR STYLES (dynamic)
  ------------------------------ */
  const navStyle = {
    backgroundColor:
      config.styles.backgroundColor === 'transparent'
        ? 'rgba(15, 23, 42, 0.8)'
        : config.styles.backgroundColor,
    color: config.styles.textColor,
  };

  const navigate = useNavigate();

  const handleNavClick = (e, link) => {
    // 1. Handle anchor links and root routes (e.g., #about, /#hero, /)
    if (link.href && (link.href.startsWith('#') || link.href.startsWith('/#') || link.href === '/')) {
      e.preventDefault();
      
      const targetId = link.href.startsWith('/#') ? link.href.substring(2)
                     : link.href.startsWith('#') ? link.href.substring(1)
                     : '';
                     
      if (targetId) {
        const element = document.getElementById(targetId);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth', block: 'start' });
        } else {
          // Switch to home page if section not found on current page
          const homePage = pages.find(p => p.slug === '/' || p.name?.toLowerCase().includes('home')) || pages[0];
          if (homePage) {
            setActivePage(homePage.id);
            // Delay to allow page switch rendering before scrolling
            setTimeout(() => {
              const el = document.getElementById(targetId);
              if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }, 100);
          }
        }
      } else {
        // Just switch to root '/'
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
        } z-50 backdrop-blur-md ${isEditing ? 'cursor-pointer' : ''}`}
      style={navStyle}
      onClick={handleNavbarClick}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16 md:h-20">

          {/* =====================================================
              LOGO SECTION
          ===================================================== */}
          <div className="flex items-center shrink-0">
            {config.logo.imageUrl ? (
              <img
                src={config.logo.imageUrl}
                alt="Logo"
                className="h-9 md:h-10"
              />
            ) : (
              <span
                className="text-xl md:text-2xl font-bold"
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
                  className="px-6 py-2.5 rounded-lg font-medium transition-all duration-300 hover:shadow-glow"
                  style={{
                    background:
                      'linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)',
                    color: '#ffffff',
                  }}
                >
                  {link.label}
                </a>
              ) : (
                <a
                  key={link.id}
                  href={link.href}
                  onClick={(e) => handleNavClick(e, link)}
                  className="font-medium transition-colors hover:text-primary"
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
                </a>
              )
            )}
          </div>

          {/* =====================================================
              MOBILE MENU BUTTON
          ===================================================== */}
          <button
            className="md:hidden p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            style={{ color: config.styles.textColor }}
            onClick={() => setMobileMenuOpen((prev) => !prev)}
            aria-label="Toggle Menu"
          >
            {mobileMenuOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </button>
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
