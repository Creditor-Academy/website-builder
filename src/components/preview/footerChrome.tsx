import { createContext, useContext, useRef, useState, type PointerEvent as ReactPointerEvent, type ReactNode } from 'react';
import { ArrowUpRight } from 'lucide-react';
import { useBuilder } from '@/contexts/BuilderContext';
import useBuilderStore from '@/store/useBuilderStore';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';

const DRAG_THRESHOLD = 6;

type Placement = { x: number; y: number };
type FooterLink = { id?: string; label?: string; href?: string };

type FooterEditValue = {
  isEditing: boolean;
  placements: Record<string, Placement>;
  draft: Record<string, Placement>;
  movePiece: (id: string, x: number, y: number) => void;
  commitPiece: (id: string, x: number, y: number) => void;
  openLinkTarget: (link: FooterLink) => void;
};

const FooterEditContext = createContext<FooterEditValue | null>(null);

function useFooterEdit() {
  const value = useContext(FooterEditContext);
  if (!value) throw new Error('Footer edit controls must render inside the footer');
  return value;
}

export function isExternalHref(href: string) {
  return /^(https?:|mailto:|tel:)/i.test(href);
}

export function normalizePageSlug(href?: string, label?: string) {
  const raw = String(href || '').trim();
  if (!raw || raw === '#') {
    const fromLabel = String(label || 'new-page')
      .trim()
      .toLowerCase()
      .replace(/\s+/g, '-')
      .replace(/[^a-z0-9-]/g, '');
    return `/${fromLabel || 'new-page'}`;
  }
  if (isExternalHref(raw)) return raw;
  const path = raw.split(/[?#]/)[0];
  const slug = path.startsWith('/') ? path : `/${path}`;
  return slug.replace(/\/+$/, '') || '/';
}

function findPageForHref(pages: Array<{ id: string; slug?: string }>, href: string, label?: string) {
  const slug = normalizePageSlug(href, label).toLowerCase();
  return pages.find((page) => normalizePageSlug(page.slug).toLowerCase() === slug) || null;
}

export function FooterEditRoot({
  isEditing,
  onUpdate,
  placements,
  children,
}: {
  isEditing: boolean;
  onUpdate: (updates: Record<string, unknown>) => void;
  placements?: Record<string, Placement>;
  children: ReactNode;
}) {
  const { pages, setActivePage, createPage } = useBuilder();
  const setEditorState = useBuilderStore((store) => store.setEditorState);
  const [pendingLink, setPendingLink] = useState<FooterLink | null>(null);
  const [draft, setDraft] = useState<Record<string, Placement>>({});
  const placementsRef = useRef(placements || {});
  placementsRef.current = placements || {};

  const openPagesSidebar = () => setEditorState({ leftNavTab: 'pages', showLeftPanel: true });

  const goToExistingPage = (pageId: string) => {
    setActivePage(pageId);
    openPagesSidebar();
  };

  const openLinkTarget = (link: FooterLink) => {
    const href = String(link?.href || '').trim();
    if (isExternalHref(href)) {
      window.open(href, '_blank', 'noopener,noreferrer');
      return;
    }
    const target = findPageForHref(pages, href, link?.label);
    if (target) {
      goToExistingPage(target.id);
      return;
    }
    setPendingLink(link);
  };

  const confirmCreatePage = () => {
    if (!pendingLink) return;
    const slug = normalizePageSlug(pendingLink.href, pendingLink.label);
    const name = String(pendingLink.label || slug.replace(/^\//, '') || 'New Page').trim();
    const existing = findPageForHref(pages, slug, name);
    if (existing) {
      goToExistingPage(existing.id);
      setPendingLink(null);
      return;
    }
    createPage({ name, slug, sections: [] });
    openPagesSidebar();
    setPendingLink(null);
  };

  const value: FooterEditValue = {
    isEditing,
    placements: placements || {},
    draft,
    movePiece: (id, x, y) => setDraft((current) => ({ ...current, [id]: { x, y } })),
    commitPiece: (id, x, y) => {
      const next = { ...placementsRef.current, [id]: { x: Math.round(x), y: Math.round(y) } };
      placementsRef.current = next;
      setDraft((current) => {
        const copy = { ...current };
        delete copy[id];
        return copy;
      });
      onUpdate({ placements: next });
    },
    openLinkTarget,
  };

  return (
    <FooterEditContext.Provider value={value}>
      {children}
      <AlertDialog open={Boolean(pendingLink)} onOpenChange={(open) => { if (!open) setPendingLink(null); }}>
        <AlertDialogContent className="max-w-md rounded-2xl">
          <AlertDialogHeader>
            <AlertDialogTitle>Create this page?</AlertDialogTitle>
            <AlertDialogDescription>
              {pendingLink
                ? `"${pendingLink.label || normalizePageSlug(pendingLink.href, pendingLink.label)}" is not in this site yet. Create an empty page and open it?`
                : 'This page is not in this site yet. Create an empty page and open it?'}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmCreatePage}>Create page</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </FooterEditContext.Provider>
  );
}

export function MovablePiece({ id, block = false, children }: { id: string; block?: boolean; children: ReactNode }) {
  const { isEditing, placements, draft, movePiece, commitPiece } = useFooterEdit();
  const place = draft[id] || placements[id];

  const onPointerDown = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (!isEditing || event.button !== 0) return;
    const target = event.target as HTMLElement;
    if (target.closest('[data-footer-go]')) return;
    const focused = document.activeElement;
    if (focused instanceof HTMLElement && focused.isContentEditable && target.closest('[contenteditable="true"]') === focused) return;

    const piece = event.currentTarget;
    const root = piece.closest('[data-footer-root]') as HTMLElement | null;
    if (!root) return;
    const rootRect = root.getBoundingClientRect();
    const pieceRect = piece.getBoundingClientRect();
    const scale = root.offsetWidth ? rootRect.width / root.offsetWidth : 1;
    const originX = (pieceRect.left - rootRect.left) / (scale || 1);
    const originY = (pieceRect.top - rootRect.top) / (scale || 1);
    const startX = event.clientX;
    const startY = event.clientY;
    let dragging = false;
    let x = originX;
    let y = originY;

    const onMove = (moveEvent: PointerEvent) => {
      if (Math.hypot(moveEvent.clientX - startX, moveEvent.clientY - startY) < DRAG_THRESHOLD) return;
      if (!dragging) {
        dragging = true;
        if (document.activeElement instanceof HTMLElement) document.activeElement.blur();
      }
      x = originX + (moveEvent.clientX - startX) / (scale || 1);
      y = originY + (moveEvent.clientY - startY) / (scale || 1);
      movePiece(id, x, y);
    };
    const onUp = () => {
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('pointerup', onUp);
      window.removeEventListener('pointercancel', onUp);
      if (dragging) commitPiece(id, x, y);
    };
    window.addEventListener('pointermove', onMove);
    window.addEventListener('pointerup', onUp);
    window.addEventListener('pointercancel', onUp);
  };

  return (
    <div
      data-footer-piece={id}
      style={{
        display: block ? 'block' : 'inline-block',
        maxWidth: '100%',
        ...(place ? { position: 'absolute', left: place.x, top: place.y, zIndex: 6 } : null),
        cursor: isEditing ? 'grab' : undefined,
      }}
      onPointerDown={onPointerDown}
    >
      {children}
    </div>
  );
}

export function FooterLinkHit({ link, children }: { link: FooterLink; children: ReactNode }) {
  const { isEditing, openLinkTarget } = useFooterEdit();
  const { pages } = useBuilder();
  const exists = !isExternalHref(String(link.href || '')) && Boolean(findPageForHref(pages, String(link.href || ''), link.label));
  return (
    <span className="ft-hit">
      {children}
      {isEditing ? (
        <button
          type="button"
          data-footer-go=""
          className="ft-go"
          title={exists ? `Open ${link.label || 'page'}` : `Create page for ${link.label || 'this link'}`}
          aria-label={exists ? `Open ${link.label || 'page'}` : `Create page for ${link.label || 'this link'}`}
          onPointerDown={(event) => event.stopPropagation()}
          onClick={(event) => {
            event.preventDefault();
            event.stopPropagation();
            openLinkTarget(link);
          }}
        >
          <ArrowUpRight size={12} strokeWidth={2.5} />
        </button>
      ) : null}
    </span>
  );
}

export function useFooterLinkOpen() {
  return useFooterEdit().openLinkTarget;
}
