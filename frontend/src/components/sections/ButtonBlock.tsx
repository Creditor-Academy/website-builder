import React from 'react';
import { Button } from '@/components/ui/button';

export function ButtonBlock({ section, isSelected, isEditing, onContentChange }) {
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
                padding: styles.padding || '40px 0',
                minHeight: styles.minHeight
            }}
            className={`relative ${isSelected ? 'ring-2 ring-primary ring-inset' : ''}`}
        >
            <div className="container mx-auto px-6">
                <div
                    style={{ textAlign: content.align || 'center' }}
                >
                    <Button
                        style={{
                            background: styles.buttonPrimaryBg,
                            color: styles.buttonPrimaryText,
                            borderRadius: styles.borderRadius || 'var(--radius, 16px)',
                            minHeight: 'auto',
                            padding: '12px 32px',
                        }}
                        className="shadow-sm hover:scale-105 transition-transform font-semibold text-base"
                    >
                        <span
                            contentEditable={isEditing}
                            suppressContentEditableWarning
                            onBlur={(e) => handleTextEdit('text', e)}
                         dangerouslySetInnerHTML={{ __html: content.text || 'Click Me' }} />
                    </Button>
                </div>
            </div>
        </section>
    );
}
