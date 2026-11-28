/**
 * @vitest-environment happy-dom
 */
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { StatsSection, StatsSectionData } from './StatsSection';

describe('StatsSection', () => {
  const baseSection: StatsSectionData = {
    id: 'stats-1',
    type: 'stats',
    name: 'Stats',
    variant: 'cards',
    styles: {
      backgroundColor: '#0f172a',
      fontFamily: 'Playfair Display',
      headingColor: '#ff5500',
      paragraphColor: '#a0aec0',
      accentColor: '#00ffcc',
      cardBackgroundColor: '#1a202c',
      borderColor: '#e2e8f0',
      borderWidth: '2px',
      borderStyle: 'dashed',
      borderRadius: '24px',
    },
    content: {
      headline: 'Our Achievements',
      subheadline: 'Numbers that define our journey',
      stats: [
        { id: 'stat-1', value: '150', suffix: '+', label: 'Projects Done' },
        { id: 'stat-2', value: '99', suffix: '%', label: 'Satisfaction' },
      ],
    },
  };

  it('renders with custom typography, colors, and border styles in cards variant', () => {
    const { container } = render(
      <StatsSection section={baseSection} isEditing={false} />
    );

    // Headline and subheadline rendered
    expect(screen.getByText('Our Achievements')).toBeTruthy();
    expect(screen.getByText('Numbers that define our journey')).toBeTruthy();

    // Check custom font family applied to section
    const sectionEl = container.querySelector('section');
    expect(sectionEl?.style.fontFamily).toContain('Playfair Display');

    // Check cards have custom cardBackgroundColor, border styles, and border radius
    const cardEl = container.querySelector('.group.relative.backdrop-blur-md') as HTMLElement;
    expect(cardEl).toBeTruthy();
    expect(['#1a202c', 'rgb(26, 32, 44)']).toContain(cardEl.style.backgroundColor);
    expect(['#e2e8f0', 'rgb(226, 232, 240)']).toContain(cardEl.style.borderColor);
    expect(cardEl.style.borderWidth).toBe('2px');
    expect(cardEl.style.borderStyle).toBe('dashed');
    expect(cardEl.style.borderRadius).toBe('24px');

    // Check value has custom headingColor and fontFamily
    const valueEl = screen.getByText('150');
    expect(['#ff5500', 'rgb(255, 85, 0)']).toContain(valueEl.style.color);
    expect(valueEl.style.fontFamily).toContain('Playfair Display');

    // Check suffix has custom accentColor
    const suffixEl = screen.getByText('+');
    expect(['#00ffcc', 'rgb(0, 255, 204)']).toContain(suffixEl.style.color);

    // Check label has custom paragraphColor
    const labelEl = screen.getByText('Projects Done');
    expect(['#a0aec0', 'rgb(160, 174, 192)']).toContain(labelEl.style.color);
  });

  it('renders with custom colors and borders in horizontal variant', () => {
    const horizontalSection: StatsSectionData = {
      ...baseSection,
      variant: 'horizontal',
      styles: {
        ...baseSection.styles,
        borderColor: '#3b82f6',
        borderWidth: '3px',
      },
    };

    const { container } = render(
      <StatsSection section={horizontalSection} isEditing={false} />
    );

    const sectionEl = container.querySelector('section');
    expect(['#3b82f6', 'rgb(59, 130, 246)']).toContain(sectionEl?.style.borderTopColor);
    expect(['#3b82f6', 'rgb(59, 130, 246)']).toContain(sectionEl?.style.borderBottomColor);
    expect(sectionEl?.style.borderTopWidth).toBe('3px');
    expect(sectionEl?.style.borderBottomWidth).toBe('3px');

    // Value color
    const val = screen.getByText('150');
    expect(['#ff5500', 'rgb(255, 85, 0)']).toContain(val.style.color);

    // Suffix color
    const suf = screen.getByText('+');
    expect(['#00ffcc', 'rgb(0, 255, 204)']).toContain(suf.style.color);
  });

  it('renders with custom colors in counter variant', () => {
    const counterSection: StatsSectionData = {
      ...baseSection,
      variant: 'counter',
    };

    render(<StatsSection section={counterSection} isEditing={false} />);

    const val = screen.getByText('150');
    expect(['#ff5500', 'rgb(255, 85, 0)']).toContain(val.style.color);
    expect(val.style.fontFamily).toContain('Playfair Display');

    const suf = screen.getByText('+');
    expect(['#00ffcc', 'rgb(0, 255, 204)']).toContain(suf.style.color);

    const label = screen.getByText('Projects Done');
    expect(['#a0aec0', 'rgb(160, 174, 192)']).toContain(label.style.color);
  });

  it('calls onContentChange when editing stat values and labels', () => {
    const onContentChange = vi.fn();
    render(
      <StatsSection
        section={baseSection}
        isEditing={true}
        onContentChange={onContentChange}
      />
    );

    const valueEl = screen.getByText('150');
    // Blur with new content
    fireEvent.blur(valueEl, { target: { innerHTML: '200' } });

    expect(onContentChange).toHaveBeenCalledWith('stats', [
      { id: 'stat-1', value: '200', suffix: '+', label: 'Projects Done' },
      { id: 'stat-2', value: '99', suffix: '%', label: 'Satisfaction' },
    ]);
  });
});
