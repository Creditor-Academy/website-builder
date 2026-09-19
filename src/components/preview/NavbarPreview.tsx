import React, { useState } from 'react';
import { ArrowUpRight, X } from 'lucide-react';
import { useBuilder } from '@/contexts/BuilderContext';
import useBuilderStore from '@/store/useBuilderStore';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';

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

  /* CTA button — label is optically centered in the pill */
  .nb-cta {
    font-family: 'Geist', sans-serif, system-ui, sans-serif;
    font-size: 12px;
    font-weight: 600;
    text-transform: uppercase;
    text-decoration: none;
    height: 36px;
    min-width: 108px;
    padding: 0 18px;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    text-align: center;
    line-height: 1;
    white-space: nowrap;
    box-sizing: border-box;
    flex-shrink: 0;
    overflow: hidden;
    border: none;
    box-shadow: 0 1px 2px rgba(15, 23, 42, 0.14);
    transition: transform 0.18s ease, box-shadow 0.18s ease, background-color 0.18s ease;
  }
  .nb-cta:hover { transform: translateY(-1px); box-shadow: 0 6px 14px rgba(15, 23, 42, 0.16); }
  .nb-cta-ghost { box-shadow: none; }
  .nb-cta-ghost:hover { box-shadow: none; background: rgba(15, 23, 42, 0.06) !important; }
  .nb-hit {
    position: relative;
    display: inline-flex;
    align-items: center;
  }
  .nb-go {
    position: absolute;
    top: -9px;
    right: -9px;
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
  .nb-hit:hover .nb-go { display: inline-flex; }
  .nb-go:hover { background: #1d4ed8; }
  .nb-cta-label {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    line-height: 1;
    letter-spacing: 0.06em;
    margin-right: -0.06em;
    padding-top: 1px;
    white-space: nowrap;
  }
  .nb-cta.nb-ce[contenteditable="true"],
  .nb-cta .nb-ce[contenteditable="true"] {
    border-bottom: none !important;
    padding-bottom: 0 !important;
  }

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
  /* Responsive nav container */
  .nb-inner {
    max-width: 1240px;
    margin: 0 auto;
    padding: 0 40px;
    height: 72px;
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
  @media (max-width: 768px) {
    .nb-inner {
      padding: 0 20px;
      height: 60px;
    }
  }
`;

function InjectStyles() {
  if (typeof document === 'undefined') return null;
  let el = document.getElementById('navbar-preview-styles');
  if (!el) {
    el = document.createElement('style');
    el.id = 'navbar-preview-styles';
    document.head.appendChild(el);
  }
  if (el.textContent !== STYLES) el.textContent = STYLES;
  return null;
}

function isExternalHref(href: string) {
  return /^(https?:|mailto:|tel:)/i.test(href);
}

function normalizePageSlug(href?: string, label?: string) {
  const raw = String(href || '').trim();
  if (!raw || raw === '#') {
    const fromLabel = String(label || 'new-page')
      .trim()
      .toLowerCase()
      .replace(/\s+/g, '-')
      .replace(/[^a-z0-9-]/g, '');
    return `/${fromLabel || 'new-page'}`;
  }
  if (isExternalHref(raw)) return raw;
  const path = raw.split(/[?#]/)[0];
  const slug = path.startsWith('/') ? path : `/${path}`;
  return slug.replace(/\/+$/, '') || '/';
}

function findPageForHref(pages: Array<{ id: string; slug?: string }>, href: string, label?: string) {
  const slug = normalizePageSlug(href, label).toLowerCase();
  return pages.find((page) => normalizePageSlug(page.slug).toLowerCase() === slug) || null;
}

export function NavbarPreview({ config: rawConfig, isEditing, onUpdate, selectedItemId, onSelectItem }) {
  const config = {
    ...rawConfig,
    logo: rawConfig.logo && typeof rawConfig.logo === 'object' ? rawConfig.logo : { text: rawConfig.logo || 'Logo', imageUrl: '' },
    links: Array.isArray(rawConfig.links) ? rawConfig.links : [],
    styles: rawConfig.styles || {},
  };
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [pendingLink, setPendingLink] = useState(null);
  const { pages, setActivePage, updatePageName, createPage } = useBuilder();
  const setEditorState = useBuilderStore((store) => store.setEditorState);

  const styles = config.styles;
  const navBg =
    styles.backgroundColor === 'transparent'
      ? 'transparent'
      : (styles.backgroundColor || 'var(--theme-bg, #ffffff)');

  const tc = styles.textColor || 'var(--theme-text, #0f172a)';

  const openPagesSidebar = () => setEditorState({ leftNavTab: 'pages', showLeftPanel: true });

  const goToExistingPage = (pageId: string) => {
    setActivePage(pageId);
    setMobileMenuOpen(false);
    openPagesSidebar();
  };

  const openLinkTarget = (link) => {
    const href = String(link?.href || '').trim();
    if (isExternalHref(href)) {
      window.open(href, '_blank', 'noopener,noreferrer');
      return;
    }
    const target = findPageForHref(pages, href, link?.label);
    if (target) {
      goToExistingPage(target.id);
      return;
    }
    setPendingLink(link);
  };

  const confirmCreatePage = () => {
    if (!pendingLink) return;
    const slug = normalizePageSlug(pendingLink.href, pendingLink.label);
    const name = String(pendingLink.label || slug.replace(/^\//, '') || 'New Page').trim();
    const existing = findPageForHref(pages, slug, name);
    if (existing) {
      goToExistingPage(existing.id);
      setPendingLink(null);
      return;
    }
    createPage({ name, slug, sections: [] });
    openPagesSidebar();
    setPendingLink(null);
    setMobileMenuOpen(false);
  };

  const handleNavClick = (e, link) => {
    if (isEditing && onSelectItem) {
      e.preventDefault();
      e.stopPropagation();
      onSelectItem(`navbar-link-${link.id}`);
      return;
    }

    e.preventDefault();
    e.stopPropagation();
    window.scrollTo({ top: 0, behavior: 'smooth' });
    openLinkTarget(link);
  };

  const handleNavbarClick = (e) => {
    if (!isEditing) return;
    if (e.target.closest('[data-navbar-item], [data-navbar-go]')) return;
    e.stopPropagation();
    onSelectItem?.('navbar');
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

  const variant = String(config.style || 'classic');
  const navLinks = config.links.filter((link) => !link.isButton);
  const ctaLinks = config.links.filter((link) => link.isButton);
  const isCentered = variant === 'centered';
  const isSplit = variant === 'split';

  const buttonRadius = !styles.buttonRadius || styles.buttonRadius === '2px' ? '999px' : styles.buttonRadius;
  const isGhostCta = styles.buttonBg === 'transparent';
  const ctaStyle = {
    background: isGhostCta ? 'transparent' : (styles.buttonBg || '#0f172a'),
    color: styles.buttonText || '#fff',
    borderRadius: buttonRadius,
    border: styles.buttonBorder || 'none',
  };

  const wrapNavItem = (link, node) => (
    <div key={link.id} className="nb-hit">
      {node}
      {isEditing ? (
        <button
          type="button"
          data-navbar-go=""
          className="nb-go"
          title={
            findPageForHref(pages, link.href, link.label)
              ? `Open ${link.label}`
              : `Create page for ${link.label}`
          }
          aria-label={`Go to ${link.label}`}
          onClick={(event) => {
            event.preventDefault();
            event.stopPropagation();
            openLinkTarget(link);
          }}
        >
          <ArrowUpRight size={12} strokeWidth={2.5} />
        </button>
      ) : null}
    </div>
  );

  const renderLink = (link) =>
    wrapNavItem(
      link,
      link.isButton ? (
      <a
        href={link.href}
        data-canvas-node={`navbar-link-${link.id}`}
        data-canvas-kind="navbar"
        data-navbar-item={link.id}
        className={`nb-cta ${isGhostCta ? 'nb-cta-ghost' : ''}`}
        onClick={(e) => handleNavClick(e, link)}
        style={ctaStyle}
      >
        <span
          className="nb-cta-label nb-ce"
          contentEditable={Boolean(isEditing)}
          suppressContentEditableWarning
          onBlur={(e) => {
            const newLabel = e.currentTarget.innerText.trim();
            onUpdate({ links: config.links.map((l) => l.id === link.id ? { ...l, label: newLabel } : l) });
          }}
        >
          {link.label}
        </span>
      </a>
    ) : (
      <a
        href={link.href}
        data-canvas-node={`navbar-link-${link.id}`}
        data-canvas-kind="navbar"
        data-navbar-item={link.id}
        className={`nb-link nb-ce ${isLight ? '' : 'nb-ce-inv'}`}
        onClick={(e) => handleNavClick(e, link)}
        style={{ color: tc, borderRadius: 4 }}
        contentEditable={Boolean(isEditing)}
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
    );

  const logoMark = (
        <div
          data-canvas-node="navbar-logo"
          data-canvas-kind="navbar"
          data-navbar-item="logo"
          className={isCentered ? 'nb-logo-center' : undefined}
          style={{
            flexShrink: 0,
            display: 'flex',
            alignItems: 'center',
            borderRadius: 4,
            cursor: isEditing ? 'pointer' : 'default',
            ...(isCentered ? { position: 'absolute', left: '50%', transform: 'translateX(-50%)' } : {}),
          }}
          onClick={(e) => {
            if (!isEditing) return;
            e.preventDefault();
            e.stopPropagation();
            onSelectItem?.('navbar-logo');
          }}
        >
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
              contentEditable={Boolean(isEditing)}
              suppressContentEditableWarning
              onBlur={(e) => onUpdate({ logo: { ...config.logo, text: e.target.innerText } })}
            >
              {config.logo.text}
            </span>
          )}
        </div>
  );

  return (
    <>
    <nav
      style={{
        backgroundColor: navBg,
        color: tc,
        position: styles.sticky ? 'sticky' : 'relative',
        top: styles.sticky ? 0 : undefined,
        zIndex: 10,
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
        cursor: isEditing ? 'pointer' : 'default',
        borderBottom: variant === 'simple' ? 'none' : `1px solid ${isLight ? 'rgba(15,23,42,0.08)' : 'rgba(255,255,255,0.08)'}`,
        boxShadow: variant === 'simple' ? 'none' : variant === 'split' ? '0 8px 24px rgba(15,23,42,0.18)' : '0 1px 2px rgba(15,23,42,0.04)',
        animation: 'nb-down 0.4s ease both',
      }}
      onClick={handleNavbarClick}
    >
      <InjectStyles />

      <div className="nb-inner" style={{ position: 'relative' }}>
        {isCentered ? (
          <>
            <div className="nb-desktop-links" style={{ display: 'flex', alignItems: 'center', gap: 28 }}>
              {navLinks.map(renderLink)}
            </div>
            {logoMark}
            <div className="nb-desktop-links" style={{ display: 'flex', alignItems: 'center', gap: 16, marginLeft: 'auto' }}>
              {ctaLinks.map(renderLink)}
            </div>
          </>
        ) : isSplit ? (
          <>
            {logoMark}
            <div className="nb-desktop-links" style={{ display: 'flex', flex: 1, alignItems: 'center', justifyContent: 'center', gap: 32 }}>
              {navLinks.map(renderLink)}
            </div>
            <div className="nb-desktop-links" style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              {ctaLinks.map(renderLink)}
            </div>
          </>
        ) : variant === 'simple' ? (
          <>
            <div style={{ display: 'flex', alignItems: 'center', gap: 28, minWidth: 0 }}>
              {logoMark}
              <div className="nb-desktop-links" style={{ display: 'flex', alignItems: 'center', gap: 24 }}>
                {navLinks.map(renderLink)}
              </div>
            </div>
            <div className="nb-desktop-links" style={{ display: 'flex', alignItems: 'center', marginLeft: 'auto' }}>
              {ctaLinks.map(renderLink)}
            </div>
          </>
        ) : (
          <>
            {logoMark}
            <div className="nb-desktop-links" style={{ display: 'flex', alignItems: 'center', gap: 36, marginLeft: 'auto' }}>
              {config.links.map(renderLink)}
            </div>
          </>
        )}

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
                className={`nb-cta ${isGhostCta ? 'nb-cta-ghost' : ''}`}
                style={{
                  ...ctaStyle,
                  display: 'flex',
                  width: '100%',
                  marginTop: 16,
                  height: 44,
                }}
              >
                <span className="nb-cta-label">{link.label}</span>
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
          .nb-logo-center { position: static !important; transform: none !important; }
        }
      `}</style>
    </nav>
    <AlertDialog open={Boolean(pendingLink)} onOpenChange={(open) => { if (!open) setPendingLink(null); }}>
      <AlertDialogContent className="max-w-md rounded-2xl">
        <AlertDialogHeader>
          <AlertDialogTitle>Create this page?</AlertDialogTitle>
          <AlertDialogDescription>
            {pendingLink
              ? `"${pendingLink.label || normalizePageSlug(pendingLink.href, pendingLink.label)}" is not in this site yet. Create an empty page and open it?`
              : 'This page is not in this site yet. Create an empty page and open it?'}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={confirmCreatePage}>Create page</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
    </>
  );
}