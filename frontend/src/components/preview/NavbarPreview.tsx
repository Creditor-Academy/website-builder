import React, { useState } from 'react';
import { Menu, X } from 'lucide-react';
import { useBuilder } from '@/contexts/BuilderContext';
import { useNavigate } from 'react-router-dom';
import {
  createDefaultHeroSection, createDefaultCTASection, createDefaultFooter,
  createDefaultNavbar, createFeaturesPage, createServicesPage, createPricingPage,
  createContactPage, createStartPage, createTemplatesPage, createAboutPage,
  createBlogPage, createCareersPage, createHelpPage, createStatusPage,
  createPrivacyPolicyPage, createTermsOfServicePage
} from '@/lib/defaultPageData';
import { v4 as uuidv4 } from 'uuid';

// ─── Styles ───────────────────────────────────────────────────────────────
const STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=Fraunces:ital,wght@0,700;0,900;1,400&family=Geist:wght@300;400;500;600&display=swap');

  @keyframes nb-down  { from { opacity:0; transform:translateY(-10px); } to { opacity:1; transform:translateY(0); } }
  @keyframes nb-fade  { from { opacity:0; } to { opacity:1; } }
  @keyframes nb-slide { from { opacity:0; transform:translateX(-6px); } to { opacity:1; transform:translateX(0); } }

  .nb-ce:focus { outline: none; }
  .nb-ce[contenteditable="true"] {
    border-bottom: 1px dashed rgba(0,0,0,0.18);
    cursor: text; padding-bottom: 1px;
  }
  .nb-ce[contenteditable="true"]:focus { outline: none; }
  .nb-ce-inv[contenteditable="true"] {
    border-bottom: 1px dashed rgba(255,255,255,0.25);
    cursor: text;
  }

  /* Nav link underline reveal */
  .nb-link {
    position: relative;
    font-family: 'Geist', sans-serif;
    font-size: 13px; font-weight: 500;
    letter-spacing: 0.02em;
    text-decoration: none;
    transition: opacity 0.18s ease;
    padding-bottom: 2px;
  }
  .nb-link::after {
    content: '';
    position: absolute; bottom: -2px; left: 0; right: 0;
    height: 1.5px; background: currentColor;
    transform: scaleX(0); transform-origin: right;
    transition: transform 0.25s ease;
  }
  .nb-link:hover::after { transform: scaleX(1); transform-origin: left; }
  .nb-link:hover { opacity: 0.65; }

  /* CTA button */
  .nb-cta {
    font-family: 'Geist', sans-serif;
    font-size: 11px; font-weight: 600;
    letter-spacing: 0.14em; text-transform: uppercase;
    text-decoration: none;
    padding: 10px 20px;
    border-radius: 2px;
    transition: opacity 0.2s ease, transform 0.2s cubic-bezier(0.34,1.56,0.64,1);
    display: inline-flex; align-items: center; gap: 6px;
  }
  .nb-cta:hover { opacity: 0.88; transform: translateY(-1px); }

  /* Mobile menu link */
  .nb-mob-link {
    font-family: 'Geist', sans-serif;
    font-size: 15px; font-weight: 400;
    text-decoration: none;
    display: block; padding: 14px 0;
    border-bottom: 1px solid rgba(0,0,0,0.07);
    letter-spacing: 0.01em;
    transition: padding-left 0.18s ease, opacity 0.18s ease;
    animation: nb-slide 0.3s ease both;
  }
  .nb-mob-link:hover { padding-left: 6px; opacity: 0.65; }
  .nb-mob-link:last-child { border-bottom: none; }

  /* Hamburger */
  .nb-ham {
    width: 36px; height: 36px;
    display: flex; flex-direction: column;
    align-items: center; justify-content: center; gap: 5px;
    cursor: pointer; background: none; border: none; padding: 0;
    transition: opacity 0.2s;
  }
  .nb-ham:hover { opacity: 0.6; }
  .nb-ham-line {
    height: 1.5px; background: currentColor;
    transition: width 0.2s ease;
  }
`;

function InjectStyles() {
  if (typeof document !== 'undefined' && !document.getElementById('navbar-preview-styles')) {
    const el = document.createElement('style');
    el.id = 'navbar-preview-styles';
    el.textContent = STYLES;
    document.head.appendChild(el);
  }
  return null;
}

// ─── Page factory helper (original switch logic) ──────────────────────────
function buildPage(slug, label) {
  switch (slug) {
    case '/about':    return createAboutPage();
    case '/services': return createServicesPage();
    case '/pricing':  return createPricingPage();
    case '/contact':  return createContactPage();
    case '/start':    return createStartPage();
    case '/templates':return createTemplatesPage();
    case '/features': return createFeaturesPage();
    case '/blog':     return createBlogPage();
    case '/careers':  return createCareersPage();
    case '/help':     return createHelpPage();
    case '/status':   return createStatusPage();
    case '/privacy':  return createPrivacyPolicyPage();
    case '/terms':    return createTermsOfServicePage();
    default:
      return {
        id: uuidv4(),
        name: label || slug.replace('/', '') || 'New Page',
        slug,
        navbar: createDefaultNavbar(),
        sections: [createDefaultHeroSection(), createDefaultCTASection()],
        footer: createDefaultFooter(),
      };
  }
}

export function NavbarPreview({ config, isEditing, onUpdate }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { pages, setActivePage, updatePageName, createPage, selectSection, state } = useBuilder();
  const navigate = useNavigate();
  const { editor } = state;

  const navBg =
    config.styles.backgroundColor && config.styles.backgroundColor !== 'transparent'
      ? config.styles.backgroundColor
      : 'var(--theme-bg, #ffffff)';

  const tc = config.styles.textColor || 'var(--theme-text, #0f172a)';

  // ── Enhanced handleNavClick logic with preview mode support ──────────────────────────
  const handleNavClick = (e, link) => {
    // Scroll to top on any navigation click
    window.scrollTo({ top: 0, behavior: 'smooth' });
    
    // If in preview mode, handle navigation differently
    if (editor.previewMode) {
      const targetPage = pages.find((p) => p.slug === link.href);
      if (targetPage) {
        e.preventDefault();
        setActivePage(targetPage.id);
        setMobileMenuOpen(false);
        return;
      }
      // If page doesn't exist, create it in preview mode
      if (link.href && link.href.startsWith('/')) {
        e.preventDefault();
        createPage(buildPage(link.href, link.label));
        setMobileMenuOpen(false);
        return;
      }
      // For external links, allow default behavior
      return;
    }
    
    // Original editing mode logic
    if (isEditing) {
      const targetPage = pages.find((p) => p.slug === link.href);
      if (targetPage) {
        e.preventDefault(); setActivePage(targetPage.id); setMobileMenuOpen(false); return;
      }
      if (link.href && link.href.startsWith('/')) {
        e.preventDefault();
        createPage(buildPage(link.href, link.label));
        setMobileMenuOpen(false);
      }
      return;
    }
    if (link.href && link.href.startsWith('/')) {
      // Check if this slug exists in the builder's internal pages
      const targetPage = pages.find((p) => p.slug === link.href);
      if (targetPage) { setActivePage(targetPage.id); setMobileMenuOpen(false); return; }
      createPage(buildPage(link.href, link.label));
      setMobileMenuOpen(false);
    }
  };

  const handleNavbarClick = (e) => {
    if (isEditing && e.target.closest('a, button') === null) {
      e.stopPropagation(); selectSection(null);
    }
  };

  const isLight = (() => {
    if (!navBg || navBg === 'transparent') return true;
    const hex = navBg.replace('#', '');
    if (hex.length < 6) return true;
    const r = parseInt(hex.substr(0, 2), 16);
    const g = parseInt(hex.substr(2, 2), 16);
    const b = parseInt(hex.substr(4, 2), 16);
    return (r * 299 + g * 587 + b * 114) / 1000 > 128;
  })();

  return (
    <nav
      style={{
        backgroundColor: navBg,
        color: tc,
        position: config.styles.sticky ? 'sticky' : 'relative',
        top: config.styles.sticky ? 0 : undefined,
        zIndex: 50,
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
        cursor: isEditing ? 'pointer' : 'default',
        borderBottom: `1px solid ${isLight ? 'rgba(0,0,0,0.08)' : 'rgba(255,255,255,0.07)'}`,
        animation: 'nb-down 0.4s ease both',
      }}
      onClick={handleNavbarClick}
    >
      <InjectStyles />

      <div style={{
        maxWidth: 1240, margin: '0 auto',
        padding: '0 40px',
        height: 68,
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      }}>

        {/* ── Logo ─────────────────────────────────────────────── */}
        <div style={{ flexShrink: 0, display: 'flex', alignItems: 'center' }}>
          {config.logo.imageUrl ? (
            <img src={config.logo.imageUrl} alt="Logo" style={{ height: 34 }} />
          ) : (
            <span
              className={`nb-ce ${isLight ? '' : 'nb-ce-inv'}`}
              style={{
                fontFamily: "'Fraunces', serif",
                fontSize: 22, fontWeight: 900, fontStyle: 'italic',
                color: tc, letterSpacing: '-0.02em',
              }}
              contentEditable={isEditing}
              suppressContentEditableWarning
              onBlur={(e) => onUpdate({ logo: { ...config.logo, text: e.target.innerText } })}
            >
              {config.logo.text}
            </span>
          )}
        </div>

        {/* ── Desktop links ─────────────────────────────────────── */}
        <div style={{
          display: 'flex', alignItems: 'center', gap: 36,
        }}
          className="nb-desktop-links"
        >
          {config.links.map((link) =>
            link.isButton ? (
              <a
                key={link.id}
                href={link.href}
                className="nb-cta"
                onClick={(e) => handleNavClick(e, link)}
                style={{ 
                  background: config.styles.buttonBg || '#0f172a', 
                  color: config.styles.buttonText || '#fff',
                  borderRadius: config.styles.buttonRadius || '2px'
                }}
              >
                {link.label}
              </a>
            ) : (
              <a
                key={link.id}
                href={link.href}
                className={`nb-link nb-ce ${isLight ? '' : 'nb-ce-inv'}`}
                onClick={(e) => handleNavClick(e, link)}
                style={{ color: tc }}
                contentEditable={isEditing}
                suppressContentEditableWarning
                onBlur={(e) => {
                  const newLabel = e.target.innerText;
                  onUpdate({ links: config.links.map((l) => l.id === link.id ? { ...l, label: newLabel } : l) });
                  if (link.href && link.href.startsWith('/')) updatePageName(link.href, newLabel);
                }}
              >
                {link.label}
              </a>
            )
          )}
        </div>

        {/* ── Mobile hamburger ──────────────────────────────────── */}
        <button
          className="nb-ham"
          style={{ color: tc, display: 'none' }}
          id="nb-hamburger"
          onClick={(e) => { e.stopPropagation(); setMobileMenuOpen((o) => !o); }}
          aria-label="Toggle menu"
        >
          {mobileMenuOpen
            ? <X size={20} />
            : <>
                <div className="nb-ham-line" style={{ width: 22 }} />
                <div className="nb-ham-line" style={{ width: 16 }} />
              </>
          }
        </button>
      </div>

      {/* ── Mobile menu ──────────────────────────────────────────── */}
      <div
        style={{
          backgroundColor: navBg,
          borderTop: `1px solid ${isLight ? 'rgba(0,0,0,0.07)' : 'rgba(255,255,255,0.07)'}`,
          overflow: 'hidden',
          maxHeight: mobileMenuOpen ? 600 : 0,
          opacity: mobileMenuOpen ? 1 : 0,
          transition: 'max-height 0.32s ease, opacity 0.25s ease',
          display: 'none',
        }}
        id="nb-mobile-menu"
      >
        <div style={{ padding: '8px 40px 28px' }}>
          {config.links.map((link, i) =>
            link.isButton ? (
              <a
                key={link.id}
                href={link.href}
                onClick={(e) => handleNavClick(e, link)}
                style={{
                  display: 'block', marginTop: 16,
                  background: config.styles.buttonBg || '#0f172a', 
                  color: config.styles.buttonText || '#fff',
                  padding: '13px 20px', 
                  borderRadius: config.styles.buttonRadius || '2px',
                  fontFamily: "'Geist', sans-serif",
                  fontSize: 11, fontWeight: 600,
                  letterSpacing: '0.14em', textTransform: 'uppercase',
                  textAlign: 'center', textDecoration: 'none',
                }}
              >
                {link.label}
              </a>
            ) : (
              <a
                key={link.id}
                href={link.href}
                className="nb-mob-link nb-ce"
                onClick={(e) => handleNavClick(e, link)}
                style={{ color: tc, animationDelay: `${i * 0.04}s` }}
                contentEditable={isEditing}
                suppressContentEditableWarning
                onBlur={(e) =>
                  onUpdate({ links: config.links.map((l) => l.id === link.id ? { ...l, label: e.target.innerText } : l) })
                }
              >
                {link.label}
              </a>
            )
          )}
        </div>
      </div>

      {/* Responsive CSS via style tag — shows mobile button & menu below md */}
      <style>{`
        @media (max-width: 768px) {
          #nb-hamburger { display: flex !important; }
          #nb-mobile-menu { display: block !important; }
          .nb-desktop-links { display: none !important; }
        }
      `}</style>
    </nav>
  );
}