import React from 'react';
import { Editable } from '@/components/ui/Editable';

export function ContentSection({ section, isSelected, isEditing, onContentChange }) {
    const { content, styles } = section;
    const background = styles.useGradient ? (styles.backgroundGradient || styles.backgroundColor) : (styles.backgroundColor || '#ffffff');

    // Get text colors with fallbacks
    const headingColor = styles.headingColor || '#0f172a';
    const paragraphColor = styles.paragraphColor || '#475569';

    const sectionStyle = {
        background,
        padding: styles.padding || '80px 0',
    };

    const handleTextEdit = (field, e) => {
        if (onContentChange && isEditing) {
            onContentChange(field, e.currentTarget.innerHTML || '');
        }
    };

    return (
        <section
            className={`relative transition-all duration-300 ${isSelected ? 'ring-2 ring-primary ring-offset-2 ring-offset-background' : ''
                }`}
            style={sectionStyle}
        >
            <div className="container mx-auto px-6 max-w-4xl">
                {/* Title */}
                {content.title && (
                    <Editable
                        as="h1"
                        className="text-4xl md:text-5xl font-bold mb-8"
                        style={{ color: headingColor }}
                        isEditing={isEditing}
                        value={content.title || ''}
                        onSave={(val) => onContentChange?.('title', val)}
                    />
                )}

                {/* Last Updated */}
                {content.lastUpdated && (
                    <Editable
                        as="p"
                        className="text-sm opacity-60 mb-8"
                        style={{ color: paragraphColor }}
                        isEditing={isEditing}
                        value={content.lastUpdated || ''}
                        onSave={(val) => onContentChange?.('lastUpdated', val)}
                    />
                )}

                {/* Main Content */}
                <div
                    className="prose prose-lg max-w-none"
                    style={{ color: paragraphColor }}
                >
                    {content.sections?.map((section, index) => (
                        <div key={section.id || index} className="mb-8">
                            {section.heading && (
                                <Editable
                                    as="h2"
                                    className="text-2xl md:text-3xl font-bold mb-4 mt-8"
                                    style={{ color: headingColor }}
                                    isEditing={isEditing}
                                    value={section.heading || ''}
                                    onSave={(val) => {
                                        if (!isEditing || !onContentChange) return;
                                        const updated = content.sections.map((s, i) =>
                                            i === index ? { ...s, heading: val } : s
                                        );
                                        onContentChange('sections', updated);
                                    }}
                                />
                            )}
                            {section.content && (
                                <Editable
                                    className="leading-relaxed mb-4"
                                    style={{ color: paragraphColor }}
                                    isEditing={isEditing}
                                    value={section.content || ''}
                                    onSave={(val) => {
                                        if (!isEditing || !onContentChange) return;
                                        const updated = content.sections.map((s, i) =>
                                            i === index ? { ...s, content: val } : s
                                        );
                                        onContentChange('sections', updated);
                                    }}
                                />
                            )}
                            {section.listItems && section.listItems.length > 0 && (
                                <ul className="list-disc list-inside space-y-2 mb-4 ml-4">
                                    {section.listItems.map((item, itemIndex) => (
                                        <Editable
                                            as="li"
                                            key={itemIndex}
                                            style={{ color: paragraphColor }}
                                            isEditing={isEditing}
                                            value={item || ''}
                                            onSave={(val) => {
                                                if (!isEditing || !onContentChange) return;
                                                const updated = content.sections.map((s, i) =>
                                                    i === index ? {
                                                        ...s,
                                                        listItems: s.listItems.map((li, liIdx) =>
                                                            liIdx === itemIndex ? val : li
                                                        )
                                                    } : s
                                                );
                                                onContentChange('sections', updated);
                                            }}
                                        />
                                    ))}
                                </ul>
                            )}
                        </div>
                    ))}

                    {/* If no sections, allow editing a single content block */}
                    {(!content.sections || content.sections.length === 0) && (
                        <Editable
                            className="leading-relaxed whitespace-pre-wrap"
                            style={{ color: paragraphColor }}
                            isEditing={isEditing}
                            value={content.content || 'Click to edit content...'}
                            onSave={(val) => onContentChange?.('content', val)}
                        />
                    )}
                </div>
            </div>
        </section>
    );
}

