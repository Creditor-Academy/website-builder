import { describe, expect, it } from 'vitest';
import { preserveNavbarFlowSlot } from './navbarSlot';

describe('navbar flow slot', () => {
  it('locks the original header height before the navbar leaves document flow', () => {
    const slot = document.createElement('div');
    slot.setAttribute('data-navbar-slot', '');
    const navbar = document.createElement('div');
    navbar.dataset.canvasNode = 'navbar';
    Object.defineProperty(navbar, 'offsetHeight', { value: 68 });
    document.body.append(slot, navbar);

    expect(preserveNavbarFlowSlot(navbar)).toBe(68);
    expect(slot.style.height).toBe('68px');
    expect(preserveNavbarFlowSlot(navbar)).toBe(68);

    slot.remove();
    navbar.remove();
  });
});
