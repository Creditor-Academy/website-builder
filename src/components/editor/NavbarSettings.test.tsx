/**
 * @vitest-environment happy-dom
 */
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { NavbarSettings } from './NavbarSettings';

describe('NavbarSettings - Navigation Radius', () => {
  const defaultNavbar = {
    links: [
      { id: '1', label: 'Home', href: '/', isButton: false },
    ],
    styles: {
      backgroundColor: '#ffffff',
      textColor: '#000000',
      borderRadius: '0px',
      buttonRadius: '999px',
      sticky: false,
    },
    logo: { text: 'MyBrand' },
  };

  it('renders navbar radius preset buttons', () => {
    render(
      <NavbarSettings
        navbar={defaultNavbar}
        pages={[]}
        onUpdate={vi.fn()}
        isExpanded={true}
      />
    );

    expect(screen.getByText('Navbar Radius (Curved Edges)')).toBeTruthy();
    expect(screen.getByText('Sharp')).toBeTruthy();
    expect(screen.getByText('Subtle')).toBeTruthy();
    expect(screen.getByText('Curved')).toBeTruthy();
    expect(screen.getByText('Round')).toBeTruthy();
    expect(screen.getAllByText('Pill').length).toBeGreaterThanOrEqual(1);
  });

  it('calls onUpdate with borderRadius when a preset radius button is clicked', () => {
    const onUpdate = vi.fn();
    render(
      <NavbarSettings
        navbar={defaultNavbar}
        pages={[]}
        onUpdate={onUpdate}
        isExpanded={true}
      />
    );

    const curvedBtn = screen.getByText('Curved').closest('button');
    expect(curvedBtn).toBeTruthy();
    fireEvent.click(curvedBtn!);

    expect(onUpdate).toHaveBeenCalledWith({
      styles: expect.objectContaining({
        borderRadius: '16px',
      }),
    });
  });

  it('calls onUpdate with custom borderRadius when typed in input', () => {
    const onUpdate = vi.fn();
    render(
      <NavbarSettings
        navbar={defaultNavbar}
        pages={[]}
        onUpdate={onUpdate}
        isExpanded={true}
      />
    );

    const customInput = screen.getByPlaceholderText('Custom radius (e.g. 12px, 20px, 9999px)');
    fireEvent.change(customInput, { target: { value: '28px' } });

    expect(onUpdate).toHaveBeenCalledWith({
      styles: expect.objectContaining({
        borderRadius: '28px',
      }),
    });
  });

  it('updates buttonRadius separately from navbar borderRadius', () => {
    const onUpdate = vi.fn();
    render(
      <NavbarSettings
        navbar={defaultNavbar}
        pages={[]}
        onUpdate={onUpdate}
        isExpanded={true}
      />
    );

    const buttonRadiusInput = screen.getByPlaceholderText('Custom (e.g. 999px)');
    fireEvent.change(buttonRadiusInput, { target: { value: '8px' } });

    expect(onUpdate).toHaveBeenCalledWith({
      styles: expect.objectContaining({
        buttonRadius: '8px',
      }),
    });
  });
});
