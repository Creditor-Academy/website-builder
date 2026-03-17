import React from "react";
import { Plus, Trash, Image, ArrowUpRight, Calendar } from "lucide-react";

// ─── Styles ───────────────────────────────────────────────────────────────
const STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,700;0,900;1,400;1,700&family=Outfit:wght@300;400;500;600&display=swap');

  @keyframes bl-up { from { opacity:0; transform:translateY(18px); } to { opacity:1; transform:translateY(0); } }
  @keyframes bl-in { from { opacity:0; transform:scale(0.97);      } to { opacity:1; transform:scale(1);      } }
  @keyframes bl-bar{ from { transform:scaleX(0); }                  to { transform:scaleX(1); }                 }

  .bl-ce:focus { outline: none; }
  .bl-ce[data-editing="true"] {
    border-bottom: 1.5px dashed rgba(0,0,0,0.18);
    cursor: text; padding-bottom: 1px; min-width: 12px;
  }
  .bl-ce-inv[data-editing="true"] {
    border-bottom: 1.5px dashed rgba(255,255,255,0.28);
    cursor: text; padding-bottom: 1px;
  }

  .bl-card {
    transition: transform 0.35s cubic-bezier(0.34,1.2,0.64,1), box-shadow 0.35s ease;
  }
  .bl-card:hover {
    transform: translateY(-5px);
    box-shadow: 0 28px 56px -14px rgba(0,0,0,0.14);
  }
  .bl-card-img { transition: transform 0.6s ease; }
  .bl-card:hover .bl-card-img { transform: scale(1.06); }

  .bl-arrow {
    opacity: 0; transform: translateX(-4px) translateY(4px);
    transition: opacity 0.25s ease, transform 0.25s ease;
  }
  .bl-card:hover .bl-arrow { opacity: 1; transform: translateX(0) translateY(0); }

  .bl-edit-btn {
    font-family: 'Outfit', sans-serif;
    font-size: 10px; font-weight: 600;
    letter-spacing: 0.1em; text-transform: uppercase;
    border: none; border-radius: 3px;
    cursor: pointer; display: inline-flex; align-items: center; gap: 5px;
    padding: 5px 10px; transition: opacity 0.2s;
  }
  .bl-edit-btn:hover { opacity: 0.8; }

  .bl-add-btn {
    display: inline-flex; align-items: center; gap: 8px;
    font-family: 'Outfit', sans-serif;
    font-size: 12px; font-weight: 600;
    letter-spacing: 0.14em; text-transform: uppercase;
    background: #0f172a; color: #fff;
    border: none; border-radius: 3px;
    padding: 12px 24px; cursor: pointer;
    transition: background 0.2s ease, transform 0.2s ease;
  }
  .bl-add-btn:hover { background: #1e293b; transform: translateY(-1px); }
`;

function InjectStyles() {
  if (typeof document !== 'undefined' && !document.getElementById('blog-list-styles')) {
    const el = document.createElement('style');
    el.id = 'blog-list-styles';
    el.textContent = STYLES;
    document.head.appendChild(el);
  }
  return null;
}

// ─── CE helper ────────────────────────────────────────────────────────────
function CE({ as: Tag = 'span', value, onSave, isEditing, style, className = '', inv = false }) {
  return (
    <Tag
      className={`bl-ce ${inv ? 'bl-ce-inv' : ''} ${className}`}
      data-editing={isEditing ? 'true' : 'false'}
      contentEditable={isEditing ? 'true' : 'false'}
      suppressContentEditableWarning
      style={{ ...style, pointerEvents: isEditing ? 'auto' : 'inherit' }}
      onBlur={isEditing && onSave ? (e) => onSave(e.currentTarget.textContent || '') : undefined}
      onClick={isEditing ? (e) => e.stopPropagation() : undefined}
    >
      {value}
    </Tag>
  );
}

const ACCENTS = ['#E11D48', '#0891B2', '#059669', '#7C3AED', '#D97706', '#0F766E'];

export function BlogListSection({ section, isSelected, isEditing, onContentChange }) {
  const { content, styles, variant = 'grid' } = section;
  const posts = content.posts || [];
  const bg = styles.backgroundColor || '#fafaf8';
  const headingColor = styles.headingColor || '#0f172a';
  const paragraphColor = styles.paragraphColor || '#64748b';

  // ── Original logic, unchanged ──────────────────────────────────────────
  const updatePost = (id, field, value) => {
    const posts = content.posts.map((p) => p.id === id ? { ...p, [field]: value } : p);
    onContentChange("posts", posts);
  };

  const addPost = () => {
    const newPost = {
      id: Date.now().toString(),
      imageUrl: "",
      title: "New Post",
      excerpt: "Summary here",
      author: "Author",
      date: "Today",
    };
    onContentChange("posts", [...content.posts, newPost]);
  };

  const removePost = (id) => {
    onContentChange("posts", content.posts.filter((p) => p.id !== id));
  };

  const editImage = (id) => {
    const url = window.prompt("Enter image URL", content.posts.find((p) => p.id === id).imageUrl || "");
    if (url !== null) updatePost(id, "imageUrl", url);
  };
  // ─────────────────────────────────────────────────────────────────────────

  return (
    <section
      style={{
        background: bg,
        padding: styles.padding || '100px 0',
        fontFamily: "'Outfit', sans-serif",
        position: 'relative',
        outline: isSelected ? '2px solid #E11D48' : 'none',
        outlineOffset: isSelected ? '3px' : '0',
      }}
    >
      <InjectStyles />

      {/* ambient texture */}
      <div style={{
        position: 'absolute', inset: 0, pointerEvents: 'none',
        backgroundImage: 'radial-gradient(ellipse at 90% 5%, rgba(225,29,72,0.03) 0%, transparent 55%), radial-gradient(ellipse at 5% 95%, rgba(8,145,178,0.03) 0%, transparent 50%)',
      }} />

      <div style={{ maxWidth: 1240, margin: '0 auto', padding: '0 40px', position: 'relative' }}>

        {/* ── Header ────────────────────────────────────────────── */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 64, flexWrap: 'wrap', gap: 20 }}>
          <div style={{ maxWidth: 520 }}>
            {/* micro label */}
            <div style={{
              display: 'inline-flex', alignItems: 'center', gap: 10,
              fontSize: 10, letterSpacing: '0.22em', textTransform: 'uppercase',
              color: 'rgba(0,0,0,0.3)', marginBottom: 14, pointerEvents: 'none',
            }}>
              <div style={{ width: 20, height: 1, background: 'rgba(0,0,0,0.2)' }} />
              latest articles
            </div>

            <CE
              as="h2" value={content.headline} isEditing={isEditing}
              onSave={(val) => onContentChange("headline", val)}
              style={{
                fontFamily: "'Playfair Display', serif",
                fontSize: 'clamp(32px, 4.5vw, 58px)',
                fontWeight: 900, lineHeight: 1.0, letterSpacing: '-0.02em',
                color: headingColor, marginBottom: 0, display: 'block',
                animation: 'bl-up 0.6s ease both',
              }}
            />

            {/* accent bar */}
            <div style={{
              width: 36, height: 3, background: '#E11D48',
              margin: '18px 0 0',
              transformOrigin: 'left', animation: 'bl-bar 0.7s ease 0.1s both',
            }} />
          </div>

          <CE
            as="p" value={content.subheadline} isEditing={isEditing}
            onSave={(val) => onContentChange("subheadline", val)}
            style={{
              fontFamily: "'Outfit', sans-serif",
              fontSize: 15, lineHeight: 1.75,
              color: paragraphColor, opacity: 0.7,
              maxWidth: 340, display: 'block',
              animation: 'bl-up 0.6s ease 0.07s both',
            }}
          />
        </div>

        {/* ── Posts grid ────────────────────────────────────────── */}
        {variant === 'magazine' && (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(380px, 1fr))',
            gap: 32,
            marginBottom: isEditing ? 40 : 0,
          }}>
            {content.posts.map((post, index) => {
              const accent = ACCENTS[index % ACCENTS.length];
              const isFeatured = index % 3 === 0;
              return (
                <article
                  key={post.id}
                  className="bl-card"
                  style={{
                    background: '#fff',
                    borderRadius: '8px',
                    overflow: 'hidden',
                    border: '1px solid rgba(0,0,0,0.07)',
                    position: 'relative',
                    gridColumn: isFeatured ? 'span 2' : 'span 1',
                    gridRow: isFeatured ? 'span 2' : 'span 1',
                    animation: `bl-in 0.5s ease ${index * 0.07}s both`,
                  }}
                >
                  {/* Featured image for magazine style */}
                  <div style={{ height: isFeatured ? 320 : 200, overflow: 'hidden', position: 'relative', background: '#f1f5f9' }}>
                    {post.imageUrl ? (
                      <img
                        src={post.imageUrl} alt={post.title}
                        className="bl-card-img"
                        style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                      />
                    ) : (
                      <div style={{
                        width: '100%', height: '100%',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        background: `${accent}0d`,
                      }}>
                        <div style={{ width: 48, height: 48, borderRadius: '50%', background: `${accent}18`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          <Image size={24} style={{ color: accent }} />
                        </div>
                      </div>
                    )}
                    
                    {/* accent top strip */}
                    <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 4, background: accent }} />

                    {/* category badge */}
                    <div style={{
                      position: 'absolute', top: 16, left: 16,
                      fontFamily: "'Outfit', sans-serif",
                      fontSize: 10, fontWeight: 600,
                      letterSpacing: '0.1em', textTransform: 'uppercase',
                      color: '#fff',
                      background: 'rgba(0,0,0,0.6)',
                      backdropFilter: 'blur(6px)',
                      padding: '4px 12px', borderRadius: 4,
                    }}>
                      {post.category || 'Article'}
                    </div>

                    {/* edit controls */}
                    {isEditing && (
                      <div style={{ position: 'absolute', top: 16, right: 16, display: 'flex', gap: 6, zIndex: 10 }}>
                        <button
                          className="bl-edit-btn"
                          onClick={() => editImage(post.id)}
                          style={{ background: '#0f172a', color: '#fff' }}
                        >
                          <Image size={11} />
                          Image
                        </button>
                        <button
                          className="bl-edit-btn"
                          onClick={() => removePost(post.id)}
                          style={{ background: '#E11D48', color: '#fff' }}
                        >
                          <Trash size={11} />
                          Remove
                        </button>
                      </div>
                    )}
                  </div>

                  {/* Content */}
                  <div style={{ padding: isFeatured ? '32px 28px' : '24px 20px' }}>
                    {/* meta row */}
                    <div style={{
                      display: 'flex', alignItems: 'center', gap: 8,
                      marginBottom: 16,
                    }}>
                      <CE
                        as="span" value={post.author} isEditing={isEditing}
                        onSave={(val) => updatePost(post.id, "author", val)}
                        style={{
                          fontFamily: "'Outfit', sans-serif",
                          fontSize: 11, fontWeight: 500,
                          letterSpacing: '0.08em', textTransform: 'uppercase',
                          color: accent,
                        }}
                      />
                      <span style={{ fontSize: 10, color: 'rgba(0,0,0,0.2)' }}>·</span>
                      <CE
                        as="span" value={post.date} isEditing={isEditing}
                        onSave={(val) => updatePost(post.id, "date", val)}
                        style={{
                          fontFamily: "'Outfit', sans-serif",
                          fontSize: 11, color: 'rgba(0,0,0,0.35)',
                          letterSpacing: '0.05em',
                        }}
                      />
                    </div>

                    {/* Title */}
                    <CE
                      as="h3" value={post.title} isEditing={isEditing}
                      onSave={(val) => updatePost(post.id, "title", val)}
                      style={{
                        fontFamily: "'Playfair Display', serif",
                        fontSize: isFeatured ? 28 : 20, fontWeight: 700,
                        lineHeight: 1.25, color: headingColor,
                        marginBottom: 12, display: 'block',
                      }}
                    />

                    {/* Excerpt */}
                    <CE
                      as="p" value={post.excerpt} isEditing={isEditing}
                      onSave={(val) => updatePost(post.id, "excerpt", val)}
                      style={{
                        fontFamily: "'Outfit', sans-serif",
                        fontSize: isFeatured ? 16 : 14, lineHeight: 1.7,
                        color: paragraphColor, opacity: 0.72,
                        marginBottom: 20, display: 'block',
                      }}
                    />

                    {/* Read more link */}
                    <div style={{
                      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                      borderTop: '1px solid rgba(0,0,0,0.07)',
                      paddingTop: 16,
                    }}>
                      <span style={{
                        fontFamily: "'Outfit', sans-serif",
                        fontSize: 11, fontWeight: 600,
                        letterSpacing: '0.14em', textTransform: 'uppercase',
                        color: accent,
                      }}>
                        Read Article
                      </span>
                      <div className="bl-arrow">
                        <ArrowUpRight size={16} style={{ color: accent }} />
                      </div>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        )}

        {variant === 'cards' && (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
            gap: 24,
            marginBottom: isEditing ? 40 : 0,
          }}>
            {content.posts.map((post, index) => {
              const accent = ACCENTS[index % ACCENTS.length];
              return (
                <article
                  key={post.id}
                  className="bl-card"
                  style={{
                    background: '#fff',
                    borderRadius: '12px',
                    overflow: 'hidden',
                    border: '1px solid rgba(0,0,0,0.07)',
                    boxShadow: '0 4px 24px rgba(0,0,0,0.08)',
                    position: 'relative',
                    animation: `bl-in 0.5s ease ${index * 0.07}s both`,
                  }}
                >
                  {/* Image with overlay */}
                  <div style={{ height: 160, overflow: 'hidden', position: 'relative', background: '#f1f5f9' }}>
                    {post.imageUrl ? (
                      <img
                        src={post.imageUrl} alt={post.title}
                        className="bl-card-img"
                        style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                      />
                    ) : (
                      <div style={{
                        width: '100%', height: '100%',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        background: `${accent}0d`,
                      }}>
                        <div style={{ width: 48, height: 48, borderRadius: '50%', background: `${accent}18`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          <Image size={24} style={{ color: accent }} />
                        </div>
                      </div>
                    )}
                    
                    {/* overlay gradient */}
                    <div style={{
                      position: 'absolute', inset: 0,
                      background: 'linear-gradient(to top, rgba(0,0,0,0.7) 0%, transparent 60%)',
                    }} />
                    
                    {/* edit controls */}
                    {isEditing && (
                      <div style={{ position: 'absolute', top: 12, right: 12, display: 'flex', gap: 6, zIndex: 10 }}>
                        <button
                          className="bl-edit-btn"
                          onClick={() => editImage(post.id)}
                          style={{ background: '#0f172a', color: '#fff' }}
                        >
                          <Image size={11} />
                          Image
                        </button>
                        <button
                          className="bl-edit-btn"
                          onClick={() => removePost(post.id)}
                          style={{ background: '#E11D48', color: '#fff' }}
                        >
                          <Trash size={11} />
                          Remove
                        </button>
                      </div>
                    )}
                  </div>

                  {/* Content */}
                  <div style={{ padding: '20px', position: 'relative', zIndex: 1 }}>
                    {/* Category badge */}
                    <div style={{
                      display: 'inline-block',
                      marginBottom: 12,
                      padding: '4px 12px',
                      background: accent,
                      color: '#fff',
                      fontFamily: "'Outfit', sans-serif",
                      fontSize: 9, fontWeight: 600,
                      letterSpacing: '0.1em',
                      textTransform: 'uppercase',
                      borderRadius: '4px',
                    }}>
                      {post.category || 'Article'}
                    </div>

                    {/* Title */}
                    <CE
                      as="h3" value={post.title} isEditing={isEditing}
                      onSave={(val) => updatePost(post.id, "title", val)}
                      style={{
                        fontFamily: "'Playfair Display', serif",
                        fontSize: 18, fontWeight: 700,
                        lineHeight: 1.3,
                        color: headingColor,
                        marginBottom: 8, display: 'block',
                      }}
                    />

                    {/* Meta */}
                    <div style={{
                      display: 'flex', alignItems: 'center', gap: 8,
                      marginBottom: 12,
                    }}>
                      <CE
                        as="span" value={post.author} isEditing={isEditing}
                        onSave={(val) => updatePost(post.id, "author", val)}
                        style={{
                          fontFamily: "'Outfit', sans-serif",
                          fontSize: 10, fontWeight: 500,
                          letterSpacing: '0.08em', textTransform: 'uppercase',
                          color: accent,
                        }}
                      />
                      <span style={{ fontSize: 9, color: 'rgba(0,0,0,0.3)' }}>•</span>
                      <CE
                        as="span" value={post.date} isEditing={isEditing}
                        onSave={(val) => updatePost(post.id, "date", val)}
                        style={{
                          fontFamily: "'Outfit', sans-serif",
                          fontSize: 10, color: 'rgba(0,0,0,0.35)',
                          letterSpacing: '0.05em',
                        }}
                      />
                    </div>

                    {/* Excerpt */}
                    <CE
                      as="p" value={post.excerpt} isEditing={isEditing}
                      onSave={(val) => updatePost(post.id, "excerpt", val)}
                      style={{
                        fontFamily: "'Outfit', sans-serif",
                        fontSize: 13, lineHeight: 1.6,
                        color: paragraphColor, opacity: 0.7,
                        marginBottom: 16, display: 'block',
                      }}
                    />
                  </div>
                </article>
              );
            })}
          </div>
        )}

        {variant === 'list' && (
          <div style={{ maxWidth: '800px', margin: '0 auto', marginBottom: isEditing ? 40 : 0 }}>
            {content.posts.map((post, index) => {
              const accent = ACCENTS[index % ACCENTS.length];
              return (
                <article
                  key={post.id}
                  style={{
                    display: 'flex',
                    gap: 24,
                    marginBottom: 32,
                    paddingBottom: 32,
                    borderBottom: index < content.posts.length - 1 ? '1px solid rgba(0,0,0,0.08)' : 'none',
                    animation: `bl-up 0.5s ease ${index * 0.1}s both`,
                  }}
                >
                  {/* Image */}
                  <div style={{
                    width: 120, height: 120, flexShrink: 0, borderRadius: '8px', overflow: 'hidden', border: '1px solid rgba(0,0,0,0.1)' }}>
                    {post.imageUrl ? (
                      <img
                        src={post.imageUrl} alt={post.title}
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                      />
                    ) : (
                      <div style={{
                        width: '100%', height: '100%',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        background: `${accent}0d`,
                      }}>
                        <Image size={24} style={{ color: accent }} />
                      </div>
                    )}
                    {isEditing && (
                      <button
                        onClick={() => editImage(post.id)}
                        style={{
                          position: 'absolute', top: 4, right: 4,
                          width: 28, height: 28,
                          background: 'rgba(0,0,0,0.7)',
                          color: '#fff',
                          border: 'none', borderRadius: '4px',
                          cursor: 'pointer',
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                        }}
                      >
                        <Image size={12} />
                      </button>
                    )}
                  </div>

                  {/* Content */}
                  <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                    <div>
                      {/* Category and date */}
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                        <div style={{
                          padding: '4px 10px',
                          background: accent,
                          color: '#fff',
                          fontFamily: "'Outfit', sans-serif",
                          fontSize: 9, fontWeight: 600,
                          letterSpacing: '0.1em',
                          textTransform: 'uppercase',
                          borderRadius: '4px',
                        }}>
                          {post.category || 'Article'}
                        </div>
                        <CE
                          as="span" value={post.date} isEditing={isEditing}
                          onSave={(val) => updatePost(post.id, "date", val)}
                          style={{
                            fontFamily: "'Outfit', sans-serif",
                            fontSize: 10, color: 'rgba(0,0,0,0.4)',
                            letterSpacing: '0.05em',
                          }}
                        />
                      </div>

                      {/* Title */}
                      <CE
                        as="h3" value={post.title} isEditing={isEditing}
                        onSave={(val) => updatePost(post.id, "title", val)}
                        style={{
                          fontFamily: "'Playfair Display', serif",
                          fontSize: 20, fontWeight: 700,
                          lineHeight: 1.3,
                          color: headingColor,
                          marginBottom: 8,
                        }}
                      />

                      {/* Excerpt */}
                      <CE
                        as="p" value={post.excerpt} isEditing={isEditing}
                        onSave={(val) => updatePost(post.id, "excerpt", val)}
                        style={{
                          fontFamily: "'Outfit', sans-serif",
                          fontSize: 14, lineHeight: 1.6,
                          color: paragraphColor, opacity: 0.7,
                          marginBottom: 12,
                        }}
                      />

                      {/* Author */}
                      <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                        <CE
                          as="span" value={post.author} isEditing={isEditing}
                          onSave={(val) => updatePost(post.id, "author", val)}
                          style={{
                            fontFamily: "'Outfit', sans-serif",
                            fontSize: 11, fontWeight: 500,
                            letterSpacing: '0.08em', textTransform: 'uppercase',
                            color: accent,
                          }}
                        />
                      </div>
                    </div>

                    {/* Read more link */}
                    <div style={{
                      display: 'flex', alignItems: 'center',
                      gap: 8,
                      alignSelf: 'flex-end',
                    }}>
                      <button
                        style={{
                          fontFamily: "'Outfit', sans-serif",
                          fontSize: 11, fontWeight: 600,
                          letterSpacing: '0.14em', textTransform: 'uppercase',
                          color: accent,
                          border: 'none',
                          background: 'transparent',
                          cursor: 'pointer',
                          display: 'flex', alignItems: 'center',
                          gap: 4,
                          transition: 'all 0.2s ease',
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.transform = 'translateX(2px)';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.transform = 'translateX(0)';
                        }}
                      >
                        Read Article
                        <ArrowUpRight size={14} style={{ color: accent }} />
                      </button>
                    </div>
                  </div>

                  {/* Edit controls for list view */}
                  {isEditing && (
                    <div style={{ display: 'flex', gap: 2 }}>
                      <button
                        onClick={() => removePost(post.id)}
                        className="bl-edit-btn"
                        style={{ background: '#E11D48', color: '#fff' }}
                      >
                        <Trash size={11} />
                        Remove
                      </button>
                    </div>
                  )}
                </article>
              );
            })}
          </div>
        )}

        {/* Default grid variant */}
        {(!variant || variant === 'grid') && (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
            gap: 24,
            marginBottom: isEditing ? 40 : 0,
          }}>
            {content.posts.map((post, index) => {
              const accent = ACCENTS[index % ACCENTS.length];
              return (
                <article
                  key={post.id}
                  className="bl-card"
                  style={{
                    background: '#fff',
                    borderRadius: '4px',
                    overflow: 'hidden',
                    border: '1px solid rgba(0,0,0,0.07)',
                    position: 'relative',
                    animation: `bl-in 0.5s ease ${index * 0.07}s both`,
                  }}
                >
                  {/* Image */}
                  <div style={{ height: 220, overflow: 'hidden', position: 'relative', background: '#f1f5f9' }}>
                    {post.imageUrl ? (
                      <img
                        src={post.imageUrl} alt={post.title}
                        className="bl-card-img"
                        style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                      />
                    ) : (
                      <div style={{
                        width: '100%', height: '100%',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        background: `${accent}0d`,
                      }}>
                        <div style={{ width: 48, height: 48, borderRadius: '50%', background: `${accent}18`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          <Image size={20} style={{ color: accent }} />
                        </div>
                      </div>
                    )}
                    
                    {/* accent top strip */}
                    <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 3, background: accent }} />

                    {/* index badge */}
                    <div style={{
                      position: 'absolute', bottom: 14, left: 16,
                      fontFamily: "'Outfit', sans-serif",
                      fontSize: 9, fontWeight: 600,
                      letterSpacing: '0.2em',
                      color: '#fff',
                      background: 'rgba(0,0,0,0.45)',
                      backdropFilter: 'blur(6px)',
                      padding: '3px 8px', borderRadius: 2,
                    }}>
                      {String(index + 1).padStart(2, '0')}
                    </div>

                    {/* edit controls */}
                    {isEditing && (
                      <div style={{ position: 'absolute', top: 12, right: 12, display: 'flex', gap: 6, zIndex: 10 }}>
                        <button
                          className="bl-edit-btn"
                          onClick={() => editImage(post.id)}
                          style={{ background: '#0f172a', color: '#fff' }}
                        >
                          <Image size={11} />
                          Image
                        </button>
                        <button
                          className="bl-edit-btn"
                          onClick={() => removePost(post.id)}
                          style={{ background: '#E11D48', color: '#fff' }}
                        >
                          <Trash size={11} />
                          Remove
                        </button>
                      </div>
                    )}
                  </div>

                  {/* Content */}
                  <div style={{ padding: '28px 24px 24px' }}>
                    {/* meta row */}
                    <div style={{
                      display: 'flex', alignItems: 'center', gap: 6,
                      marginBottom: 14,
                    }}>
                      <CE
                        as="span" value={post.author} isEditing={isEditing}
                        onSave={(val) => updatePost(post.id, "author", val)}
                        style={{
                          fontFamily: "'Outfit', sans-serif",
                          fontSize: 11, fontWeight: 500,
                          letterSpacing: '0.08em', textTransform: 'uppercase',
                          color: accent,
                        }}
                      />
                      <span style={{ fontSize: 10, color: 'rgba(0,0,0,0.2)' }}>·</span>
                      <CE
                        as="span" value={post.date} isEditing={isEditing}
                        onSave={(val) => updatePost(post.id, "date", val)}
                        style={{
                          fontFamily: "'Outfit', sans-serif",
                          fontSize: 11, color: 'rgba(0,0,0,0.35)',
                          letterSpacing: '0.05em',
                        }}
                      />
                    </div>

                    {/* Title */}
                    <CE
                      as="h3" value={post.title} isEditing={isEditing}
                      onSave={(val) => updatePost(post.id, "title", val)}
                      style={{
                        fontFamily: "'Playfair Display', serif",
                        fontSize: 20, fontWeight: 700,
                        lineHeight: 1.25, color: headingColor,
                        marginBottom: 12, display: 'block',
                      }}
                    />

                    {/* Excerpt */}
                    <CE
                      as="p" value={post.excerpt} isEditing={isEditing}
                      onSave={(val) => updatePost(post.id, "excerpt", val)}
                      style={{
                        fontFamily: "'Outfit', sans-serif",
                        fontSize: 14, lineHeight: 1.7,
                        color: paragraphColor, opacity: 0.72,
                        marginBottom: 20, display: 'block',
                      }}
                    />

                    {/* Read more link */}
                    <div style={{
                      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                      borderTop: '1px solid rgba(0,0,0,0.07)',
                      paddingTop: 16,
                    }}>
                      <span style={{
                        fontFamily: "'Outfit', sans-serif",
                        fontSize: 11, fontWeight: 600,
                        letterSpacing: '0.14em', textTransform: 'uppercase',
                        color: accent,
                      }}>
                        Read Article
                      </span>
                      <div className="bl-arrow">
                        <ArrowUpRight size={16} style={{ color: accent }} />
                      </div>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        )}

        {/* ── Add post button ───────────────────────────────────── */}
        {isEditing && (
          <button className="bl-add-btn" onClick={addPost}>
            <Plus size={14} />
            Add Post
          </button>
        )}
      </div>
    </section>
  );
}