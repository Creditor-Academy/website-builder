import React from "react";
import { useNavigate } from 'react-router-dom';
import { useBuilder } from '@/contexts/BuilderContext';
import useBuilderStore from '@/store/useBuilderStore';
import { createDefaultHeroSection, createDefaultCTASection, createDefaultFooter, createDefaultNavbar, createFeaturesPage, createServicesPage, createPricingPage, createContactPage, createStartPage, createTemplatesPage, createAboutPage, createBlogPage, createCareersPage, createHelpPage, createStatusPage, createPrivacyPolicyPage, createTermsOfServicePage, createMarketingPage, createDesignPage, createDevPage, createExecutiveStrategyPage, createRevenueGrowthPage, createMarketExpansionPage } from '@/lib/defaultPageData';
import {
  Facebook, Twitter, Instagram, Linkedin, Youtube,
  Github, Mail, Phone, MapPin, Globe, MessageCircle,
} from "lucide-react";
import { FooterVariant } from './FooterVariants';
import { FooterEditRoot, FooterLinkHit, MovablePiece, useFooterLinkOpen } from './footerChrome';

const socialIcons = {
  facebook: Facebook, twitter: Twitter, instagram: Instagram,
  linkedin: Linkedin, youtube: Youtube, github: Github,
  email: Mail, phone: Phone, location: MapPin,
  website: Globe, discord: MessageCircle,
};

// ─── Styles ───────────────────────────────────────────────────────────────
const STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=Geist:wght@300;400;500;600&display=swap');

  @keyframes ft-up   { from { opacity:0; transform:translateY(16px); } to { opacity:1; transform:translateY(0); } }
  @keyframes ft-line { from { transform:scaleX(0); }                  to { transform:scaleX(1); }                 }

  .ft-ce:focus { outline: none; }
  .ft-ce[contenteditable="true"] {
    border-bottom: 1px dashed rgba(255,255,255,0.2);
    cursor: text; padding-bottom: 1px;
  }
  .ft-ce[contenteditable="true"]:focus { outline: none; }

  .ft-social-btn {
    transition: background 0.22s ease, transform 0.22s cubic-bezier(0.34,1.56,0.64,1);
  }
  .ft-social-btn:hover {
    background: rgba(255,255,255,0.12) !important;
    transform: translateY(-3px);
  }

  .ft-link {
    opacity: 0.45;
    transition: opacity 0.18s ease, padding-left 0.18s ease;
    display: inline-block;
  }
  .ft-link:hover { opacity: 1; padding-left: 4px; }

  .ft-bottom-link {
    opacity: 0.38;
    transition: opacity 0.18s ease;
  }
  .ft-bottom-link:hover { opacity: 0.75; }
  .ft-grid {
    display: grid;
    grid-template-columns: 2fr repeat(3, 1fr);
    gap: 0 56px;
  }

  .ft-minimal {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 20px 32px;
    flex-wrap: wrap;
  }
  .ft-inline-links, .ft-link-list {
    list-style: none;
    margin: 0;
    padding: 0;
  }
  .ft-inline-links {
    display: flex;
    flex-wrap: wrap;
    gap: 8px 22px;
  }
  .ft-link-list {
    display: flex;
    flex-direction: column;
    gap: 12px;
  }
  .ft-ink {
    color: inherit;
    text-decoration: none;
    opacity: 0.72;
  }
  .ft-ink:hover { opacity: 1; }
  .ft-hit {
    position: relative;
    display: inline-flex;
    align-items: center;
    max-width: 100%;
  }
  .ft-go {
    position: absolute;
    top: -22px;
    right: -4px;
    width: 22px;
    height: 22px;
    border-radius: 999px;
    background: #0f172a;
    color: #fff;
    border: 2px solid #fff;
    display: none;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    z-index: 40;
    padding: 0;
    line-height: 0;
    box-shadow: 0 2px 8px rgba(15, 23, 42, 0.22);
  }
  .ft-hit:hover .ft-go { display: inline-flex; }
  .ft-go:hover { background: #1d4ed8; }
  .ft-stack {
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
    gap: 18px;
  }
  .ft-news, .ft-contact {
    display: grid;
    gap: 48px;
    align-items: start;
  }
  .ft-news { grid-template-columns: minmax(0, 1.15fr) minmax(0, 1fr); }
  .ft-contact { grid-template-columns: minmax(0, 1.25fr) minmax(0, 0.9fr); }
  .ft-split-cols, .ft-mega-cols, .ft-band-grid {
    display: grid;
    gap: 28px;
  }
  .ft-split-cols { grid-template-columns: 1fr 1fr; }
  .ft-mega-top {
    display: flex;
    justify-content: space-between;
    align-items: flex-end;
    gap: 32px;
    margin-bottom: 48px;
  }
  .ft-mega-cols { grid-template-columns: repeat(4, minmax(0, 1fr)); }
  .ft-band-card { border-radius: 28px; padding: 40px 40px 32px; }
  .ft-band-grid { grid-template-columns: minmax(0, 1.2fr) minmax(0, 1fr) minmax(0, 1fr); }

  @media (max-width: 768px) {
    .ft-grid {
      grid-template-columns: 1fr;
      gap: 48px 0;
    }
    .ft-brand {
      padding-right: 0 !important;
    }
    .ft-wrapper {
      padding-left: 20px !important;
      padding-right: 20px !important;
      padding-top: 40px !important;
    }
    .ft-news, .ft-contact, .ft-split-cols, .ft-mega-cols, .ft-band-grid {
      grid-template-columns: 1fr;
    }
    .ft-mega-top { flex-direction: column; align-items: flex-start; }
  }
`;

function InjectStyles() {
  if (typeof document === 'undefined') return null;
  let el = document.getElementById('footer-preview-styles');
  if (!el) {
    el = document.createElement('style');
    el.id = 'footer-preview-styles';
    document.head.appendChild(el);
  }
  if (el.textContent !== STYLES) el.textContent = STYLES;
  return null;
}

export function FooterPreview({ config: rawConfig, isEditing, onUpdate }) {
  const navigate = useNavigate();
  const { updatePageName, pages, setActivePage, createPage, state } = useBuilder();
  const { editor } = state;

  if (!rawConfig) return null;
  const config = {
    ...rawConfig,
    logo: rawConfig.logo && typeof rawConfig.logo === 'object' ? rawConfig.logo : { text: rawConfig.logo || 'Logo', imageUrl: '' },
    columns: Array.isArray(rawConfig.columns) ? rawConfig.columns : [],
    socialLinks: Array.isArray(rawConfig.socialLinks) ? rawConfig.socialLinks : [],
    description: rawConfig.description || '',
    copyright: rawConfig.copyright || rawConfig.text || '',
    styles: rawConfig.styles || {},
  };

  const styles = config.styles;
  const bg = styles.backgroundColor || 'var(--theme-bg, #0a0a0f)';
  const tc = styles.textColor || 'var(--theme-text, #f8fafc)';

  const handleFooterClick = (e) => {
    if (!isEditing) return;
    if (e.target.closest('a, button')) return;
    e.stopPropagation();
    useBuilderStore.getState().selectNode('footer', 'footer');
  };

  // ── Enhanced link click handler with preview mode support ──────────────────────
  const handleLinkClick = (e, link, column) => {
    // Scroll to top on any footer link click
    window.scrollTo({ top: 0, behavior: 'smooth' });
    
    // If in preview mode, handle navigation differently
    if (editor.previewMode) {
      const target = pages.find(p => p.slug === link.href);
      if (target) {
        e.preventDefault();
        setActivePage(target.id);
        return;
      }
      // If page doesn't exist, create it in preview mode
      if (link.href && link.href.startsWith('/')) {
        e.preventDefault();
        const slug = link.href;
        let newPage = null;
        switch (slug) {
          case '/features':  newPage = createFeaturesPage();      break;
          case '/services':  newPage = createServicesPage();      break;
          case '/pricing':   newPage = createPricingPage();       break;
          case '/contact':   newPage = createContactPage();       break;
          case '/start':     newPage = createStartPage();         break;
          case '/templates': newPage = createTemplatesPage();     break;
          case '/about':     newPage = createAboutPage();         break;
          case '/blog':      newPage = createBlogPage();          break;
          case '/careers':   newPage = createCareersPage();       break;
          case '/help':      newPage = createHelpPage();          break;
          case '/status':    newPage = createStatusPage();        break;
          case '/privacy':   newPage = createPrivacyPolicyPage(); break;
          case '/terms':     newPage = createTermsOfServicePage();break;
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
        return;
      }
      // For external links, allow default behavior
      return;
    }
    
    // Original editing mode logic
    if (isEditing) {
      const target = pages.find(p => p.slug === link.href);
      if (target) {
        e.preventDefault();
        setActivePage(target.id);
      } else if (link.href && link.href.startsWith('/')) {
        e.preventDefault();
        const slug = link.href;
        let newPage = null;
        switch (slug) {
          case '/features':  newPage = createFeaturesPage();      break;
          case '/services':  newPage = createServicesPage();      break;
          case '/pricing':   newPage = createPricingPage();       break;
          case '/contact':   newPage = createContactPage();       break;
          case '/start':     newPage = createStartPage();         break;
          case '/templates': newPage = createTemplatesPage();     break;
          case '/about':     newPage = createAboutPage();         break;
          case '/blog':      newPage = createBlogPage();          break;
          case '/careers':   newPage = createCareersPage();       break;
          case '/help':      newPage = createHelpPage();          break;
          case '/status':    newPage = createStatusPage();        break;
          case '/privacy':   newPage = createPrivacyPolicyPage(); break;
          case '/terms':     newPage = createTermsOfServicePage();break;
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
      return;
    }
    if (link.href && link.href.startsWith('/')) {
      e.preventDefault();
      navigate(link.href);
    }
  };

  const handlePrivacyClick = (e) => {
    e.preventDefault();
    // Scroll to top on privacy policy click
    window.scrollTo({ top: 0, behavior: 'smooth' });
    
    const target = pages.find(p => p.slug === '/privacy');
    if (target) { 
      setActivePage(target.id); 
    } else { 
      createPage(createPrivacyPolicyPage()); 
    }
    
    // Only navigate if not in preview mode
    if (!editor.previewMode && !isEditing) {
      navigate('/privacy', { replace: true });
    }
  };

  const handleTermsClick = (e) => {
    e.preventDefault();
    // Scroll to top on terms of service click
    window.scrollTo({ top: 0, behavior: 'smooth' });
    
    const target = pages.find(p => p.slug === '/terms');
    if (target) { 
      setActivePage(target.id); 
    } else { 
      createPage(createTermsOfServicePage()); 
    }
    
    // Only navigate if not in preview mode
    if (!editor.previewMode && !isEditing) {
      navigate('/terms', { replace: true });
    }
  };

  const variant = String(config.style || 'columns');
  const variantLayouts = new Set(['minimal', 'centered', 'newsletter', 'contact', 'mega', 'band']);
  if (variantLayouts.has(variant)) {
    return (
      <FooterEditRoot isEditing={Boolean(isEditing)} onUpdate={onUpdate} placements={config.placements}>
      <footer
        data-footer-root=""
        style={{
          backgroundColor: variant === 'band' ? (styles.surface || '#eef2f7') : bg,
          color: tc,
          position: 'relative',
        }}
        className={isEditing ? 'cursor-pointer' : ''}
        onClick={handleFooterClick}
      >
        <InjectStyles />
        <FooterVariant
          variant={variant}
          config={config}
          isEditing={isEditing}
          onUpdate={onUpdate}
          textColor={tc}
          backgroundColor={bg}
          onLinkClick={handleLinkClick}
        />
      </footer>
      </FooterEditRoot>
    );
  }

  return (
    <FooterEditRoot isEditing={Boolean(isEditing)} onUpdate={onUpdate} placements={config.placements}>
    <footer
      data-footer-root=""
      style={{ backgroundColor: bg, color: tc, position: 'relative', overflow: 'visible' }}
      className={isEditing ? 'cursor-pointer' : ''}
      onClick={handleFooterClick}
    >
      <InjectStyles />

      {/* ── Ambient texture ─────────────────────────────────────────── */}
      <div style={{
        position: 'absolute', inset: 0, pointerEvents: 'none',
        backgroundImage: 'radial-gradient(ellipse at 80% 0%, rgba(255,255,255,0.03) 0%, transparent 55%), radial-gradient(ellipse at 5% 100%, rgba(255,255,255,0.02) 0%, transparent 50%)',
      }} />

      {/* ── Top accent line ─────────────────────────────────────────── */}
      <div style={{
        height: 1,
        background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.12) 30%, rgba(255,255,255,0.12) 70%, transparent)',
      }} />

      <div style={{ maxWidth: 1240, margin: '0 auto', padding: '48px 24px 0' }} className="ft-wrapper">

        {/* ── Main grid ─────────────────────────────────────────────── */}
        <div className="ft-grid" style={{ marginBottom: 64 }}>

          {/* ── Brand column ──────────────────────────────────────── */}
          <div className="ft-brand" style={{ paddingRight: 40 }}>
            {/* Logo */}
            <div style={{ marginBottom: 24 }}>
              <MovablePiece id="logo">
              {config.logo.imageUrl ? (
                <img src={config.logo.imageUrl} alt="Logo" style={{ height: 36 }} />
              ) : (
                <span
                  className="ft-ce"
                  style={{
                    fontFamily: "'Instrument Serif', serif",
                    fontSize: 26, fontStyle: 'italic',
                    color: tc, display: 'block', marginBottom: 0,
                  }}
                  contentEditable={isEditing}
                  suppressContentEditableWarning
                  onBlur={(e) => onUpdate({ logo: { ...config.logo, text: e.target.innerText } })}
                >
                  {config.logo.text}
                </span>
              )}
              </MovablePiece>
            </div>

            {/* Thin rule */}
            <div style={{
              width: 32, height: 1,
              background: 'rgba(255,255,255,0.2)',
              marginBottom: 20,
            }} />

            {/* Description */}
            <MovablePiece id="description" block>
            <p
              className="ft-ce"
              style={{
                fontFamily: "'Geist', sans-serif",
                fontSize: 14, lineHeight: 1.75,
                color: tc, opacity: 0.52, maxWidth: 280, marginBottom: 32,
              }}
              contentEditable={isEditing}
              suppressContentEditableWarning
              onBlur={(e) => onUpdate({ description: e.target.innerText })}
            >
              {config.description}
            </p>
            </MovablePiece>

            {/* Social icons */}
            <MovablePiece id="social">
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              {config.socialLinks.map((social) => {
                const Icon = socialIcons[social.platform] || Globe;
                const isContact = ['email', 'phone', 'location'].includes(social.platform);
                return (
                  <a
                    key={social.id}
                    href={social.href}
                    target={isContact ? '_self' : '_blank'}
                    rel={isContact ? '' : 'noopener noreferrer'}
                    className="ft-social-btn"
                    style={{
                      width: 36, height: 36, borderRadius: '6px',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      background: 'rgba(255,255,255,0.07)',
                      color: tc, textDecoration: 'none',
                    }}
                    onClick={(e) => {
                      if (social.platform === "email") {
                        e.preventDefault();
                        window.location.href = `mailto:${social.href.replace("mailto:", "")}`;
                      } else if (social.platform === "phone") {
                        e.preventDefault();
                        window.location.href = `tel:${social.href.replace("tel:", "")}`;
                      } else if (social.platform === "location") {
                        e.preventDefault();
                        window.open(`https://maps.google.com/?q=${encodeURIComponent(social.href)}`, "_blank");
                      }
                    }}
                  >
                    <Icon size={15} />
                  </a>
                );
              })}
              {config.socialLinks.length === 0 && (
                <div style={{ fontFamily: "'Geist', sans-serif", fontSize: 11, opacity: 0.3, fontStyle: 'italic' }}>
                  No social links yet
                </div>
              )}
            </div>
            </MovablePiece>
          </div>

          {/* ── Nav columns ─────────────────────────────────────── */}
          {config.columns.map((column, colIdx) => (
            <div key={column.id}>
              {/* Column title */}
              <MovablePiece id={`column-${column.id}`} block>
              <h4
                className="ft-ce"
                style={{
                  fontFamily: "'Geist', sans-serif",
                  fontSize: 10, fontWeight: 600,
                  letterSpacing: '0.18em', textTransform: 'uppercase',
                  color: tc, opacity: 0.38,
                  marginBottom: 20,
                }}
                contentEditable={isEditing}
                suppressContentEditableWarning
                onBlur={(e) =>
                  onUpdate({
                    columns: config.columns.map((c) =>
                      c.id === column.id ? { ...c, title: e.target.innerText } : c
                    ),
                  })
                }
              >
                {column.title}
              </h4>
              </MovablePiece>

              {/* Links */}
              <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 12 }}>
                {column.links.map((link) => (
                  <li key={link.id}>
                    <DefaultFooterLink
                      link={link}
                      isEditing={Boolean(isEditing)}
                      onLabel={(newLabel) => {
                        onUpdate({
                          columns: config.columns.map((c) =>
                            c.id === column.id
                              ? { ...c, links: c.links.map((l) => l.id === link.id ? { ...l, label: newLabel } : l) }
                              : c
                          ),
                        });
                        if (link.href && link.href.startsWith('/')) {
                          updatePageName(link.href, newLabel);
                        }
                      }}
                    />
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* ── Bottom bar ──────────────────────────────────────────────── */}
        <div style={{
  borderTop: '1px solid rgba(255,255,255,0.07)',
  padding: '24px 0 40px',
  display: 'flex',
  justifyContent: 'center', // ✅ changed
  alignItems: 'center',
  gap: 16,
  flexWrap: 'wrap',
}}>
  {/* Copyright */}
  <MovablePiece id="copyright">
  <p
    className="ft-ce"
    style={{
      fontFamily: "'Geist', sans-serif",
      fontSize: 12,
      color: tc,
      opacity: 0.35,
      margin: 0,
      textAlign: 'center', // ✅ optional (safe)
           // ✅ ensures proper centering
    }}
    contentEditable={isEditing}
    suppressContentEditableWarning
    onBlur={(e) => onUpdate({ copyright: e.target.innerText })}
  >
    {config.copyright}
  </p>
  </MovablePiece>
</div>


      </div>
    </footer>
    </FooterEditRoot>
  );
}

function DefaultFooterLink({
  link,
  isEditing,
  onLabel,
}: {
  link: { id: string; label: string; href: string };
  isEditing: boolean;
  onLabel: (label: string) => void;
}) {
  const openLinkTarget = useFooterLinkOpen();
  return (
    <MovablePiece id={`link-${link.id}`}>
      <FooterLinkHit link={link}>
        <a
          href={link.href}
          className="ft-link ft-ce"
          style={{ fontFamily: "'Geist', sans-serif", fontSize: 14, textDecoration: 'none' }}
          onClick={(event) => {
            event.preventDefault();
            event.stopPropagation();
            if (isEditing) return;
            openLinkTarget(link);
          }}
          contentEditable={isEditing}
          suppressContentEditableWarning
          onBlur={(event) => onLabel(event.currentTarget.innerText)}
        >
          {link.label}
        </a>
      </FooterLinkHit>
    </MovablePiece>
  );
}