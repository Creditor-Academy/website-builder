import React, { useState } from 'react';
import { ArrowRight, Play, ChevronRight } from 'lucide-react';

export function HeroSection({ section, isSelected, isEditing, onContentChange }) {
  const { content, styles, variant = 'split' } = section;
  const [showBgPicker, setShowBgPicker] = useState(false);

  const handleButtonClick = (routeType, routeUrl) => {
    if (!routeType || routeType === 'none' || !routeUrl) return;
    switch (routeType) {
      case 'external':
        window.open(routeUrl, '_blank', 'noopener,noreferrer');
        break;
      case 'internal':
        window.location.href = routeUrl;
        break;
      case 'email':
        window.location.href = routeUrl.startsWith('mailto:') ? routeUrl : `mailto:${routeUrl}`;
        break;
      case 'phone':
        window.location.href = routeUrl.startsWith('tel:') ? routeUrl : `tel:${routeUrl}`;
        break;
      case 'anchor': {
        const element = document.querySelector(routeUrl);
        if (element) element.scrollIntoView({ behavior: 'smooth' });
        break;
      }
      default:
        if (routeUrl) window.open(routeUrl, '_blank', 'noopener,noreferrer');
    }
  };

  const handleTextEdit = (field, e) => {
    if (onContentChange && isEditing) {
      onContentChange(field, e.currentTarget.textContent || '');
    }
  };

  // White by default — always respect styles if set
  const background = (styles.backgroundColor && styles.backgroundColor !== 'transparent')
    ? styles.backgroundColor
    : '#ffffff';

  const headingColor = styles.headingColor || '#0f172a';
  const paragraphColor = styles.paragraphColor || '#475569';
  const buttonPrimaryBg = styles.buttonPrimaryBg || '#0f172a';
  const buttonPrimaryText = styles.buttonPrimaryText || '#ffffff';
  const buttonSecondaryBg = styles.buttonSecondaryBg || 'transparent';
  const buttonSecondaryText = styles.buttonSecondaryText || '#0f172a';

  const sectionStyle = {
    background,
    padding: styles.padding,
    minHeight: styles.minHeight,
    fontFamily: "'DM Sans', 'Helvetica Neue', sans-serif",
  };

  const selectionRing = isSelected ? 'ring-2 ring-slate-900 ring-offset-2 ring-offset-white' : '';

  /* ─────────────────────────────────────────────
     CENTERED VARIANT
  ───────────────────────────────────────────── */
  if (variant === 'centered') {
    return (
      <section
        className={`relative overflow-hidden transition-all duration-300 ${selectionRing}`}
        style={sectionStyle}
      >
        {/* Subtle grid texture */}
        <div className="absolute inset-0 pointer-events-none" style={{
          backgroundImage: 'linear-gradient(#e2e8f0 1px, transparent 1px), linear-gradient(90deg, #e2e8f0 1px, transparent 1px)',
          backgroundSize: '48px 48px',
          opacity: 0.4,
        }} />
        {/* Soft radial glow at center */}
        <div className="absolute inset-0 pointer-events-none" style={{
          background: 'radial-gradient(ellipse 70% 50% at 50% 0%, #f1f5f9 0%, transparent 80%)',
        }} />

        <div className="container mx-auto px-6 relative z-10 flex flex-col items-center justify-center min-h-[75vh] text-center">
          {/* Eyebrow tag */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-slate-200 bg-slate-50 mb-8 shadow-sm">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 flex-shrink-0" />
            <span
              className="text-xs font-semibold tracking-widest uppercase"
              style={{ color: '#475569' }}
              contentEditable={isEditing}
              suppressContentEditableWarning
              onBlur={(e) => handleTextEdit('eyebrowText', e)}
            >
              {content.eyebrowText || 'New Release'}
            </span>
          </div>

          <div className="max-w-4xl space-y-6">
            <h1
              className="text-5xl md:text-6xl lg:text-7xl font-black leading-[1.05] tracking-tight"
              style={{ color: headingColor, letterSpacing: '-0.03em' }}
              contentEditable={isEditing}
              suppressContentEditableWarning
              onBlur={(e) => handleTextEdit('headline', e)}
            >
              {content.headline}
            </h1>

            <p
              className="text-lg md:text-xl max-w-2xl mx-auto leading-relaxed"
              style={{ color: paragraphColor }}
              contentEditable={isEditing}
              suppressContentEditableWarning
              onBlur={(e) => handleTextEdit('subheadline', e)}
            >
              {content.subheadline}
            </p>

            <div className="flex flex-wrap justify-center gap-3 pt-4">
              <button
                className="group inline-flex items-center gap-2 px-7 py-3.5 rounded-xl font-semibold text-base transition-all duration-200 hover:opacity-90 hover:shadow-lg hover:shadow-slate-900/20 hover:-translate-y-0.5 active:translate-y-0"
                style={{ background: buttonPrimaryBg, color: buttonPrimaryText }}
                onClick={() => handleButtonClick(content.primaryRouteType, content.primaryRouteUrl)}
              >
                <span contentEditable={isEditing} suppressContentEditableWarning onBlur={(e) => handleTextEdit('ctaText', e)}>
                  {content.ctaText}
                </span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
              </button>

              <button
                className="group inline-flex items-center gap-2 px-7 py-3.5 rounded-xl font-semibold text-base border border-slate-200 bg-white transition-all duration-200 hover:border-slate-300 hover:shadow-md hover:-translate-y-0.5 active:translate-y-0"
                style={{ color: buttonSecondaryText }}
                onClick={() => handleButtonClick(content.secondaryRouteType, content.secondaryRouteUrl)}
              >
                <Play className="w-4 h-4 fill-current opacity-70" />
                <span contentEditable={isEditing} suppressContentEditableWarning onBlur={(e) => handleTextEdit('ctaSecondaryText', e)}>
                  {content.ctaSecondaryText}
                </span>
              </button>
            </div>
          </div>

          {/* Hero image with elegant frame */}
          <div className="pt-16 w-full max-w-4xl mx-auto">
            <div className="relative group">
              <div className="absolute -inset-1 rounded-2xl bg-gradient-to-b from-slate-200 to-slate-100 blur-sm" />
              <div className="relative rounded-2xl overflow-hidden border border-slate-200 shadow-2xl shadow-slate-200/80">
                {/* Browser chrome bar */}
                <div className="flex items-center gap-1.5 px-4 py-3 bg-slate-50 border-b border-slate-200">
                  <div className="w-2.5 h-2.5 rounded-full bg-red-400" />
                  <div className="w-2.5 h-2.5 rounded-full bg-amber-400" />
                  <div className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
                  <div className="flex-1 mx-4 h-5 rounded bg-slate-200/80 max-w-xs mx-auto" />
                </div>
                <img src={content.imageUrl} alt="Hero" className="w-full h-auto object-cover" />
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  /* ─────────────────────────────────────────────
     VIDEO VARIANT
  ───────────────────────────────────────────── */
  if (variant === 'video') {
    return (
      <section
        className={`relative overflow-hidden transition-all duration-300 ${selectionRing}`}
        style={{ ...sectionStyle, background }}
      >
        <div className="absolute inset-0 pointer-events-none" style={{
          backgroundImage: 'linear-gradient(#e2e8f0 1px, transparent 1px), linear-gradient(90deg, #e2e8f0 1px, transparent 1px)',
          backgroundSize: '48px 48px',
          opacity: 0.35,
        }} />

        <div className="container mx-auto px-6 relative z-10 flex flex-col lg:flex-row items-center justify-between gap-12 min-h-[70vh] py-20">
          {/* Left: Text */}
          <div className="max-w-xl space-y-6 flex-1">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-md bg-slate-100 border border-slate-200">
              <span
                className="text-xs font-bold tracking-widest uppercase"
                style={{ color: '#475569' }}
                contentEditable={isEditing}
                suppressContentEditableWarning
                onBlur={(e) => handleTextEdit('eyebrowText', e)}
              >
                {content.eyebrowText || 'Video Story'}
              </span>
            </div>
            <h1
              className="text-4xl md:text-5xl lg:text-6xl font-black leading-tight"
              style={{ color: headingColor, letterSpacing: '-0.03em' }}
              contentEditable={isEditing}
              suppressContentEditableWarning
              onBlur={(e) => handleTextEdit('headline', e)}
            >
              {content.headline}
            </h1>
            <p
              className="text-lg leading-relaxed"
              style={{ color: paragraphColor }}
              contentEditable={isEditing}
              suppressContentEditableWarning
              onBlur={(e) => handleTextEdit('subheadline', e)}
            >
              {content.subheadline}
            </p>
            <div className="flex flex-wrap gap-3 pt-2">
              <button
                className="group inline-flex items-center gap-2 px-7 py-3.5 rounded-xl font-semibold text-base transition-all duration-200 hover:opacity-90 hover:shadow-lg hover:shadow-slate-900/20 hover:-translate-y-0.5"
                style={{ background: buttonPrimaryBg, color: buttonPrimaryText }}
                onClick={() => handleButtonClick(content.primaryRouteType, content.primaryRouteUrl)}
              >
                <span contentEditable={isEditing} suppressContentEditableWarning onBlur={(e) => handleTextEdit('ctaText', e)}>
                  {content.ctaText}
                </span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
              </button>
              <button
                className="group inline-flex items-center gap-2 px-7 py-3.5 rounded-xl font-semibold text-base border border-slate-200 bg-white transition-all duration-200 hover:border-slate-300 hover:shadow-md hover:-translate-y-0.5"
                style={{ color: buttonSecondaryText }}
                onClick={() => handleButtonClick(content.secondaryRouteType, content.secondaryRouteUrl)}
              >
                <Play className="w-4 h-4 fill-current opacity-70" />
                <span contentEditable={isEditing} suppressContentEditableWarning onBlur={(e) => handleTextEdit('ctaSecondaryText', e)}>
                  {content.ctaSecondaryText}
                </span>
              </button>
            </div>
          </div>

          {/* Right: Video embed */}
          <div className="flex-1 w-full max-w-xl">
            <div className="relative group rounded-2xl overflow-hidden border border-slate-200 shadow-2xl shadow-slate-200/70 bg-slate-900 aspect-video">
              <iframe
                src={`${content.videoUrl}?autoplay=1&mute=1&loop=1&controls=0&playlist=${content.videoUrl?.split('/').pop()}`}
                className="absolute inset-0 w-full h-full pointer-events-none"
                style={{ transform: 'scale(1.05)' }}
                allow="autoplay; encrypted-media"
                title="Hero video"
              />
              <div className="absolute inset-0 flex items-center justify-center bg-slate-900/20 group-hover:bg-slate-900/10 transition-colors duration-300">
                <div className="w-16 h-16 rounded-full bg-white/90 flex items-center justify-center shadow-xl group-hover:scale-110 transition-transform duration-300">
                  <Play className="w-6 h-6 fill-slate-900 text-slate-900 ml-1" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  /* ─────────────────────────────────────────────
     MINIMAL VARIANT
  ───────────────────────────────────────────── */
  if (variant === 'minimal') {
    return (
      <section
        className={`relative overflow-hidden transition-all duration-300 ${selectionRing}`}
        style={{ ...sectionStyle, background }}
      >
        {/* Left accent bar */}
        <div className="absolute left-0 top-0 bottom-0 w-1 bg-slate-900" />

        <div className="container mx-auto px-10 py-24">
          <div className="max-w-3xl space-y-7">
            <p
              className="text-xs font-bold tracking-[0.2em] uppercase"
              style={{ color: '#94a3b8' }}
              contentEditable={isEditing}
              suppressContentEditableWarning
              onBlur={(e) => handleTextEdit('eyebrowText', e)}
            >
              {content.eyebrowText || '— Professional · Minimal · Clean'}
            </p>

            <h1
              className="text-4xl md:text-5xl lg:text-6xl font-black leading-[1.08]"
              style={{ color: headingColor, letterSpacing: '-0.03em' }}
              contentEditable={isEditing}
              suppressContentEditableWarning
              onBlur={(e) => handleTextEdit('headline', e)}
            >
              {content.headline}
            </h1>

            <div className="w-12 h-0.5 bg-slate-900 rounded-full" />

            <p
              className="text-base md:text-lg leading-relaxed max-w-xl"
              style={{ color: paragraphColor }}
              contentEditable={isEditing}
              suppressContentEditableWarning
              onBlur={(e) => handleTextEdit('subheadline', e)}
            >
              {content.subheadline}
            </p>

            <div className="flex flex-wrap gap-3 pt-2">
              <button
                className="group inline-flex items-center gap-2.5 px-6 py-3 rounded-lg font-semibold text-sm transition-all duration-200 hover:opacity-90 hover:shadow-lg hover:shadow-slate-900/15 hover:-translate-y-0.5"
                style={{ background: buttonPrimaryBg, color: buttonPrimaryText }}
                onClick={() => handleButtonClick(content.primaryRouteType, content.primaryRouteUrl)}
              >
                <span contentEditable={isEditing} suppressContentEditableWarning onBlur={(e) => handleTextEdit('ctaText', e)}>
                  {content.ctaText}
                </span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
              </button>

              <button
                className="group inline-flex items-center gap-2.5 px-6 py-3 rounded-lg font-semibold text-sm border border-slate-200 transition-all duration-200 hover:bg-slate-50 hover:border-slate-300 hover:-translate-y-0.5"
                style={{ color: buttonSecondaryText, background: buttonSecondaryBg }}
                onClick={() => handleButtonClick(content.secondaryRouteType, content.secondaryRouteUrl)}
              >
                <span contentEditable={isEditing} suppressContentEditableWarning onBlur={(e) => handleTextEdit('ctaSecondaryText', e)}>
                  {content.ctaSecondaryText}
                </span>
                <ChevronRight className="w-4 h-4 opacity-50 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all" />
              </button>
            </div>
          </div>
        </div>
      </section>
    );
  }

  /* ─────────────────────────────────────────────
     GRADIENT VARIANT
  ───────────────────────────────────────────── */
  if (variant === 'gradient') {
    return (
      <section
        className={`relative overflow-hidden transition-all duration-300 ${selectionRing}`}
        style={{ ...sectionStyle, background }}
      >
        {/* Soft decorative blobs */}
        <div className="absolute -top-32 -right-32 w-[500px] h-[500px] rounded-full pointer-events-none"
          style={{ background: 'radial-gradient(circle, #dbeafe 0%, transparent 70%)', opacity: 0.7 }} />
        <div className="absolute -bottom-24 -left-24 w-[400px] h-[400px] rounded-full pointer-events-none"
          style={{ background: 'radial-gradient(circle, #ede9fe 0%, transparent 70%)', opacity: 0.6 }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] rounded-full pointer-events-none"
          style={{ background: 'radial-gradient(ellipse, #f0fdf4 0%, transparent 70%)', opacity: 0.5 }} />

        {/* Dot pattern */}
        <div className="absolute inset-0 pointer-events-none" style={{
          backgroundImage: 'radial-gradient(circle, #cbd5e1 1px, transparent 1px)',
          backgroundSize: '32px 32px',
          opacity: 0.4,
        }} />

        <div className="container mx-auto px-6 relative z-10 flex flex-col items-center justify-center min-h-[80vh] text-center py-24">
          <div className="max-w-5xl space-y-8">
            {/* Pill badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-slate-100 border border-slate-200 shadow-sm">
              <span className="flex gap-0.5 flex-shrink-0">
                <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                <span className="w-1.5 h-1.5 rounded-full bg-violet-500" />
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
              </span>
              <span
                className="text-xs font-bold tracking-widest uppercase"
                style={{ color: '#475569' }}
                contentEditable={isEditing}
                suppressContentEditableWarning
                onBlur={(e) => handleTextEdit('eyebrowText', e)}
              >
                {content.eyebrowText || 'Introducing v2.0'}
              </span>
            </div>

            <h1
              className="text-5xl md:text-6xl lg:text-8xl font-black leading-none"
              style={{ color: headingColor, letterSpacing: '-0.04em', lineHeight: 1.0 }}
              contentEditable={isEditing}
              suppressContentEditableWarning
              onBlur={(e) => handleTextEdit('headline', e)}
            >
              {content.headline}
            </h1>

            <p
              className="text-lg md:text-xl max-w-2xl mx-auto leading-relaxed"
              style={{ color: paragraphColor }}
              contentEditable={isEditing}
              suppressContentEditableWarning
              onBlur={(e) => handleTextEdit('subheadline', e)}
            >
              {content.subheadline}
            </p>

            <div className="flex flex-wrap justify-center gap-3 pt-4">
              <button
                className="group inline-flex items-center gap-2 px-8 py-4 rounded-2xl font-bold text-base transition-all duration-200 hover:opacity-90 hover:shadow-xl hover:shadow-slate-900/20 hover:-translate-y-1"
                style={{ background: buttonPrimaryBg, color: buttonPrimaryText }}
                onClick={() => handleButtonClick(content.primaryRouteType, content.primaryRouteUrl)}
              >
                <span contentEditable={isEditing} suppressContentEditableWarning onBlur={(e) => handleTextEdit('ctaText', e)}>
                  {content.ctaText}
                </span>
                <ArrowRight className="w-5 h-5 group-hover:translate-x-0.5 transition-transform" />
              </button>

              <button
                className="group inline-flex items-center gap-2 px-8 py-4 rounded-2xl font-bold text-base border border-slate-200 bg-white/70 backdrop-blur-sm transition-all duration-200 hover:border-slate-300 hover:shadow-lg hover:-translate-y-1"
                style={{ color: buttonSecondaryText }}
                onClick={() => handleButtonClick(content.secondaryRouteType, content.secondaryRouteUrl)}
              >
                <Play className="w-5 h-5 fill-current opacity-60" />
                <span contentEditable={isEditing} suppressContentEditableWarning onBlur={(e) => handleTextEdit('ctaSecondaryText', e)}>
                  {content.ctaSecondaryText}
                </span>
              </button>
            </div>

            {/* Social proof row */}
            <div className="flex items-center justify-center gap-6 pt-8 border-t border-slate-100">
              {(content.socialProof || ['Trusted by 10K+ teams', '4.9★ rating', 'SOC 2 certified']).map((item, i) => (
                <div key={i} className="flex items-center gap-2 text-sm" style={{ color: '#64748b' }}>
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 flex-shrink-0" />
                  <span
                    contentEditable={isEditing}
                    suppressContentEditableWarning
                    onBlur={(e) => {
                      if (!isEditing || !onContentChange) return;
                      const updated = [...(content.socialProof || ['Trusted by 10K+ teams', '4.9★ rating', 'SOC 2 certified'])];
                      updated[i] = e.currentTarget.textContent;
                      onContentChange('socialProof', updated);
                    }}
                  >
                    {item}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    );
  }

  /* ─────────────────────────────────────────────
     DEFAULT SPLIT VARIANT
  ───────────────────────────────────────────── */
  return (
    <section
      className={`relative overflow-hidden transition-all duration-300 ${selectionRing}`}
      style={{ ...sectionStyle, background }}
    >
      {/* Subtle dot grid */}
      <div className="absolute inset-0 pointer-events-none" style={{
        backgroundImage: 'radial-gradient(circle, #d1d5db 1px, transparent 1px)',
        backgroundSize: '28px 28px',
        opacity: 0.5,
      }} />
      {/* Right-side decorative blob */}
      <div className="absolute right-0 top-0 bottom-0 w-1/2 pointer-events-none overflow-hidden">
        <div className="absolute -right-20 top-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full"
          style={{ background: 'radial-gradient(circle, #f1f5f9 0%, transparent 65%)' }} />
      </div>

      <div className="container mx-auto px-6 relative z-10">
        <div className="grid lg:grid-cols-2 gap-16 items-center min-h-[75vh] py-16">
          {/* ── Left: Text content ── */}
          <div className="space-y-8">
            {/* Eyebrow */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-100 border border-slate-200">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse flex-shrink-0" />
              <span
                className="text-xs font-bold tracking-widest uppercase"
                style={{ color: '#475569' }}
                contentEditable={isEditing}
                suppressContentEditableWarning
                onBlur={(e) => handleTextEdit('eyebrowText', e)}
              >
                {content.eyebrowText || 'Now Available'}
              </span>
            </div>

            <h1
              className="text-4xl md:text-5xl lg:text-[3.5rem] font-black leading-tight"
              style={{ color: headingColor, letterSpacing: '-0.03em' }}
              contentEditable={isEditing}
              suppressContentEditableWarning
              onBlur={(e) => handleTextEdit('headline', e)}
            >
              {content.headline}
            </h1>

            <p
              className="text-base md:text-lg leading-relaxed max-w-md"
              style={{ color: paragraphColor }}
              contentEditable={isEditing}
              suppressContentEditableWarning
              onBlur={(e) => handleTextEdit('subheadline', e)}
            >
              {content.subheadline}
            </p>

            <div className="flex flex-wrap gap-3">
              <button
                className="group inline-flex items-center gap-2 px-7 py-3.5 rounded-xl font-semibold text-base transition-all duration-200 hover:opacity-90 hover:shadow-xl hover:shadow-slate-900/15 hover:-translate-y-0.5"
                style={{ background: buttonPrimaryBg, color: buttonPrimaryText }}
                onClick={() => handleButtonClick(content.primaryRouteType, content.primaryRouteUrl)}
              >
                <span contentEditable={isEditing} suppressContentEditableWarning onBlur={(e) => handleTextEdit('ctaText', e)}>
                  {content.ctaText}
                </span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
              </button>

              <button
                className="group inline-flex items-center gap-2 px-7 py-3.5 rounded-xl font-semibold text-base border border-slate-200 bg-white transition-all duration-200 hover:border-slate-300 hover:shadow-md hover:-translate-y-0.5"
                style={{ color: buttonSecondaryText }}
                onClick={() => handleButtonClick(content.secondaryRouteType, content.secondaryRouteUrl)}
              >
                <Play className="w-4 h-4 fill-current opacity-60" />
                <span contentEditable={isEditing} suppressContentEditableWarning onBlur={(e) => handleTextEdit('ctaSecondaryText', e)}>
                  {content.ctaSecondaryText}
                </span>
              </button>
            </div>

            {/* Stats row */}
            <div className="flex flex-wrap gap-8 pt-6 border-t border-slate-100">
              {(content.stats || [
                { value: '10K+', label: 'Users' },
                { value: '50K+', label: 'Websites' },
                { value: '99%', label: 'Uptime' },
              ]).map((stat, i) => (
                <div key={i}>
                  <div
                    className="text-2xl font-black"
                    style={{ color: headingColor }}
                    contentEditable={isEditing}
                    suppressContentEditableWarning
                    onBlur={(e) => {
                      if (!isEditing || !onContentChange) return;
                      const updated = [...(content.stats || [
                        { value: '10K+', label: 'Users' },
                        { value: '50K+', label: 'Websites' },
                        { value: '99%', label: 'Uptime' },
                      ])];
                      updated[i] = { ...updated[i], value: e.currentTarget.textContent };
                      handleTextEdit('stats', updated);
                    }}
                  >
                    {stat.value}
                  </div>
                  <div
                    className="text-xs font-semibold tracking-wide uppercase mt-0.5"
                    style={{ color: '#94a3b8' }}
                    contentEditable={isEditing}
                    suppressContentEditableWarning
                    onBlur={(e) => {
                      if (!isEditing || !onContentChange) return;
                      const updated = [...(content.stats || [
                        { value: '10K+', label: 'Users' },
                        { value: '50K+', label: 'Websites' },
                        { value: '99%', label: 'Uptime' },
                      ])];
                      updated[i] = { ...updated[i], label: e.currentTarget.textContent };
                      handleTextEdit('stats', updated);
                    }}
                  >
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* ── Right: Image ── */}
          <div className="relative">
            {/* Decorative corner accents */}
            <div className="absolute -top-3 -left-3 w-8 h-8 border-t-2 border-l-2 border-slate-900 rounded-tl-lg" />
            <div className="absolute -bottom-3 -right-3 w-8 h-8 border-b-2 border-r-2 border-slate-900 rounded-br-lg" />

            {/* Offset shadow card */}
            <div className="absolute inset-0 translate-x-3 translate-y-3 rounded-2xl bg-slate-100 border border-slate-200" />

            {/* Main image */}
            <div className="relative rounded-2xl overflow-hidden border border-slate-200 shadow-xl shadow-slate-200/80 bg-slate-50">
              <img
                src={content.imageUrl}
                alt="Hero"
                className="w-full h-auto object-cover"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}