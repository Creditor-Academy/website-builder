import React from "react";
import { useNavigate } from 'react-router-dom';
import { useBuilder } from '@/contexts/BuilderContext';
import { createDefaultHeroSection, createDefaultCTASection, createDefaultFooter, createDefaultNavbar, createFeaturesPage, createServicesPage, createPricingPage, createContactPage, createStartPage, createTemplatesPage, createAboutPage, createBlogPage, createCareersPage, createHelpPage, createStatusPage, createPrivacyPolicyPage, createTermsOfServicePage } from '@/lib/defaultPageData';
import {
  Facebook,
  Twitter,
  Instagram,
  Linkedin,
  Youtube,
  Github,
} from "lucide-react";

const socialIcons = {
  facebook: Facebook,
  twitter: Twitter,
  instagram: Instagram,
  linkedin: Linkedin,
  youtube: Youtube,
  github: Github,
};

export function FooterPreview({ config, isEditing, onUpdate }) {
  const navigate = useNavigate();
  const { updatePageName, pages, setActivePage, createPage, selectSection } = useBuilder();

  const footerStyle = {
    backgroundColor: config.styles.backgroundColor,
    color: config.styles.textColor,
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
            <div className="flex gap-4">
              {config.socialLinks.map((social) => {
                const Icon = socialIcons[social.platform];
                return (
                  <a
                    key={social.id}
                    href={social.href}
                    className="w-10 h-10 rounded-lg flex items-center justify-center transition-all duration-300 hover:bg-white/10 hover:scale-110"
                    style={{ backgroundColor: "rgba(255,255,255,0.05)" }}
                  >
                    <Icon className="w-5 h-5" />
                  </a>
                );
              })}
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
                        if (isEditing) {
                          const target = pages.find(p => p.slug === link.href);
                          if (target) {
                            e.preventDefault();
                            setActivePage(target.id);
                          } else if (link.href && link.href.startsWith('/')) {
                            e.preventDefault();
                            // create new page for slug (reuse factories if available)
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
                              default:
                                newPage = {
                                  id: (Math.random()+1).toString(36).substring(7),
                                  name: link.label || slug.replace('/', '') || 'New Page',
                                  slug,
                                  navbar: createDefaultNavbar(),
                                  sections: [createDefaultHeroSection(), createDefaultCTASection()],
                                  footer: createDefaultFooter(),
                                };
                            }
                            createPage(newPage);
                          }
                        } else {
                          if (!isEditing && link.href && link.href.startsWith('/')) {
                            e.preventDefault();
                            navigate(link.href);
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

          <div className="flex gap-6 text-sm opacity-60">
            <a 
              href="/privacy" 
              className="hover:opacity-100 transition-opacity"
              style={{ color: config.styles.textColor }}
              onClick={(e) => {
                e.preventDefault();
                const target = pages.find(p => p.slug === '/privacy');
                if (target) {
                  setActivePage(target.id);
                } else {
                  const newPage = createPrivacyPolicyPage();
                  createPage(newPage);
                }
                if (!isEditing) {
                  navigate('/privacy', { replace: true });
                }
              }}
            >
              {config.privacyPolicy || 'Privacy Policy'}
            </a>
            <a 
              href="/terms" 
              className="hover:opacity-100 transition-opacity"
              style={{ color: config.styles.textColor }}
              onClick={(e) => {
                e.preventDefault();
                const target = pages.find(p => p.slug === '/terms');
                if (target) {
                  setActivePage(target.id);
                } else {
                  const newPage = createTermsOfServicePage();
                  createPage(newPage);
                }
                if (!isEditing) {
                  navigate('/terms', { replace: true });
                }
              }}
            >
              {config.termsOfService || 'Terms of Service'}
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
