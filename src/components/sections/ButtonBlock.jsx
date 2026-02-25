import React from 'react';
import { Button } from '@/components/ui/button';

export function ButtonBlock({ section, isSelected }) {
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
                    style={{ textAlign: content.align || 'center' }}
                >
                    <Button
                        style={{
                            background: styles.buttonPrimaryBg,
                            color: styles.buttonPrimaryText,
                            borderRadius: styles.borderRadius || '8px',
                            padding: '12px 32px',
                            fontSize: '16px',
                            fontWeight: '600'
                        }}
                        className="shadow-sm hover:scale-105 transition-transform"
                    >
                        {content.text || 'Click Me'}
                    </Button>
                </div>
            </div>
        </section>
    );
}
