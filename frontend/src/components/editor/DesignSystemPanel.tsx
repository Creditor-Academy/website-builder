import React, { useState } from 'react';
import { useBuilder } from '@/contexts/BuilderContext';
import { Palette, Box, Layers, MousePointer2, Settings2, Trash2, Check, Sparkles, Wand2, Plus } from 'lucide-react';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

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
    const { state, updateAllPagesGlobalStyles, applyPaletteToAllPages, applyFXToAllPages } = useBuilder();
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
        <div className="h-full flex flex-col bg-white animate-in slide-in-from-left duration-300">
            <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
                <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-500 to-primary flex items-center justify-center shadow-lg shadow-indigo-200">
                        <Wand2 className="w-4 h-4 text-white" />
                    </div>
                    <div>
                        <h2 className="text-sm font-bold text-slate-900 tracking-tight">Design System</h2>
                        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-0.5">Control global aesthetics</p>
                    </div>
                </div>
            </div>

            <ScrollArea className="flex-1">
                <div className="p-5 space-y-8">
                    {/* Color Palette Section */}
                    <div className="space-y-4">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <Palette className="w-4 h-4 text-slate-400" />
                                <h3 className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">Color Palettes</h3>
                            </div>
                            <Button variant="ghost" size="icon" className="h-7 w-7 text-primary hover:bg-slate-100">
                                <Sparkles className="w-3.5 h-3.5" />
                            </Button>
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                            {COLOR_PALETTES.map((palette) => (
                                <button
                                    key={palette.name}
                                    onClick={() => applyPalette(palette)}
                                    className={`group relative p-3 rounded-2xl border transition-all duration-300 ${
                                        globalStyles.selectedPalette === palette.name 
                                        ? 'border-primary ring-2 ring-primary/10 shadow-lg' 
                                        : 'border-slate-100 hover:border-slate-200 bg-white hover:shadow-md'
                                    }`}
                                >
                                    <div className="flex items-center gap-2 mb-2">
                                        <div className="w-3 h-3 rounded-full" style={{ background: palette.primary }} />
                                        <span className="text-[10px] font-bold text-slate-600 truncate">{palette.name}</span>
                                    </div>
                                    <div className="flex h-1.5 rounded-full overflow-hidden w-full">
                                        <div className="flex-1" style={{ background: palette.primary }} />
                                        <div className="flex-1" style={{ background: palette.secondary }} />
                                        <div className="flex-1" style={{ background: palette.accent }} />
                                        <div className="flex-1" style={{ background: palette.background }} />
                                    </div>
                                    {globalStyles.selectedPalette === palette.name && (
                                        <div className="absolute top-2 right-2 w-4 h-4 bg-primary text-white rounded-full flex items-center justify-center shadow-md animate-in zoom-in duration-300">
                                            <Check className="w-2.5 h-2.5" />
                                        </div>
                                    )}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Global FX & Styling */}
                    <div className="space-y-5">
                        <div className="flex items-center gap-2">
                            <Layers className="w-4 h-4 text-slate-400" />
                            <h3 className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">Global FX Controls</h3>
                        </div>

                        <div className="space-y-4 bg-slate-50/50 p-5 rounded-3xl border border-slate-100">
                            {/* Border Radius */}
                            <div className="space-y-3">
                                <div className="flex justify-between items-center">
                                    <Label className="text-xs font-bold text-slate-700">Border Radius</Label>
                                    <span className="text-[10px] font-mono text-slate-400 bg-white px-2 py-0.5 rounded border border-slate-100">{globalStyles.borderRadius || '12px'}</span>
                                </div>
                                <div className="grid grid-cols-4 gap-2">
                                    {['0px', '8px', '20px', '9999px'].map((r) => (
                                        <button
                                            key={r}
                                            onClick={() => handleStyleUpdate({ borderRadius: r })}
                                            className={`h-11 rounded-xl border transition-all ${
                                                globalStyles.borderRadius === r 
                                                ? 'bg-primary border-primary text-white shadow-lg shadow-primary/20' 
                                                : 'bg-white border-slate-200 text-slate-400 hover:border-slate-300'
                                            } flex items-center justify-center text-[10px] font-bold`}
                                        >
                                            {r === '0px' ? 'Sharp' : r === '9999px' ? 'Full' : r}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Shadows */}
                            <div className="space-y-3">
                                <Label className="text-xs font-bold text-slate-700">Shadow Depth</Label>
                                <div className="grid grid-cols-3 gap-2">
                                    {['none', 'subtle', 'pronounced'].map((s) => (
                                        <button
                                            key={s}
                                            onClick={() => handleStyleUpdate({ shadows: s })}
                                            className={`h-10 rounded-xl border capitalize text-[10px] font-bold transition-all ${
                                                globalStyles.shadows === s 
                                                ? 'bg-primary border-primary text-white' 
                                                : 'bg-white border-slate-200 text-slate-600'
                                            }`}
                                        >
                                            {s}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Switches */}
                            <div className="space-y-4 pt-2 border-t border-slate-100 mt-2">
                                <div className="flex items-center justify-between group">
                                    <div className="space-y-0.5">
                                        <p className="text-xs font-bold text-slate-700">Glassmorphism</p>
                                        <p className="text-[9px] text-slate-400 font-medium">Add frosted glass effects</p>
                                    </div>
                                    <Switch 
                                        checked={globalStyles.glassmorphism}
                                        onCheckedChange={(val) => handleStyleUpdate({ glassmorphism: val })}
                                    />
                                </div>
                                <div className="flex items-center justify-between group">
                                    <div className="space-y-0.5">
                                        <p className="text-xs font-bold text-slate-700">Smooth Animations</p>
                                        <p className="text-[9px] text-slate-400 font-medium">Enable micro-interactions</p>
                                    </div>
                                    <Switch 
                                        checked={globalStyles.animations}
                                        onCheckedChange={(val) => handleStyleUpdate({ animations: val })}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Quick FX Presets */}
                    <div className="space-y-4">
                        <div className="flex items-center gap-2">
                            <Sparkles className="w-4 h-4 text-slate-400" />
                            <h3 className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">FX Presets</h3>
                        </div>
                        <div className="grid grid-cols-1 gap-2">
                            {FX_PRESETS.map((preset) => (
                                <button
                                    key={preset.name}
                                    onClick={() => applyFX(preset)}
                                    className="p-3 bg-white border border-slate-100 rounded-2xl hover:border-primary/20 hover:shadow-md transition-all text-left flex items-center justify-between group"
                                >
                                    <span className="text-[11px] font-bold text-slate-600">{preset.name}</span>
                                    <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <span className="text-[9px] font-bold text-primary uppercase tracking-tighter">Apply</span>
                                        <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center">
                                            <Plus className="w-3 h-3 text-primary" />
                                        </div>
                                    </div>
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            </ScrollArea>

            <div className="p-4 border-t border-slate-100 bg-white">
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
                        
                        // Also clear navbar and footer styles to adopt global theme
                        const updatedNavbar = {
                            ...page.navbar,
                            styles: {
                                ...page.navbar.styles,
                                backgroundColor: undefined,
                                textColor: undefined
                            }
                        };
                        
                        const updatedFooter = {
                            ...page.footer,
                            styles: {
                                ...page.footer.styles,
                                backgroundColor: undefined,
                                textColor: undefined
                            }
                        };

                        updateCurrentPage({
                            globalStyles: globalStyles,
                            sections: updatedSections,
                            navbar: updatedNavbar,
                            footer: updatedFooter
                        });
                    }}
                    className="w-full h-11 rounded-2xl font-bold shadow-lg shadow-indigo-500/20 bg-gradient-to-r from-indigo-600 to-indigo-500 hover:scale-[1.02] active:scale-[0.98] transition-all"
                >
                    Apply Global Styles
                </Button>
            </div>
        </div>
    );
}

