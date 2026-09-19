import React, { useRef, useEffect, useState, Component, type CSSProperties, type ReactNode } from 'react';
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
import { CanvasElementView } from '@/builder/components/CanvasPrimitives';
import { isCanvasSection, unpackNodeStyles } from '@/builder/adapter';
import { resolveStyles, stylesToCss } from '@/builder/styles';
import { sortByOrder } from '@/builder/tree';
import type { CanvasContainer, CanvasElement, CanvasSection } from '@/builder/types';

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

export function unpackPageTheme(globalStyles: unknown): Record<string, string | number | undefined> {
    const unpacked = unpackNodeStyles(globalStyles, {});
    return (unpacked.styles || {}) as Record<string, string | number | undefined>;
}

export function navbarBrand(navbar: unknown): string {
    if (!navbar || typeof navbar !== 'object') return '';
    const record = navbar as { brand?: unknown; logo?: unknown };
    if (typeof record.logo === 'object' && record.logo && 'text' in record.logo) {
        const text = (record.logo as { text?: unknown }).text;
        if (typeof text === 'string' && text.trim()) return text;
    }
    if (typeof record.brand === 'string' && record.brand.trim()) return record.brand;
    if (typeof record.logo === 'string' && record.logo.trim()) return record.logo;
    return '';
}

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
        default:                return null;
    }
}

function MiniNavbar({ navbar, globalStyles }: { navbar: any; globalStyles: Record<string, string | number | undefined> }) {
    if (!navbar) return null;
    const navStyles = unpackNodeStyles(navbar.styles, {}).styles as Record<string, string | undefined>;
    const bg = navStyles.backgroundColor || String(globalStyles.primaryColor || '#0f172a');
    const color = navStyles.textColor || '#ffffff';
    const brand = navbarBrand(navbar);
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

function ThumbnailCanvasElement({ element }: { element: CanvasElement }) {
    if (element.visibility?.desktop === false) return null;
    const css = stylesToCss(resolveStyles(element.styles, element.responsiveStyles, 'desktop'));
    const free = element.properties?.placement === 'absolute' || element.styles?.position === 'absolute';
    const wrapperStyle: CSSProperties = free ? { ...css, position: 'absolute' } : css;
    const innerCss: CSSProperties = {
        ...css,
        position: 'relative',
        left: undefined,
        top: undefined,
        ...(free
            ? {
                width: '100%',
                height: element.type === 'image' ? 'auto' : '100%',
                maxWidth: '100%',
                maxHeight: element.type === 'image' ? undefined : '100%',
                boxSizing: 'border-box',
            }
            : {}),
    };

    if (element.type === 'video') {
        return (
            <div style={wrapperStyle} className="overflow-hidden bg-slate-800">
                <div className="flex h-full min-h-[120px] w-full items-center justify-center text-sm text-white/80">
                    Video
                </div>
            </div>
        );
    }

    return (
        <div style={wrapperStyle}>
            <CanvasElementView element={element} css={innerCss} />
        </div>
    );
}

function ThumbnailCanvasContainer({ container }: { container: CanvasContainer }) {
    if (container.visibility?.desktop === false) return null;
    const css = stylesToCss(resolveStyles(container.styles, container.responsiveStyles, 'desktop'));
    const free = container.properties?.placement === 'absolute' || container.styles?.position === 'absolute';
    return (
        <div
            style={{
                ...css,
                position: free ? 'absolute' : (css.position as CSSProperties['position']) || 'relative',
                width: css.width || '100%',
            }}
        >
            {sortByOrder(container.children || []).map((element) => (
                <ThumbnailCanvasElement key={element.id} element={element} />
            ))}
        </div>
    );
}

function ThumbnailCanvasSection({ section }: { section: CanvasSection }) {
    const css = stylesToCss(resolveStyles(section.styles, section.responsiveStyles, 'desktop'));
    return (
        <div
            style={{
                ...css,
                position: 'relative',
                width: '100%',
                minHeight: css.minHeight || 400,
            }}
        >
            {sortByOrder(section.children || []).map((container) => (
                <ThumbnailCanvasContainer key={container.id} container={container} />
            ))}
        </div>
    );
}

function ThumbnailSection({ section, isAlternate }: { section: CanvasSection; isAlternate: boolean }) {
    if (isCanvasSection(section)) {
        return <ThumbnailCanvasSection section={section} />;
    }
    return <PreviewSection section={section} isAlternate={isAlternate} />;
}

/**
 * Renders the full website (canvas elements + safe prebuilt sections) at 1440px
 * width, then scales down to fill the card thumbnail.
 */
export function SiteThumbnail({ site, className = '' }: SiteThumbnailProps) {
    const outerRef = useRef<HTMLDivElement>(null);
    const [scale, setScale] = useState(0.22);

    const firstPage = site?.pages?.[0];
    const sections: CanvasSection[] = (firstPage?.sections || []).filter((s: CanvasSection) => s.visible !== false);
    const navbar = firstPage?.navbar;
    const globalStyles = unpackPageTheme(firstPage?.globalStyles);
    const bgColor = String(globalStyles.backgroundColor || '#ffffff');

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
                    <ThumbnailSection
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
