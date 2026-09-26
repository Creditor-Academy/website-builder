import type { CSSProperties, MouseEvent } from 'react';
import { FooterLinkHit, MovablePiece, useFooterLinkOpen } from './footerChrome';
import {
  Facebook, Twitter, Instagram, Linkedin, Youtube,
  Github, Mail, Phone, MapPin, Globe, MessageCircle,
} from 'lucide-react';

const socialIcons: Record<string, typeof Globe> = {
  facebook: Facebook, twitter: Twitter, instagram: Instagram,
  linkedin: Linkedin, youtube: Youtube, github: Github,
  email: Mail, phone: Phone, location: MapPin,
  website: Globe, discord: MessageCircle,
};

const contactNames: Record<string, string> = {
  email: 'Email',
  phone: 'Phone',
  location: 'Address',
  website: 'Website',
};

type FooterLink = { id: string; label: string; href: string };
type FooterColumn = { id: string; title: string; links: FooterLink[] };
type SocialLink = { id: string; platform: string; href: string };

export function FooterVariant({
  variant,
  config,
  isEditing,
  onUpdate,
  textColor,
  backgroundColor,
  onLinkClick,
}: {
  variant: string;
  config: any;
  isEditing: boolean;
  onUpdate: (updates: any) => void;
  textColor: string;
  backgroundColor: string;
  onLinkClick: (event: MouseEvent, link: FooterLink, column?: FooterColumn) => void;
}) {
  const openLinkTarget = useFooterLinkOpen();
  const columns: FooterColumn[] = config.columns || [];
  const socialLinks: SocialLink[] = config.socialLinks || [];
  const light = isLightColor(backgroundColor);

  const commitLogo = (text: string) => onUpdate({ logo: { ...config.logo, text } });
  const commitDescription = (description: string) => onUpdate({ description });
  const commitCopyright = (copyright: string) => onUpdate({ copyright });
  const commitTitle = (columnId: string, title: string) => {
    onUpdate({
      columns: columns.map((column) => (column.id === columnId ? { ...column, title } : column)),
    });
  };
  const commitLink = (columnId: string, linkId: string, label: string) => {
    onUpdate({
      columns: columns.map((column) =>
        column.id === columnId
          ? { ...column, links: column.links.map((link) => (link.id === linkId ? { ...link, label } : link)) }
          : column
      ),
    });
  };
  const commitSocial = (id: string, href: string) => {
    onUpdate({
      socialLinks: socialLinks.map((link) => (link.id === id ? { ...link, href } : link)),
    });
  };
  const commitCta = (label: string) => onUpdate({ cta: { ...(config.cta || { href: '/contact' }), label } });

  const logo = (
    <MovablePiece id="logo">
      <Editable
        value={config.logo?.text || 'Logo'}
        editing={isEditing}
        onCommit={commitLogo}
        style={{ fontFamily: "'Instrument Serif', serif", fontSize: variant === 'minimal' ? 22 : 28, fontStyle: 'italic', color: textColor }}
      />
    </MovablePiece>
  );
  const description = config.description || isEditing ? (
    <MovablePiece id="description" block>
      <Editable
        tag="p"
        value={config.description || 'Add a description'}
        editing={isEditing}
        onCommit={(text) => commitDescription(text === 'Add a description' ? '' : text)}
        style={{ margin: 0, maxWidth: 360, fontSize: 14, lineHeight: 1.7, opacity: 0.72, fontFamily: "'Geist', sans-serif" }}
      />
    </MovablePiece>
  ) : null;
  const copyright = (
    <MovablePiece id="copyright">
      <Editable
        tag="p"
        value={config.copyright || ''}
        editing={isEditing}
        onCommit={commitCopyright}
        style={{ margin: 0, fontSize: 12, opacity: 0.55, fontFamily: "'Geist', sans-serif" }}
      />
    </MovablePiece>
  );

  const shell: CSSProperties = { maxWidth: 1120, margin: '0 auto', padding: variant === 'minimal' ? '22px 24px' : '56px 24px 28px' };

  if (variant === 'minimal') {
    const links = columns.flatMap((column) => (column.links || []).map((link) => ({ link, column })));
    return (
      <div style={shell} className="ft-minimal">
        {logo}
        <ul className="ft-inline-links">
          {links.map(({ link, column }) => (
            <li key={link.id}>
              <LinkText link={link} column={column} editing={isEditing} onCommit={(label) => commitLink(column.id, link.id, label)} onLinkClick={onLinkClick} />
            </li>
          ))}
        </ul>
        {copyright}
      </div>
    );
  }

  if (variant === 'centered') {
    const links = columns.flatMap((column) => (column.links || []).map((link) => ({ link, column })));
    return (
      <div style={{ ...shell, paddingTop: 64, paddingBottom: 36 }} className="ft-stack">
        {logo}
        {description}
        <ul className="ft-inline-links" style={{ justifyContent: 'center' }}>
          {links.map(({ link, column }) => (
            <li key={link.id}>
              <LinkText link={link} column={column} editing={isEditing} onCommit={(label) => commitLink(column.id, link.id, label)} onLinkClick={onLinkClick} />
            </li>
          ))}
        </ul>
        <SocialIcons links={socialLinks} color={textColor} light={light} />
        {copyright}
      </div>
    );
  }

  if (variant === 'newsletter') {
    return (
      <div style={shell}>
        <div className="ft-news">
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16, alignItems: 'flex-start' }}>
            {logo}
            {description}
            <MovablePiece id="cta">
            <FooterLinkHit link={{ id: 'cta', label: config.cta?.label || 'Subscribe', href: config.cta?.href || '/contact' }}>
            <button
              type="button"
              onClick={(event) => {
                event.preventDefault();
                event.stopPropagation();
                if (isEditing) return;
                openLinkTarget({ id: 'cta', label: config.cta?.label || 'Subscribe', href: config.cta?.href || '/contact' });
              }}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                height: 44,
                padding: '0 18px',
                borderRadius: 999,
                border: 'none',
                background: '#ffffff',
                color: '#111827',
                fontWeight: 600,
                fontSize: 14,
                cursor: 'pointer',
              }}
            >
              <Editable
                value={config.cta?.label || 'Subscribe'}
                editing={isEditing}
                onCommit={commitCta}
                onClick={(event) => event.stopPropagation()}
              />
            </button>
            </FooterLinkHit>
            </MovablePiece>
            <SocialIcons links={socialLinks} color={textColor} light={false} />
          </div>
          <div className="ft-split-cols">
            {columns.map((column) => (
              <Column key={column.id} column={column} editing={isEditing} onTitle={commitTitle} onLink={commitLink} onLinkClick={onLinkClick} />
            ))}
          </div>
        </div>
        <div style={{ marginTop: 36, paddingTop: 18, borderTop: '1px solid rgba(255,255,255,0.08)' }}>{copyright}</div>
      </div>
    );
  }

  if (variant === 'contact') {
    return (
      <div style={{ ...shell, borderTop: '3px solid #0f172a' }}>
        <div className="ft-contact">
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14, alignItems: 'flex-start' }}>
            {logo}
            {description}
            <ul className="ft-inline-links" style={{ marginTop: 8 }}>
              {(columns[0]?.links || []).map((link) => (
                <li key={link.id}>
                  <LinkText link={link} column={columns[0]} editing={isEditing} onCommit={(label) => commitLink(columns[0].id, link.id, label)} onLinkClick={onLinkClick} />
                </li>
              ))}
            </ul>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            {socialLinks.map((social) => {
              const Icon = socialIcons[social.platform] || Globe;
              return (
                <MovablePiece key={social.id} id={`contact-${social.id}`} block>
                <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
                  <Icon size={16} style={{ marginTop: 3, flexShrink: 0 }} />
                  <div>
                    <div style={{ fontSize: 11, letterSpacing: '0.14em', textTransform: 'uppercase', opacity: 0.45, fontFamily: "'Geist', sans-serif" }}>
                      {contactNames[social.platform] || social.platform}
                    </div>
                    <Editable
                      value={social.href}
                      editing={isEditing}
                      onCommit={(href) => commitSocial(social.id, href)}
                      style={{ fontSize: 15, fontFamily: "'Geist', sans-serif" }}
                    />
                  </div>
                </div>
                </MovablePiece>
              );
            })}
          </div>
        </div>
        <div style={{ marginTop: 36 }}>{copyright}</div>
      </div>
    );
  }

  if (variant === 'mega') {
    return (
      <div style={shell}>
        <div className="ft-mega-top">
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12, alignItems: 'flex-start' }}>
            {logo}
            {description}
          </div>
          <SocialIcons links={socialLinks} color={textColor} light={false} />
        </div>
        <div className="ft-mega-cols">
          {columns.map((column) => (
            <Column key={column.id} column={column} editing={isEditing} onTitle={commitTitle} onLink={commitLink} onLinkClick={onLinkClick} muted />
          ))}
        </div>
        <div style={{ marginTop: 40, paddingTop: 18, borderTop: '1px solid rgba(255,255,255,0.08)' }}>{copyright}</div>
      </div>
    );
  }

  return (
    <div style={{ background: '#e8edf5', padding: '32px 24px 18px' }}>
      <div
        style={{
          maxWidth: 1120,
          margin: '0 auto',
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'stretch',
          overflow: 'hidden',
          borderRadius: 24,
          background: backgroundColor,
          color: textColor,
        }}
      >
        <div
          style={{
            flex: '1 1 280px',
            maxWidth: 420,
            padding: '36px 32px',
            display: 'flex',
            flexDirection: 'column',
            gap: 16,
            alignItems: 'flex-start',
            background: 'rgba(255,255,255,0.04)',
          }}
        >
          {logo}
          {description}
          <SocialIcons links={socialLinks} color={textColor} light={false} />
        </div>
        <div
          style={{
            flex: '2 1 360px',
            display: 'flex',
            flexWrap: 'wrap',
            gap: 28,
            padding: '36px 40px',
          }}
        >
          {columns.map((column) => (
            <div key={column.id} style={{ flex: '1 1 160px' }}>
              <Column column={column} editing={isEditing} onTitle={commitTitle} onLink={commitLink} onLinkClick={onLinkClick} muted />
            </div>
          ))}
        </div>
      </div>
      <div style={{ maxWidth: 1120, margin: '0 auto', textAlign: 'center', padding: '16px 0 6px', color: '#64748b' }}>
        {copyright}
      </div>
    </div>
  );
}

function Editable({
  tag: Tag = 'span',
  value,
  editing,
  onCommit,
  className,
  style,
  onClick,
}: {
  tag?: 'span' | 'p' | 'h3';
  value: string;
  editing: boolean;
  onCommit: (value: string) => void;
  className?: string;
  style?: CSSProperties;
  onClick?: (event: MouseEvent) => void;
}) {
  return (
    <Tag
      className={`ft-ce ${className || ''}`}
      style={style}
      contentEditable={editing}
      suppressContentEditableWarning
      onClick={onClick}
      onBlur={(event) => onCommit(event.currentTarget.innerText)}
    >
      {value}
    </Tag>
  );
}

function LinkText({
  link,
  column,
  editing,
  onCommit,
  onLinkClick,
}: {
  link: FooterLink;
  column?: FooterColumn;
  editing: boolean;
  onCommit: (label: string) => void;
  onLinkClick: (event: MouseEvent, link: FooterLink, column?: FooterColumn) => void;
}) {
  const openLinkTarget = useFooterLinkOpen();
  return (
    <MovablePiece id={`link-${link.id}`}>
      <FooterLinkHit link={link}>
        <a
          href={link.href}
          className="ft-ink ft-ce"
          style={{ fontFamily: "'Geist', sans-serif", fontSize: 14 }}
          onClick={(event) => {
            event.preventDefault();
            event.stopPropagation();
            if (editing) return;
            openLinkTarget(link);
          }}
          contentEditable={editing}
          suppressContentEditableWarning
          onBlur={(event) => onCommit(event.currentTarget.innerText)}
        >
          {link.label}
        </a>
      </FooterLinkHit>
    </MovablePiece>
  );
}

function Column({
  column,
  editing,
  onTitle,
  onLink,
  onLinkClick,
  muted,
}: {
  column: FooterColumn;
  editing: boolean;
  onTitle: (columnId: string, title: string) => void;
  onLink: (columnId: string, linkId: string, label: string) => void;
  onLinkClick: (event: MouseEvent, link: FooterLink, column?: FooterColumn) => void;
  muted?: boolean;
}) {
  return (
    <div>
      <MovablePiece id={`column-${column.id}`} block>
      <Editable
        tag="h3"
        value={column.title}
        editing={editing}
        onCommit={(title) => onTitle(column.id, title)}
        style={{
          margin: '0 0 14px',
          fontSize: 11,
          letterSpacing: '0.16em',
          textTransform: 'uppercase',
          fontWeight: 600,
          opacity: muted ? 0.45 : 0.55,
          fontFamily: "'Geist', sans-serif",
        }}
      />
      </MovablePiece>
      <ul className="ft-link-list">
        {(column.links || []).map((link) => (
          <li key={link.id}>
            <LinkText link={link} column={column} editing={editing} onCommit={(label) => onLink(column.id, link.id, label)} onLinkClick={onLinkClick} />
          </li>
        ))}
      </ul>
    </div>
  );
}

function SocialIcons({ links, color, light }: { links: SocialLink[]; color: string; light: boolean }) {
  if (!links.length) return null;
  return (
    <MovablePiece id="social">
    <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
      {links.map((social) => {
        const Icon = socialIcons[social.platform] || Globe;
        return (
          <a
            key={social.id}
            href={social.href}
            className="ft-social-btn"
            aria-label={social.platform}
            style={{
              width: 36,
              height: 36,
              borderRadius: 8,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              background: light ? 'rgba(15,23,42,0.06)' : 'rgba(255,255,255,0.08)',
              color,
              textDecoration: 'none',
            }}
            onClick={(event) => openSocial(event, social)}
          >
            <Icon size={15} />
          </a>
        );
      })}
    </div>
    </MovablePiece>
  );
}

function openSocial(event: MouseEvent, social: SocialLink) {
  if (social.platform === 'email') {
    event.preventDefault();
    window.location.href = `mailto:${social.href.replace('mailto:', '')}`;
  } else if (social.platform === 'phone') {
    event.preventDefault();
    window.location.href = `tel:${social.href.replace('tel:', '')}`;
  } else if (social.platform === 'location') {
    event.preventDefault();
    window.open(`https://maps.google.com/?q=${encodeURIComponent(social.href)}`, '_blank');
  }
}

function isLightColor(color: string) {
  const hex = color.trim().replace('#', '');
  if (!/^[0-9a-fA-F]{6}$/.test(hex)) return false;
  const red = parseInt(hex.slice(0, 2), 16);
  const green = parseInt(hex.slice(2, 4), 16);
  const blue = parseInt(hex.slice(4, 6), 16);
  return (red * 299 + green * 587 + blue * 114) / 1000 > 160;
}
