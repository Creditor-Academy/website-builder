import React from 'react';

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
            onContentChange(field, e.currentTarget.textContent || '');
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
                    <h1
                        className="text-4xl md:text-5xl font-bold mb-8"
                        style={{ color: headingColor }}
                        contentEditable={isEditing}
                        suppressContentEditableWarning
                        onBlur={(e) => handleTextEdit('title', e)}
                    >
                        {content.title}
                    </h1>
                )}

                {/* Last Updated */}
                {content.lastUpdated && (
                    <p
                        className="text-sm opacity-60 mb-8"
                        style={{ color: paragraphColor }}
                        contentEditable={isEditing}
                        suppressContentEditableWarning
                        onBlur={(e) => handleTextEdit('lastUpdated', e)}
                    >
                        {content.lastUpdated}
                    </p>
                )}

                {/* Main Content */}
                <div
                    className="prose prose-lg max-w-none"
                    style={{ color: paragraphColor }}
                >
                    {content.sections?.map((section, index) => (
                        <div key={section.id || index} className="mb-8">
                            {section.heading && (
                                <h2
                                    className="text-2xl md:text-3xl font-bold mb-4 mt-8"
                                    style={{ color: headingColor }}
                                    contentEditable={isEditing}
                                    suppressContentEditableWarning
                                    onBlur={(e) => {
                                        if (!isEditing || !onContentChange) return;
                                        const updated = content.sections.map((s, i) =>
                                            i === index ? { ...s, heading: e.currentTarget.textContent } : s
                                        );
                                        onContentChange('sections', updated);
                                    }}
                                >
                                    {section.heading}
                                </h2>
                            )}
                            {section.content && (
                                <div
                                    className="leading-relaxed mb-4"
                                    style={{ color: paragraphColor }}
                                    contentEditable={isEditing}
                                    suppressContentEditableWarning
                                    onBlur={(e) => {
                                        if (!isEditing || !onContentChange) return;
                                        const updated = content.sections.map((s, i) =>
                                            i === index ? { ...s, content: e.currentTarget.textContent } : s
                                        );
                                        onContentChange('sections', updated);
                                    }}
                                >
                                    {section.content}
                                </div>
                            )}
                            {section.listItems && section.listItems.length > 0 && (
                                <ul className="list-disc list-inside space-y-2 mb-4 ml-4">
                                    {section.listItems.map((item, itemIndex) => (
                                        <li
                                            key={itemIndex}
                                            style={{ color: paragraphColor }}
                                            contentEditable={isEditing}
                                            suppressContentEditableWarning
                                            onBlur={(e) => {
                                                if (!isEditing || !onContentChange) return;
                                                const updated = content.sections.map((s, i) =>
                                                    i === index ? {
                                                        ...s,
                                                        listItems: s.listItems.map((li, liIdx) =>
                                                            liIdx === itemIndex ? e.currentTarget.textContent : li
                                                        )
                                                    } : s
                                                );
                                                onContentChange('sections', updated);
                                            }}
                                        >
                                            {item}
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </div>
                    ))}

                    {/* If no sections, allow editing a single content block */}
                    {(!content.sections || content.sections.length === 0) && (
                        <div
                            className="leading-relaxed whitespace-pre-wrap"
                            style={{ color: paragraphColor }}
                            contentEditable={isEditing}
                            suppressContentEditableWarning
                            onBlur={(e) => handleTextEdit('content', e)}
                        >
                            {content.content || 'Click to edit content...'}
                        </div>
                    )}
                </div>
            </div>
        </section>
    );
}

