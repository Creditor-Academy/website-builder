import React from "react";
import { useNavigate } from 'react-router-dom';
import { useBuilder } from '@/contexts/BuilderContext';
import { createDefaultHeroSection, createDefaultCTASection, createDefaultFooter, createDefaultNavbar, createFeaturesPage, createServicesPage, createPricingPage, createContactPage, createStartPage, createTemplatesPage, createAboutPage, createBlogPage, createCareersPage, createHelpPage, createStatusPage, createPrivacyPolicyPage, createTermsOfServicePage, createMarketingPage, createDesignPage, createDevPage, createExecutiveStrategyPage, createRevenueGrowthPage, createMarketExpansionPage } from '@/lib/defaultPageData';
import {
  Facebook,
  Twitter,
  Instagram,
  Linkedin,
  Youtube,
  Github,
  Mail,
  Phone,
  MapPin,
  Globe,
  MessageCircle,
} from "lucide-react";

const socialIcons = {
  facebook: Facebook,
  twitter: Twitter,
  instagram: Instagram,
  linkedin: Linkedin,
  youtube: Youtube,
  github: Github,
  email: Mail,
  phone: Phone,
  location: MapPin,
  website: Globe,
  discord: MessageCircle,
};

export function FooterPreview({ config, isEditing, onUpdate }) {
  const navigate = useNavigate();
  const { updatePageName, pages, setActivePage, createPage, selectSection } = useBuilder();

  const footerStyle = {
    backgroundColor: config.styles.backgroundColor || 'var(--theme-bg, #ffffff)',
    color: config.styles.textColor || 'var(--theme-text, #0f172a)',
  };

  const handleFooterClick = (e) => {
    if (isEditing && e.target.closest('a, button') === null) {
      e.stopPropagation();
      selectSection(null);
    }
  };

  return (
    <footer 
      className={`relative ${isEditing ? 'cursor-pointer' : ''}`} 
      style={footerStyle}
      onClick={handleFooterClick}
    >
      <div className="container mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12">

          {/* =====================================================
              LOGO + DESCRIPTION
          ===================================================== */}
          <div className="lg:col-span-2">
            {config.logo.imageUrl ? (
              <img src={config.logo.imageUrl} alt="Logo" className="h-10 mb-6" />
            ) : (
              <span
                className="text-2xl font-bold block mb-6"
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

            <p
              className="opacity-60 max-w-sm mb-6"
              style={{ color: config.styles.textColor }}
              contentEditable={isEditing}
              suppressContentEditableWarning
              onBlur={(e) =>
                onUpdate({
                  description: e.target.innerText,
                })
              }
            >
              {config.description}
            </p>

            {/* SOCIAL ICONS (links editable via config) */}
            <div className="flex gap-3 flex-wrap">
              {config.socialLinks.map((social) => {
                const Icon = socialIcons[social.platform];
                const isContact = ['email', 'phone', 'location'].includes(social.platform);
                return (
                  <a
                    key={social.id}
                    href={social.href}
                    target={isContact ? '_self' : '_blank'}
                    rel={isContact ? '' : 'noopener noreferrer'}
                    onClick={(e) => {
                      if (social.platform === 'email') {
                        e.preventDefault();
                        window.location.href = `mailto:${social.href.replace('mailto:', '')}`;
                      } else if (social.platform === 'phone') {
                        e.preventDefault();
                        window.location.href = `tel:${social.href.replace('tel:', '')}`;
                      } else if (social.platform === 'location') {
                        e.preventDefault();
                        window.open(`https://maps.google.com/?q=${encodeURIComponent(social.href)}`, '_blank');
                      }
                    }}
                    className="w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-300 hover:bg-white/10 hover:scale-110 hover:shadow-lg hover:shadow-white/20 relative overflow-hidden group"
                    style={{ backgroundColor: "rgba(255,255,255,0.05)" }}
                  >
                    <Icon className="w-5 h-5 relative z-10 transition-colors duration-300 group-hover:text-white" />
                    <div className="absolute inset-0 bg-gradient-to-r from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  </a>
                );
              })}
              {config.socialLinks.length === 0 && (
                <div className="text-xs opacity-40 italic w-full">No social links added yet</div>
              )}
            </div>
          </div>

          {/* =====================================================
              FOOTER COLUMNS (PRODUCT / COMPANY / SUPPORT)
          ===================================================== */}
          {config.columns.map((column) => (
            <div key={column.id}>
              {/* COLUMN TITLE (EDITABLE) */}
              <h4
                className="font-semibold mb-4"
                style={{ color: config.styles.textColor }}
                contentEditable={isEditing}
                suppressContentEditableWarning
                onBlur={(e) =>
                  onUpdate({
                    columns: config.columns.map((c) =>
                      c.id === column.id
                        ? { ...c, title: e.target.innerText }
                        : c
                    ),
                  })
                }
              >
                {column.title}
              </h4>

              {/* COLUMN LINKS (EDITABLE) */}
              <ul className="space-y-3">
                {column.links.map((link) => (
                  <li key={link.id}>
                    <a
                      href={link.href}
                      onClick={(e) => {
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
                          return;
                        }

                        // 2. Handle internal pages (e.g., /about, /privacy)
                        const isInternalPage = link.href && link.href.startsWith('/');
                        const targetPage = isInternalPage ? pages.find(p => p.slug === link.href) : null;

                        if (targetPage) {
                          e.preventDefault();
                          setActivePage(targetPage.id);
                          return;
                        }

                        // If page doesn't exist, try to create it (Even in Preview mode for these standard routes)
                        if (isInternalPage) {
                          e.preventDefault();
                          const slug = link.href;
                          let newPage = null;
                          switch (slug) {
                            case '/features': newPage = createFeaturesPage(); break;
                            case '/services': newPage = createServicesPage(); break;
                            case '/pricing': newPage = createPricingPage(); break;
                            case '/contact': newPage = createContactPage(); break;
                            case '/start': newPage = createStartPage(); break;
                            case '/templates': newPage = createTemplatesPage(); break;
                            case '/about': newPage = createAboutPage(); break;
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
                                  id: (Math.random() + 1).toString(36).substring(7),
                                  name: link.label || slug.replace('/', '') || 'New Page',
                                  slug,
                                  navbar: createDefaultNavbar(),
                                  sections: [createDefaultHeroSection(), createDefaultCTASection()],
                                  footer: createDefaultFooter(),
                                };
                              }
                          }

                          if (newPage) {
                            createPage(newPage);
                          } else if (!isEditing) {
                            console.warn('Page not found in this project:', link.href);
                          }
                        }
                      }}
                      className="opacity-60 hover:opacity-100 transition-opacity"
                      style={{ color: config.styles.textColor }}
                      contentEditable={isEditing}
                      suppressContentEditableWarning
                      onBlur={(e) => {
                      const newLabel = e.target.innerText;
                      onUpdate({
                        columns: config.columns.map((c) =>
                          c.id === column.id
                            ? {
                                ...c,
                                links: c.links.map((l) =>
                                  l.id === link.id
                                    ? { ...l, label: newLabel }
                                    : l
                                ),
                              }
                            : c
                        ),
                      });

                      if (link.href && link.href.startsWith('/')) {
                        updatePageName(link.href, newLabel);
                      }
                    }}
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* =====================================================
            BOTTOM BAR
        ===================================================== */}
        <div className="mt-16 pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-4">
          <p
            className="opacity-60 text-sm"
            style={{ color: config.styles.textColor }}
            contentEditable={isEditing}
            suppressContentEditableWarning
            onBlur={(e) =>
              onUpdate({
                copyright: e.target.innerText,
              })
            }
          >
            {config.copyright}
          </p>
        </div>
      </div>
    </footer>
  );
}
