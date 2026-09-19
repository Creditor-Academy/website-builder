import React from 'react';
import { useBuilder } from '@/contexts/BuilderContext';
import { Palette, Check, Sparkles } from 'lucide-react';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Switch } from '@/components/ui/switch';

const COLOR_PALETTES = [
    {
        name: 'Modern Blue',
        primary: '#3b82f6',
        secondary: '#8b5cf6',
        accent: '#06b6d4',
        background: '#ffffff',
        text: '#0f172a',
        alternate: '#f8fafc',
        alternateText: '#0f172a'
    },
    {
        name: 'Ocean Teal',
        primary: '#0d9488',
        secondary: '#0ea5e9',
        accent: '#f59e0b',
        background: '#f0fdfa',
        text: '#134e4a',
        alternate: '#134e4a',
        alternateText: '#ffffff'
    },
    {
        name: 'Midnight Deep',
        primary: '#22d3ee',
        secondary: '#a855f7',
        accent: '#f472b6',
        background: '#020617',
        text: '#f8fafc',
        alternate: '#f8fafc',
        alternateText: '#020617'
    },
    {
        name: 'Sunrise Rose',
        primary: '#e11d48',
        secondary: '#fb923c',
        accent: '#fcd34d',
        background: '#fff1f2',
        text: '#4c0519',
        alternate: '#4c0519',
        alternateText: '#ffffff'
    },
    {
        name: 'Nature Green',
        primary: '#16a34a',
        secondary: '#ca8a04',
        accent: '#ea580c',
        background: '#f0fdf4',
        text: '#052e16',
        alternate: '#052e16',
        alternateText: '#ffffff'
    },
    {
        name: 'Elegant Gray',
        primary: '#18181b',
        secondary: '#71717a',
        accent: '#a1a1aa',
        background: '#ffffff',
        text: '#09090b',
        alternate: '#f4f4f5',
        alternateText: '#09090b'
    }
];

const FX_PRESETS = [
    { name: 'Soft & Clean', radius: '12px', shadow: 'subtle', animation: 'fade' },
    { name: 'Sharp & Industrial', radius: '0px', shadow: 'none', animation: 'slide' },
    { name: 'Glassmorphism', radius: '20px', shadow: 'pronounced', glass: true, animation: 'zoom' },
    { name: 'Playful Round', radius: '32px', shadow: 'subtle', animation: 'bounce' }
];

export function DesignSystemPanel() {
    const { state, updateAllPagesGlobalStyles, applyPaletteToAllPages, applyFXToAllPages, updateCurrentPage } = useBuilder();
    const { page } = state;
    const DEFAULTS = {
        primaryColor: '#3b82f6',
        secondaryColor: '#8b5cf6',
        accentColor: '#f59e0b',
        backgroundColor: '#ffffff',
        textColor: '#0f172a',
        borderRadius: '12px',
        glassmorphism: false,
        animations: true,
        shadows: 'subtle'
    };

    const globalStyles = { ...DEFAULTS, ...(page?.globalStyles || {}) };

    const handleStyleUpdate = (updates: any) => {
        updateAllPagesGlobalStyles({ ...globalStyles, ...updates });
    };

    const applyPalette = (palette: any) => {
        applyPaletteToAllPages(palette);
    };

    const applyFX = (fx: any) => {
        applyFXToAllPages(fx);
    };

    return (
        <div className="h-full flex flex-col bg-white">
            <div className="h-12 px-4 border-b border-slate-100 flex items-center justify-between shrink-0">
                <h2 className="text-sm font-semibold text-slate-900">Design System</h2>
            </div>

            <ScrollArea className="flex-1">
                <div className="p-3 space-y-6">
                    <div>
                        <h3 className="px-2 pb-1.5 text-[11px] font-semibold text-slate-800 uppercase tracking-wider">
                            <span className="border-b-2 border-[#0F172A] pb-0.5">Color Palettes</span>
                        </h3>
                        <div className="grid grid-cols-2 gap-2">
                            {COLOR_PALETTES.map((palette) => {
                                const isSelected = globalStyles.selectedPalette === palette.name;
                                return (
                                    <button
                                        key={palette.name}
                                        type="button"
                                        onClick={() => applyPalette(palette)}
                                        className={`relative flex flex-col gap-1.5 p-2.5 rounded-lg border bg-white text-left transition-shadow ${
                                            isSelected
                                                ? 'border-[#0F172A] shadow-[0_6px_14px_-4px_rgba(15,23,42,0.22)]'
                                                : 'border-slate-100 shadow-[0_6px_14px_-4px_rgba(15,23,42,0.12)] hover:shadow-[0_8px_18px_-4px_rgba(15,23,42,0.22)]'
                                        }`}
                                    >
                                        <div className="flex items-center gap-2 min-w-0">
                                            <div className="w-6 h-6 rounded-md bg-[#0F172A] text-white flex items-center justify-center shrink-0">
                                                <Palette className="w-3 h-3" strokeWidth={1.75} />
                                            </div>
                                            <p className="text-xs font-medium text-slate-800 truncate">{palette.name}</p>
                                        </div>
                                        <div className="flex h-1.5 rounded overflow-hidden w-full">
                                            <div className="flex-1" style={{ background: palette.primary }} />
                                            <div className="flex-1" style={{ background: palette.secondary }} />
                                            <div className="flex-1" style={{ background: palette.accent }} />
                                            <div className="flex-1" style={{ background: palette.background }} />
                                        </div>
                                        {isSelected && (
                                            <div className="absolute top-2 right-2 w-4 h-4 bg-[#0F172A] text-white rounded-md flex items-center justify-center">
                                                <Check className="w-2.5 h-2.5" />
                                            </div>
                                        )}
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    <div>
                        <h3 className="px-2 pb-1.5 text-[11px] font-semibold text-slate-800 uppercase tracking-wider">
                            <span className="border-b-2 border-[#0F172A] pb-0.5">Global FX Controls</span>
                        </h3>
                        <div className="space-y-4 p-3 rounded-lg border border-slate-100 bg-white shadow-[0_6px_14px_-4px_rgba(15,23,42,0.12)]">
                            <div className="space-y-2">
                                <div className="flex justify-between items-center">
                                    <Label className="text-xs font-medium text-slate-800">Border Radius</Label>
                                    <span className="text-[10px] font-mono text-slate-400 bg-slate-100 px-1.5 py-0.5 rounded">{globalStyles.borderRadius || '12px'}</span>
                                </div>
                                <div className="grid grid-cols-4 gap-1.5">
                                    {['0px', '8px', '20px', '9999px'].map((r) => (
                                        <button
                                            key={r}
                                            type="button"
                                            onClick={() => handleStyleUpdate({ borderRadius: r })}
                                            className={`h-9 rounded-md border text-[10px] font-medium ${
                                                globalStyles.borderRadius === r
                                                    ? 'bg-[#0F172A] border-[#0F172A] text-white'
                                                    : 'bg-white border-slate-200 text-slate-500 hover:border-slate-300'
                                            }`}
                                        >
                                            {r === '0px' ? 'Sharp' : r === '9999px' ? 'Full' : r}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label className="text-xs font-medium text-slate-800">Shadow Depth</Label>
                                <div className="grid grid-cols-3 gap-1.5">
                                    {['none', 'subtle', 'pronounced'].map((s) => (
                                        <button
                                            key={s}
                                            type="button"
                                            onClick={() => handleStyleUpdate({ shadows: s })}
                                            className={`h-9 rounded-md border capitalize text-[10px] font-medium ${
                                                globalStyles.shadows === s
                                                    ? 'bg-[#0F172A] border-[#0F172A] text-white'
                                                    : 'bg-white border-slate-200 text-slate-500 hover:border-slate-300'
                                            }`}
                                        >
                                            {s}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div className="space-y-3 pt-2 border-t border-slate-100">
                                <div className="flex items-center justify-between">
                                    <div className="min-w-0 pr-3">
                                        <p className="text-xs font-medium text-slate-800">Glassmorphism</p>
                                        <p className="text-[10px] text-slate-400">Add frosted glass effects</p>
                                    </div>
                                    <Switch
                                        checked={globalStyles.glassmorphism}
                                        onCheckedChange={(val) => handleStyleUpdate({ glassmorphism: val })}
                                        className="data-[state=checked]:bg-[#0F172A]"
                                    />
                                </div>
                                <div className="flex items-center justify-between">
                                    <div className="min-w-0 pr-3">
                                        <p className="text-xs font-medium text-slate-800">Smooth Animations</p>
                                        <p className="text-[10px] text-slate-400">Enable micro-interactions</p>
                                    </div>
                                    <Switch
                                        checked={globalStyles.animations}
                                        onCheckedChange={(val) => handleStyleUpdate({ animations: val })}
                                        className="data-[state=checked]:bg-[#0F172A]"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    <div>
                        <h3 className="px-2 pb-1.5 text-[11px] font-semibold text-slate-800 uppercase tracking-wider">
                            <span className="border-b-2 border-[#0F172A] pb-0.5">FX Presets</span>
                        </h3>
                        <div className="space-y-1.5">
                            {FX_PRESETS.map((preset) => (
                                <button
                                    key={preset.name}
                                    type="button"
                                    onClick={() => applyFX(preset)}
                                    className="w-full p-2.5 bg-white border border-slate-100 rounded-lg text-left flex items-center justify-between group shadow-[0_6px_14px_-4px_rgba(15,23,42,0.12)] hover:shadow-[0_8px_18px_-4px_rgba(15,23,42,0.22)] transition-shadow"
                                >
                                    <div className="flex items-center gap-2 min-w-0">
                                        <div className="w-6 h-6 rounded-md bg-[#0F172A] text-white flex items-center justify-center shrink-0">
                                            <Sparkles className="w-3 h-3" strokeWidth={1.75} />
                                        </div>
                                        <span className="text-xs font-medium text-slate-800 truncate">{preset.name}</span>
                                    </div>
                                    <span className="text-[10px] font-medium text-slate-400 opacity-0 group-hover:opacity-100">Apply</span>
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            </ScrollArea>

            <div className="px-3 py-3 border-t border-slate-100">
                <Button
                    onClick={() => {
                        const updatedSections = page.sections.map((s: any) => ({
                            ...s,
                            styles: {
                                ...s.styles,
                                backgroundColor: undefined,
                                backgroundGradient: undefined,
                                headingColor: undefined,
                                paragraphColor: undefined,
                                buttonPrimaryBg: undefined,
                                buttonPrimaryText: undefined,
                                buttonSecondaryBg: undefined,
                                buttonSecondaryText: undefined,
                                useGradient: false,
                                borderRadius: undefined,
                                shadows: undefined
                            }
                        }));

                        const updatedNavbar = {
                            ...page.navbar,
                            styles: {
                                ...page.navbar.styles,
                                backgroundColor: undefined,
                                textColor: undefined
                            }
                        };

                        const updatedFooter = page.footer
                            ? {
                                ...page.footer,
                                styles: {
                                    ...page.footer.styles,
                                    backgroundColor: undefined,
                                    textColor: undefined
                                }
                            }
                            : page.footer;

                        updateCurrentPage({
                            globalStyles: globalStyles,
                            sections: updatedSections,
                            navbar: updatedNavbar,
                            footer: updatedFooter
                        });
                    }}
                    className="w-full h-10 rounded-lg font-medium bg-[#0F172A] text-white hover:bg-[#0F172A]"
                >
                    Apply Global Styles
                </Button>
            </div>
        </div>
    );
}

