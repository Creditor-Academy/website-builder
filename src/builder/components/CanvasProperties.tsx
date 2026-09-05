import { useMemo, useState, type ReactNode } from 'react';
import { AlignCenter, AlignLeft, AlignRight, Copy, Lock, Settings2, Trash2, Unlock } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Button } from '@/components/ui/button';
import { NavbarSettings } from '@/components/editor/NavbarSettings';
import { FooterSettings } from '@/components/editor/FooterSettings';
import { PropertiesPanel } from '@/components/editor/PropertiesPanel';
import useBuilderStore from '@/store/useBuilderStore';
import { findNode } from '@/builder/tree';
import { normalizePageSections } from '@/builder/adapter';
import { resolveStyles } from '@/builder/styles';
import type { CanvasElement, CanvasStyles, DeviceId, FormField } from '@/builder/types';

function Field({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="space-y-1.5">
      <Label className="text-[11px] font-semibold text-[#0F172A]">{label}</Label>
      {children}
    </div>
  );
}

function Group({ title, children, defaultOpen = true }: { title: string; children: ReactNode; defaultOpen?: boolean }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <Collapsible open={open} onOpenChange={setOpen} className="min-w-0 px-1 pt-1 last:pb-1">
      <CollapsibleTrigger className="flex w-full items-center justify-between rounded-lg border border-[#0F172A] px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-[#0F172A] hover:bg-[#0F172A]/5">
        {title}
        <span className="text-[#0F172A]">{open ? '–' : '+'}</span>
      </CollapsibleTrigger>
      <CollapsibleContent className="space-y-3 px-3 pb-4">{children}</CollapsibleContent>
    </Collapsible>
  );
}

function StyleInput({
  styles,
  styleKey,
  onChange,
  placeholder,
}: {
  styles: CanvasStyles;
  styleKey: keyof CanvasStyles;
  onChange: (patch: Partial<CanvasStyles>) => void;
  placeholder?: string;
}) {
  return (
    <Input
      value={String(styles[styleKey] ?? '')}
      placeholder={placeholder}
      className="h-8 text-xs"
      onChange={(event) => onChange({ [styleKey]: event.target.value })}
    />
  );
}

export function CanvasProperties() {
  const page = useBuilderStore((state) => state.getActivePage());
  const editor = useBuilderStore((state) => state.editor);
  const updateCanvasNode = useBuilderStore((state) => state.updateCanvasNode);
  const updateCanvasStyles = useBuilderStore((state) => state.updateCanvasStyles);
  const deleteCanvasNode = useBuilderStore((state) => state.deleteCanvasNode);
  const duplicateCanvasNode = useBuilderStore((state) => state.duplicateCanvasNode);
  const addCanvasContainer = useBuilderStore((state) => state.addCanvasContainer);
  const updateNavbar = useBuilderStore((state) => state.updateNavbar);
  const updateFooter = useBuilderStore((state) => state.updateFooter);
  const pages = useBuilderStore((state) => state.getActiveWebsite()?.pages || []);
  const updatePageSEO = useBuilderStore((state) => state.updatePageSEO);

  const location = useMemo(() => {
    if (!page || !editor.selectedNodeId) return null;
    if (editor.selectedKind === 'navbar' || editor.selectedKind === 'footer') return null;
    return findNode(normalizePageSections(page.sections, page.id), editor.selectedNodeId);
  }, [page, editor.selectedNodeId, editor.selectedKind]);

  if (!page) return null;

  if (editor.selectedKind === 'navbar') {
    return (
      <div className="h-full overflow-y-auto bg-white text-[#0F172A]">
        <div className="border-b border-[#0F172A] px-4 py-3 text-sm font-semibold text-[#0F172A]">Header / Logo</div>
        <NavbarSettings navbar={page.navbar} pages={pages} onUpdate={updateNavbar} isExpanded />
      </div>
    );
  }

  if (editor.selectedKind === 'footer') {
    if (!page.footer) return null;
    return (
      <div className="h-full overflow-y-auto bg-white text-[#0F172A]">
        <div className="flex items-center justify-between border-b border-[#0F172A] px-4 py-3">
          <div className="text-sm font-semibold text-[#0F172A]">Footer</div>
          <button
            type="button"
            title="Remove footer"
            aria-label="Remove footer"
            className="rounded-md p-1.5 text-[#0F172A]/50 hover:bg-rose-50 hover:text-rose-600"
            onClick={() => deleteCanvasNode('footer')}
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
        <FooterSettings footer={page.footer} pages={pages} onUpdate={updateFooter} isExpanded />
      </div>
    );
  }

  if (!location) {
    return (
      <div className="h-full overflow-y-auto bg-white text-[#0F172A]">
        <div className="flex items-center gap-2 border-b border-[#0F172A] px-4 py-3">
          <Settings2 className="h-4 w-4 text-[#0F172A]" />
          <div>
            <p className="text-sm font-semibold text-[#0F172A]">Page</p>
            <p className="text-[11px] text-[#0F172A]/60">{page.name}</p>
          </div>
        </div>
        <div className="space-y-3 p-4">
          <Field label="Page title">
            <Input value={page.meta?.title || ''} onChange={(event) => updatePageSEO(page.id, { title: event.target.value })} />
          </Field>
          <Field label="Meta description">
            <Textarea value={page.meta?.description || ''} onChange={(event) => updatePageSEO(page.id, { description: event.target.value })} />
          </Field>
        </div>
      </div>
    );
  }

  const node = location.node;
  const device = editor.device as DeviceId;
  const styles = resolveStyles(node.styles, node.responsiveStyles, device);
  const isPrebuilt = location.kind === 'section' && location.section?.kind === 'prebuilt';
  const element = location.kind === 'element' ? (node as CanvasElement) : null;

  const patchStyle = (patch: Partial<CanvasStyles>) => updateCanvasStyles(node.id, patch);
  const patchContent = (patch: Record<string, unknown>) => updateCanvasNode(node.id, { content: { ...node.content, ...patch } });

  return (
    <div className="flex h-full flex-col bg-white text-[#0F172A]">
      <div className="flex items-start justify-between gap-2 border-b border-[#0F172A] px-4 py-3">
        <div>
          <p className="text-sm font-semibold text-[#0F172A]">{node.name}</p>
          <p className="text-[11px] uppercase tracking-wide text-[#0F172A]/55">{location.kind}</p>
        </div>
        <div className="flex gap-1">
          <Button
            size="icon"
            variant="ghost"
            className="h-8 w-8 text-[#0F172A] hover:bg-[#0F172A]/5 hover:text-[#0F172A]"
            aria-label={node.locked ? 'Unlock' : 'Lock'}
            title={node.locked ? 'Unlock' : 'Lock'}
            onClick={() => updateCanvasNode(node.id, { locked: !node.locked })}
          >
            {node.locked ? <Unlock className="h-4 w-4" /> : <Lock className="h-4 w-4" />}
          </Button>
          <Button size="icon" variant="ghost" className="h-8 w-8 text-[#0F172A] hover:bg-[#0F172A]/5 hover:text-[#0F172A]" aria-label="Duplicate" title="Duplicate" disabled={node.locked} onClick={() => duplicateCanvasNode(node.id)}>
            <Copy className="h-4 w-4" />
          </Button>
          <Button size="icon" variant="ghost" className="h-8 w-8 text-rose-500" aria-label="Delete" title="Delete" disabled={node.locked} onClick={() => deleteCanvasNode(node.id)}>
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="min-w-0 flex-1 overflow-x-hidden overflow-y-auto">
        <Group title="Identity">
          <Field label="Name">
            <Input value={node.name} className="h-8 text-xs" disabled={node.locked} onChange={(event) => updateCanvasNode(node.id, { name: event.target.value })} />
          </Field>
          {location.kind === 'section' && (
            <Button type="button" variant="outline" className="h-8 w-full text-xs" disabled={node.locked} onClick={() => addCanvasContainer()}>
              Add Container
            </Button>
          )}
        </Group>

        {element?.type === 'text' && (
          <Group title="Content">
            <Field label="Text">
              <Textarea value={String(element.content.text || '')} disabled={node.locked} onChange={(event) => patchContent({ text: event.target.value })} />
            </Field>
            <Field label="Tag">
              <Select value={String(element.content.tag || 'p')} onValueChange={(value) => patchContent({ tag: value })} disabled={node.locked}>
                <SelectTrigger className="h-8 text-xs"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="h1">Heading 1</SelectItem>
                  <SelectItem value="h2">Heading 2</SelectItem>
                  <SelectItem value="h3">Heading 3</SelectItem>
                  <SelectItem value="p">Paragraph</SelectItem>
                  <SelectItem value="span">Span</SelectItem>
                </SelectContent>
              </Select>
            </Field>
          </Group>
        )}
        {element?.type === 'image' && (
          <Group title="Content">
            <Field label="Image URL">
              <Input value={String(element.content.src || '')} onChange={(event) => patchContent({ src: event.target.value })} />
            </Field>
            <Field label="Alt text">
              <Input value={String(element.content.alt || '')} disabled={node.locked} onChange={(event) => patchContent({ alt: event.target.value })} />
            </Field>
            <Field label="Object fit">
              <Select value={String(styles.objectFit || 'cover')} onValueChange={(value) => patchStyle({ objectFit: value })} disabled={node.locked}>
                <SelectTrigger className="h-8 text-xs"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="cover">Cover</SelectItem>
                  <SelectItem value="contain">Contain</SelectItem>
                  <SelectItem value="fill">Fill</SelectItem>
                </SelectContent>
              </Select>
            </Field>
          </Group>
        )}
        {element?.type === 'button' && (
          <Group title="Content">
            <Field label="Label">
              <Input value={String(element.content.label || '')} onChange={(event) => patchContent({ label: event.target.value })} />
            </Field>
            <Field label="Link">
              <Input value={String(element.content.href || '')} disabled={node.locked} onChange={(event) => patchContent({ href: event.target.value })} />
            </Field>
            <Field label="Target">
              <Select value={String(element.content.target || '_self')} onValueChange={(value) => patchContent({ target: value })} disabled={node.locked}>
                <SelectTrigger className="h-8 text-xs"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="_self">Same tab</SelectItem>
                  <SelectItem value="_blank">New tab</SelectItem>
                </SelectContent>
              </Select>
            </Field>
          </Group>
        )}
        {element?.type === 'icon' && (
          <Group title="Content">
            <Field label="Icon name">
              <Input value={String(element.content.icon || 'Sparkles')} disabled={node.locked} onChange={(event) => patchContent({ icon: event.target.value })} />
            </Field>
            <Field label="Size">
              <Input type="number" value={Number(element.content.size || 28)} disabled={node.locked} onChange={(event) => patchContent({ size: Number(event.target.value) })} className="h-8 text-xs" />
            </Field>
          </Group>
        )}
        {element?.type === 'video' && (
          <Group title="Content">
            <Field label="Video URL">
              <Input value={String(element.content.url || '')} disabled={node.locked} onChange={(event) => patchContent({ url: event.target.value })} />
            </Field>
            <Field label="Provider">
              <Select value={String(element.content.provider || 'youtube')} onValueChange={(value) => patchContent({ provider: value })} disabled={node.locked}>
                <SelectTrigger className="h-8 text-xs"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="youtube">YouTube</SelectItem>
                  <SelectItem value="file">File</SelectItem>
                </SelectContent>
              </Select>
            </Field>
          </Group>
        )}
        {element?.type === 'pdf' && (
          <Group title="Content">
            <Field label="Title">
              <Input value={String(element.content.title || '')} onChange={(event) => patchContent({ title: event.target.value })} />
            </Field>
            <Field label="PDF URL">
              <Input value={String(element.content.url || '')} disabled={node.locked} onChange={(event) => patchContent({ url: event.target.value })} />
            </Field>
            <Field label="Description">
              <Input value={String(element.content.description || '')} disabled={node.locked} onChange={(event) => patchContent({ description: event.target.value })} />
            </Field>
          </Group>
        )}
        {element?.type === 'form' && (
          <Group title="Form fields">
            <Field label="Title">
              <Input value={String(element.content.title || '')} disabled={node.locked} onChange={(event) => patchContent({ title: event.target.value })} />
            </Field>
            <Field label="Submit label">
              <Input value={String(element.content.submitLabel || '')} disabled={node.locked} onChange={(event) => patchContent({ submitLabel: event.target.value })} />
            </Field>
            {((element.content.fields as FormField[]) || []).map((field, fieldIndex) => (
              <div key={field.id} className="space-y-2 rounded-lg border border-[#0F172A] p-2">
                <Input
                  value={field.label}
                  disabled={node.locked}
                  className="h-8 text-xs"
                  onChange={(event) => {
                    const fields = [...((element.content.fields as FormField[]) || [])];
                    fields[fieldIndex] = { ...field, label: event.target.value };
                    patchContent({ fields });
                  }}
                />
                <div className="flex items-center justify-between">
                  <span className="text-[11px] text-[#0F172A]/60">{field.type}</span>
                  <label className="flex items-center gap-2 text-[11px] text-[#0F172A]">
                    Required
                    <Switch
                      checked={Boolean(field.required)}
                      disabled={node.locked}
                      onCheckedChange={(checked) => {
                        const fields = [...((element.content.fields as FormField[]) || [])];
                        fields[fieldIndex] = { ...field, required: checked };
                        patchContent({ fields });
                      }}
                    />
                  </label>
                </div>
              </div>
            ))}
          </Group>
        )}

        <Group title="Layout">
          <div className="grid grid-cols-2 gap-2">
            <Field label="Width"><StyleInput styles={styles} styleKey="width" onChange={patchStyle} placeholder="100%" /></Field>
            <Field label="Height"><StyleInput styles={styles} styleKey="height" onChange={patchStyle} placeholder="auto" /></Field>
            <Field label="Max width"><StyleInput styles={styles} styleKey="maxWidth" onChange={patchStyle} placeholder="1120px" /></Field>
            <Field label="Min height"><StyleInput styles={styles} styleKey="minHeight" onChange={patchStyle} /></Field>
          </div>
          <Field label="Direction">
            <Select value={String(styles.flexDirection || 'column')} onValueChange={(value) => patchStyle({ display: 'flex', flexDirection: value })}>
              <SelectTrigger className="h-8 text-xs"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="column">Vertical</SelectItem>
                <SelectItem value="row">Horizontal</SelectItem>
              </SelectContent>
            </Select>
          </Field>
          <Field label="Gap"><StyleInput styles={styles} styleKey="gap" onChange={patchStyle} placeholder="16px" /></Field>
          <Field label="Justify">
            <Select value={String(styles.justifyContent || 'flex-start')} onValueChange={(value) => patchStyle({ display: 'flex', justifyContent: value })}>
              <SelectTrigger className="h-8 text-xs"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="flex-start">Start</SelectItem>
                <SelectItem value="center">Center</SelectItem>
                <SelectItem value="flex-end">End</SelectItem>
                <SelectItem value="space-between">Space between</SelectItem>
              </SelectContent>
            </Select>
          </Field>
          <Field label="Alignment">
            <div className="flex gap-1">
              {[
                ['flex-start', AlignLeft],
                ['center', AlignCenter],
                ['flex-end', AlignRight],
              ].map(([value, Icon]) => (
                <button
                  key={value as string}
                  type="button"
                  onClick={() => patchStyle({ alignItems: value as string })}
                  className={`rounded-md border p-1.5 text-[#0F172A] ${styles.alignItems === value ? 'border-[#0F172A]' : 'border-[#0F172A]/25'}`}
                >
                  <Icon className="h-4 w-4" />
                </button>
              ))}
            </div>
          </Field>
        </Group>

        <Group title="Spacing">
          <Field label="Padding"><StyleInput styles={styles} styleKey="padding" onChange={patchStyle} placeholder="24px" /></Field>
          <Field label="Margin"><StyleInput styles={styles} styleKey="margin" onChange={patchStyle} placeholder="0px" /></Field>
        </Group>

        <Group title="Typography">
          <Field label="Font">
            <Select value={String(styles.fontFamily || 'Inter')} onValueChange={(value) => patchStyle({ fontFamily: value })}>
              <SelectTrigger className="h-8 text-xs"><SelectValue /></SelectTrigger>
              <SelectContent>
                {['Inter', 'Poppins', 'Playfair Display', 'Montserrat', 'Georgia'].map((font) => (
                  <SelectItem key={font} value={font}>{font}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </Field>
          <div className="grid grid-cols-2 gap-2">
            <Field label="Size"><StyleInput styles={styles} styleKey="fontSize" onChange={patchStyle} placeholder="16px" /></Field>
            <Field label="Weight"><StyleInput styles={styles} styleKey="fontWeight" onChange={patchStyle} placeholder="400" /></Field>
            <Field label="Line height"><StyleInput styles={styles} styleKey="lineHeight" onChange={patchStyle} placeholder="1.5" /></Field>
            <Field label="Letter spacing"><StyleInput styles={styles} styleKey="letterSpacing" onChange={patchStyle} placeholder="0px" /></Field>
          </div>
          <Field label="Text align">
            <Select value={String(styles.textAlign || 'left')} onValueChange={(value) => patchStyle({ textAlign: value })}>
              <SelectTrigger className="h-8 text-xs"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="left">Left</SelectItem>
                <SelectItem value="center">Center</SelectItem>
                <SelectItem value="right">Right</SelectItem>
              </SelectContent>
            </Select>
          </Field>
        </Group>

        <Group title="Colors">
          <Field label="Text color">
            <Input type="color" value={String(styles.color || '#0f172a')} onChange={(event) => patchStyle({ color: event.target.value })} className="h-8 w-full p-1" />
          </Field>
          <Field label="Background">
            <Input type="color" value={String(styles.backgroundColor || '#ffffff')} onChange={(event) => patchStyle({ backgroundColor: event.target.value })} className="h-8 w-full p-1" />
          </Field>
          <Field label="Background image">
            <Input value={String(styles.backgroundImage || '')} placeholder="https://..." onChange={(event) => patchStyle({ backgroundImage: event.target.value })} />
          </Field>
          <Field label="Gradient">
            <Input value={String(styles.backgroundGradient || '')} placeholder="linear-gradient(...)" onChange={(event) => patchStyle({ backgroundGradient: event.target.value })} />
          </Field>
          <Field label="Opacity">
            <Input
              type="number"
              min={0}
              max={1}
              step={0.05}
              value={styles.opacity ?? 1}
              onChange={(event) => patchStyle({ opacity: Number(event.target.value) })}
            />
          </Field>
        </Group>

        <Group title="Border">
          <div className="grid grid-cols-2 gap-2">
            <Field label="Width"><StyleInput styles={styles} styleKey="borderWidth" onChange={patchStyle} placeholder="1px" /></Field>
            <Field label="Radius"><StyleInput styles={styles} styleKey="borderRadius" onChange={patchStyle} placeholder="8px" /></Field>
          </div>
          <Field label="Style">
            <Select value={String(styles.borderStyle || 'none')} onValueChange={(value) => patchStyle({ borderStyle: value })}>
              <SelectTrigger className="h-8 text-xs"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="none">None</SelectItem>
                <SelectItem value="solid">Solid</SelectItem>
                <SelectItem value="dashed">Dashed</SelectItem>
              </SelectContent>
            </Select>
          </Field>
          <Field label="Color">
            <Input type="color" value={String(styles.borderColor || '#e2e8f0')} onChange={(event) => patchStyle({ borderColor: event.target.value })} className="h-8 w-full p-1" />
          </Field>
        </Group>

        <Group title="Shadow">
          <Field label="Box shadow">
            <Input value={String(styles.boxShadow || '')} placeholder="0 8px 24px rgba(0,0,0,.12)" onChange={(event) => patchStyle({ boxShadow: event.target.value })} />
          </Field>
        </Group>

        <Group title="Visibility">
          {(['desktop', 'tablet', 'mobile'] as DeviceId[]).map((item) => (
            <div key={item} className="flex items-center justify-between">
              <span className="text-xs capitalize text-[#0F172A]">{item}</span>
              <Switch
                checked={node.visibility?.[item] !== false}
                onCheckedChange={(checked) => updateCanvasNode(node.id, { visibility: { ...node.visibility, [item]: checked } })}
              />
            </div>
          ))}
        </Group>

        <Group title="Animation" defaultOpen={false}>
          <Field label="Entrance">
            <Input value={String(node.animation?.entrance || '')} placeholder="fade-in" onChange={(event) => updateCanvasNode(node.id, { animation: { ...node.animation, entrance: event.target.value } })} />
          </Field>
          <Field label="Hover">
            <Input value={String(node.animation?.hover || '')} placeholder="lift" onChange={(event) => updateCanvasNode(node.id, { animation: { ...node.animation, hover: event.target.value } })} />
          </Field>
          <Field label="Duration (ms)">
            <Input type="number" value={node.animation?.duration || 300} onChange={(event) => updateCanvasNode(node.id, { animation: { ...node.animation, duration: Number(event.target.value) } })} />
          </Field>
        </Group>

        {isPrebuilt && (
          <div className="border-t border-[#0F172A]">
            <div className="px-4 py-3 text-xs font-semibold uppercase tracking-wide text-[#0F172A]">Section content</div>
            <PropertiesPanel />
          </div>
        )}
      </div>
    </div>
  );
}
