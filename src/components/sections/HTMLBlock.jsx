import React from 'react';

export function HTMLBlock({ section, isSelected }) {
    const { content, styles } = section;
    const background = styles.useGradient
        ? styles.backgroundGradient
        : styles.backgroundColor;

    return (
        <section
            style={{
                background,
                padding: styles.padding || '40px 0',
                minHeight: styles.minHeight
            }}
            className={`relative ${isSelected ? 'ring-2 ring-primary ring-inset' : ''}`}
        >
            <div className="container mx-auto px-6">
                <div
                    dangerouslySetInnerHTML={{ __html: content.html || '<!-- Add custom HTML here -->' }}
                />
            </div>
        </section>
    );
}
