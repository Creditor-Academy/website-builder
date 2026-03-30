import React from 'react';

export function TextBlock({ section, isSelected, isEditing, onContentChange }) {
    const { content, styles } = section;
    const background = styles.useGradient
        ? styles.backgroundGradient
        : styles.backgroundColor;

    const handleTextEdit = (field, e) => {
        if (onContentChange && isEditing) {
            onContentChange(field, e.currentTarget.innerHTML || '');
        }
    };

    return (
        <section
            style={{
                background,
                padding: styles.padding || '60px 0',
                minHeight: styles.minHeight
            }}
            className={`relative ${isSelected ? 'ring-2 ring-primary ring-inset' : ''}`}
        >
            <div className="container mx-auto px-6">
                <div
                    className="prose prose-lg max-w-none"
                    style={{
                        color: styles.paragraphColor || '#334155',
                        textAlign: content.align || 'left'
                    }}
                    contentEditable={isEditing}
                    suppressContentEditableWarning
                    onBlur={(e) => handleTextEdit('text', e)}
                 dangerouslySetInnerHTML={{ __html: content.text || 'Enter your text here...' }} />
            </div>
        </section>
    );
}
