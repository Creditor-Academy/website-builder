import React from 'react';
import { useBuilder } from '@/contexts/BuilderContext';
import { Undo2, Redo2, Eye, Download, Play, Layout, Sidebar, Sun, Moon, Monitor, Tablet, Smartphone, Share2, CheckCircle2, ChevronRight, Globe } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Tooltip, TooltipContent, TooltipTrigger, TooltipProvider } from "@/components/ui/tooltip";

export function EditorToolbar({ theme = 'light', onToggleTheme }) {
  const { state, undo, redo, canUndo, canRedo, setPreviewMode, setLeftPanelVisible, setRightPanelVisible } = useBuilder();
  const { editor, page } = state;

  const handleExport = () => {
    if (!page) return;
    const json = JSON.stringify(page, null, 2);
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${page?.slug === '/' ? 'home' : page?.slug}-page.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="h-14 px-4 border-b border-border bg-white/80 backdrop-blur-md sticky top-0 z-50 flex items-center justify-between">
      <TooltipProvider delayDuration={0}>
        {/* LEFT */}
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl bg-slate-900 flex items-center justify-center shadow-lg shadow-black/10 transition-transform hover:scale-105">
              <span className="text-white font-black text-sm tracking-tighter">B</span>
            </div>
            <div className="hidden sm:flex flex-col">
              <span className="font-black text-[13px] text-slate-900 leading-none tracking-tight">Buildora</span>
              <div className="flex items-center gap-1 mt-1">
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-[9px] text-slate-400 font-bold uppercase tracking-widest">Editing</span>
              </div>
            </div>
          </div>

          <Separator orientation="vertical" className="h-6" />

          <div className="hidden md:flex items-center gap-2 bg-slate-50 px-3 py-1.5 rounded-xl border border-slate-100">
            <Globe className="w-3 h-3 text-slate-400" />
            <span className="text-[11px] font-bold text-slate-400">{state.activeWebsite?.name || 'Project'}</span>
            <ChevronRight className="w-3 h-3 text-slate-300" />
            <span className="text-[11px] font-black text-slate-900">{page?.name || 'Page'}</span>
          </div>

          <div className="hidden lg:flex items-center gap-1.5 ml-2">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
            <span className="text-[10px] text-slate-400 font-bold">Saved</span>
          </div>
        </div>

        {/* CENTER - Removed Viewport Switcher as requested */}

        {/* RIGHT */}
        <div className="flex items-center gap-2">
          {/* PANEL TOGGLES */}
          <div className="flex items-center gap-1 mr-2 px-1 py-1 bg-slate-50 rounded-xl border border-slate-100/50">
            <TooltipProvider delayDuration={0}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setLeftPanelVisible(!editor.showLeftPanel)}
                    className={`w-8 h-8 rounded-lg ${editor.showLeftPanel ? 'bg-white shadow-sm text-primary' : 'text-slate-400'}`}
                  >
                    <Sidebar className="w-3.5 h-3.5" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="bottom">Toggle Left Panel</TooltipContent>
              </Tooltip>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setRightPanelVisible(!editor.showRightPanel)}
                    className={`w-8 h-8 rounded-lg ${editor.showRightPanel ? 'bg-white shadow-sm text-primary' : 'text-slate-400'}`}
                  >
                    <Sidebar className="w-3.5 h-3.5 rotate-180" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="bottom">Toggle Right Panel</TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
          {/* UNDO / REDO */}
          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="icon"
              onClick={undo}
              disabled={!canUndo}
              className="w-8 h-8 rounded-lg"
            >
              <Undo2 className="w-3.5 h-3.5" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={redo}
              disabled={!canRedo}
              className="w-8 h-8 rounded-lg"
            >
              <Redo2 className="w-3.5 h-3.5" />
            </Button>
          </div>

          <Separator orientation="vertical" className="h-4 mx-1" />

          {/* PREVIEW */}
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setPreviewMode(!editor.previewMode)}
                className={`w-8 h-8 rounded-lg ${editor.previewMode ? 'bg-primary/10 text-primary' : 'text-slate-500'}`}
              >
                <Eye className="w-3.5 h-3.5" />
              </Button>
            </TooltipTrigger>
            <TooltipContent side="bottom">Preview Mode</TooltipContent>
          </Tooltip>

          {/* EXPORT */}
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                onClick={handleExport}
                className="w-8 h-8 rounded-lg text-slate-500"
              >
                <Download className="w-3.5 h-3.5" />
              </Button>
            </TooltipTrigger>
            <TooltipContent side="bottom">Export JSON</TooltipContent>
          </Tooltip>

          <Separator orientation="vertical" className="h-4 mx-1" />

          {/* SHARE */}
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="w-8 h-8 rounded-lg text-slate-500 hover:text-primary hover:bg-primary/5"
              >
                <Share2 className="w-3.5 h-3.5" />
              </Button>
            </TooltipTrigger>
            <TooltipContent side="bottom">Share Project</TooltipContent>
          </Tooltip>

          {/* PUBLISH */}
          <Button className="h-9 gap-2 bg-primary hover:bg-primary/90 text-white rounded-xl px-5 text-xs font-bold shadow-lg shadow-primary/25 transition-all active:scale-95">
            <Play className="w-3.5 h-3.5 fill-current" />
            <span className="hidden sm:inline">Publish Site</span>
          </Button>
        </div>
      </TooltipProvider>
    </div>
  );
}
