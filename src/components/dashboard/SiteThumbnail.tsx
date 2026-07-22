import React, { useRef, useEffect, useState, Component, ErrorInfo, ReactNode } from 'react';
import { HeroSection } from '@/components/sections/HeroSection';
import { FeaturesSection } from '@/components/sections/FeaturesSection';
import { GallerySection } from '@/components/sections/GallerySection';
import { GalleryMasonrySection } from '@/components/sections/GalleryMasonrySection';
import { BlogListSection } from '@/components/sections/BlogListSection';
import { StatsSection } from '@/components/sections/StatsSection';
import { TeamSection } from '@/components/sections/TeamSection';
import { LogoCloudSection } from '@/components/sections/LogoCloudSection';
import { ContentSection } from '@/components/sections/ContentSection';
import { CaseStudiesSection } from '@/components/sections/CaseStudiesSection';

// ── Error boundary so a crashing section never brings down the dashboard ──
class PreviewErrorBoundary extends Component<{ children: ReactNode }, { crashed: boolean }> {
    state = { crashed: false };
    static getDerivedStateFromError() { return { crashed: true }; }
    componentDidCatch() {
        // Silently catch section render errors — no console output in dev
    }
    render() {
        if (this.state.crashed) return null;
        return this.props.children;
    }
}

interface SiteThumbnailProps {
    site: any;
    className?: string;
}

const RENDER_W = 1440;

/**
 * Only renders section types that are safe outside BuilderContext.
 * Types using useBuilder() (Services, CTA, About, FAQ, Layout, Pricing,
 * Testimonials, Contact) are intentionally skipped — they'd crash without
 * a BuilderProvider wrapper.
 */
function PreviewSection({ section, isAlternate }: { section: any; isAlternate: boolean }) {
    const base = {
        section,
        isSelected: false,
        isEditing: false,
        onContentChange: () => {},
        isAlternate,
    };
    switch (section.type) {
        case 'hero':            return <HeroSection {...base} />;
        case 'features':        return <FeaturesSection {...base} />;
        case 'gallery':         return <GallerySection {...base} />;
        case 'gallery-masonry': return <GalleryMasonrySection {...base} />;
        case 'blog':            return <BlogListSection {...base} />;
        case 'stats':           return <StatsSection {...base} />;
        case 'team':            return <TeamSection {...base} />;
        case 'logocloud':       return <LogoCloudSection {...base} />;
        case 'content':         return <ContentSection {...base} />;
        case 'casestudies':     return <CaseStudiesSection {...base} />;
        // Skip types that require BuilderContext (services, cta, about, faq, layout, pricing, testimonials, contact)
        default:                return null;
    }
}

/** Lightweight navbar strip — pure inline styles, no BuilderContext needed */
function MiniNavbar({ navbar, globalStyles }: { navbar: any; globalStyles: any }) {
    if (!navbar) return null;
    const bg = navbar.styles?.backgroundColor || globalStyles?.primaryColor || '#0f172a';
    const color = navbar.styles?.textColor || '#ffffff';
    const brand = navbar.brand || '';
    const links: string[] = (navbar.links || []).map((l: any) => l.label || l.text || String(l));

    return (
        <div style={{
            backgroundColor: bg,
            color,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '0 48px',
            height: '64px',
            flexShrink: 0,
            fontFamily: "'Inter', 'DM Sans', sans-serif",
        }}>
            <span style={{ fontWeight: 800, fontSize: '22px', letterSpacing: '-0.5px' }}>{brand}</span>
            <div style={{ display: 'flex', gap: '36px' }}>
                {links.slice(0, 5).map((link, i) => (
                    <span key={i} style={{ fontSize: '15px', fontWeight: 500, opacity: 0.85 }}>{link}</span>
                ))}
            </div>
        </div>
    );
}

/**
 * Renders the full website (all safe sections) at 1440px width, then scales down
 * to fill the card thumbnail. Whatever fits in the container is visible —
 * exactly like a browser screenshot crop from the top.
 */
export function SiteThumbnail({ site, className = '' }: SiteThumbnailProps) {
    const outerRef = useRef<HTMLDivElement>(null);
    const [scale, setScale] = useState(0.22);
    const [crashed, setCrashed] = useState(false);

    const firstPage = site?.pages?.[0];
    const sections: any[] = (firstPage?.sections || []).filter((s: any) => s.visible !== false);
    const navbar = firstPage?.navbar;
    const globalStyles = firstPage?.globalStyles || {};
    const bgColor = globalStyles.backgroundColor || '#ffffff';

    useEffect(() => {
        const el = outerRef.current;
        if (!el) return;
        const calc = () => {
            const w = el.offsetWidth;
            if (w) setScale(w / RENDER_W);
        };
        calc();
        const ro = new ResizeObserver(calc);
        ro.observe(el);
        return () => ro.disconnect();
    }, []);

    const themeVars = {
        '--theme-primary':   globalStyles.primaryColor        || '#0f172a',
        '--theme-secondary': globalStyles.secondaryColor      || '#334155',
        '--theme-accent':    globalStyles.accentColor         || '#3b82f6',
        '--theme-bg':        bgColor,
        '--theme-bg-alt':    globalStyles.alternateBackground || '#f8fafc',
        '--theme-text':      globalStyles.textColor           || '#0f172a',
        '--theme-text-alt':  globalStyles.alternateTextColor  || '#475569',
    } as React.CSSProperties;

    if (sections.length === 0 && !navbar) {
        return (
            <div
                className={`w-full h-full flex flex-col items-center justify-center gap-3 ${className}`}
                style={{ background: 'linear-gradient(135deg, #f1f5f9 0%, #e2e8f0 100%)' }}
            >
                <div className="w-14 h-14 rounded-2xl bg-white shadow-lg flex items-center justify-center border border-slate-100">
                    <svg className="w-7 h-7 text-slate-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                            d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                </div>
                <p className="text-xs font-semibold text-slate-400 tracking-wide">No preview</p>
            </div>
        );
    }

    return (
        <PreviewErrorBoundary>
        <div
            ref={outerRef}
            className={`w-full h-full overflow-hidden relative select-none ${className}`}
            style={{ backgroundColor: bgColor }}
        >
            <div
                style={{
                    ...themeVars,
                    width: `${RENDER_W}px`,
                    transformOrigin: 'top left',
                    transform: `scale(${scale})`,
                    pointerEvents: 'none',
                    userSelect: 'none',
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    backgroundColor: bgColor,
                }}
            >
                <MiniNavbar navbar={navbar} globalStyles={globalStyles} />
                {sections.map((section, idx) => (
                    <PreviewSection
                        key={section.id || idx}
                        section={section}
                        isAlternate={idx % 2 === 1}
                    />
                ))}
            </div>
        </div>
        </PreviewErrorBoundary>
    );
}
