import React from "react";
import { useNavigate } from 'react-router-dom';
import { useBuilder } from '@/contexts/BuilderContext';
import { createDefaultHeroSection, createDefaultCTASection, createDefaultFooter, createDefaultNavbar, createFeaturesPage, createServicesPage, createPricingPage, createContactPage, createStartPage, createTemplatesPage, createAboutPage, createBlogPage, createCareersPage, createHelpPage, createStatusPage, createPrivacyPolicyPage, createTermsOfServicePage, createMarketingPage, createDesignPage, createDevPage, createExecutiveStrategyPage, createRevenueGrowthPage, createMarketExpansionPage } from '@/lib/defaultPageData';
import {
  Facebook, Twitter, Instagram, Linkedin, Youtube,
  Github, Mail, Phone, MapPin, Globe, MessageCircle, ArrowUpRight,
} from "lucide-react";

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
`;

function InjectStyles() {
  if (typeof document !== 'undefined' && !document.getElementById('footer-preview-styles')) {
    const el = document.createElement('style');
    el.id = 'footer-preview-styles';
    el.textContent = STYLES;
    document.head.appendChild(el);
  }
  return null;
}

export function FooterPreview({ config, isEditing, onUpdate }) {
  const navigate = useNavigate();
  const { updatePageName, pages, setActivePage, createPage, selectSection, state } = useBuilder();
  const { editor } = state;

  const bg = config.styles.backgroundColor || 'var(--theme-bg, #0a0a0f)';
  const tc = config.styles.textColor || 'var(--theme-text, #f8fafc)';

  const handleFooterClick = (e) => {
    if (isEditing && e.target.closest('a, button') === null) {
      e.stopPropagation();
      selectSection(null);
    }
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

  return (
    <footer
      style={{ backgroundColor: bg, color: tc, position: 'relative', overflow: 'hidden' }}
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

      <div style={{ maxWidth: 1240, margin: '0 auto', padding: '72px 40px 0', position: 'relative' }}>

        {/* ── Main grid ─────────────────────────────────────────────── */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: '2fr repeat(3, 1fr)',
          gap: '0 56px',
          marginBottom: 64,
        }}>

          {/* ── Brand column ──────────────────────────────────────── */}
          <div style={{ paddingRight: 40 }}>
            {/* Logo */}
            <div style={{ marginBottom: 24 }}>
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
            </div>

            {/* Thin rule */}
            <div style={{
              width: 32, height: 1,
              background: 'rgba(255,255,255,0.2)',
              marginBottom: 20,
            }} />

            {/* Description */}
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

            {/* Social icons */}
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              {config.socialLinks.map((social) => {
                const Icon = socialIcons[social.platform];
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
                      if (social.platform === 'email') { e.preventDefault(); window.location.href = `mailto:${social.href.replace('mailto:', '')}`; }
                      else if (social.platform === 'phone') { e.preventDefault(); window.location.href = `tel:${social.href.replace('tel:', '')}`; }
                      else if (social.platform === 'location') { e.preventDefault(); window.open(`https://maps.google.com/?q=${encodeURIComponent(social.href)}`, '_blank'); }
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
          </div>

          {/* ── Nav columns ─────────────────────────────────────── */}
          {config.columns.map((column, colIdx) => (
            <div key={column.id}>
              {/* Column title */}
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

              {/* Links */}
              <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 12 }}>
                {column.links.map((link) => (
                  <li key={link.id}>
                    <a
                      href={link.href}
                      className="ft-link ft-ce"
                      style={{
                        fontFamily: "'Geist', sans-serif",
                        fontSize: 14, color: tc,
                        textDecoration: 'none',
                      }}
                      onClick={(e) => handleLinkClick(e, link, column)}
                      contentEditable={isEditing}
                      suppressContentEditableWarning
                      onBlur={(e) => {
                        const newLabel = e.target.innerText;
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
                    >
                      {link.label}
                    </a>
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
</div>


      </div>
    </footer>
  );
}