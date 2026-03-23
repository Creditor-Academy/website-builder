import React, { useState } from 'react';
import { useBuilder } from '@/contexts/BuilderContext';
import useBuilderStore from '@/store/useBuilderStore';
import { Undo2, Redo2, Eye, Download, Play, Share2, ChevronRight, Globe, Home, HelpCircle, Palette } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Tooltip, TooltipContent, TooltipTrigger, TooltipProvider } from "@/components/ui/tooltip";

export function EditorToolbar({ theme = 'light', onToggleTheme = () => {}, websiteId = '', onTabChange = (tab: string) => {} }: any) {
  const [showPublishDialog, setShowPublishDialog] = useState(false);
  const { state, undo, redo, canUndo, canRedo, setPreviewMode, setLeftPanelVisible } = useBuilder();
  const { editor, page } = state;
  const store = useBuilderStore();
  const { setTourState } = store;

  const startTour = () => {
    setTourState({ isActive: true, step: 0, isFinished: false });
  };

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

  const handleDesignTab = () => {
    if (onTabChange) {
      onTabChange('design');
      setLeftPanelVisible(true);
    }
  };

  return (
    <div className="h-16 px-6 border-b border-slate-200 bg-white sticky top-0 z-50 flex items-center justify-between shadow-sm">
      <TooltipProvider delayDuration={0}>
        {/* LEFT */}
        <div className="flex items-center gap-6">
        
          <div id="tour-logo" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-slate-900 to-slate-700 flex items-center justify-center shadow-lg shadow-black/20 transition-all duration-300  group-hover:shadow-xl">
              <span className="text-white font-black text-sm tracking-tighter">B</span>
            </div>
            <div className="hidden sm:flex flex-col">
              <span className="font-black text-[14px] text-slate-900 leading-none tracking-tight">Buildora</span>
              <div className="flex items-center gap-2 mt-1">
                <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shadow-sm shadow-emerald-500/50" />
                <span className="text-[10px] text-slate-600 font-bold uppercase tracking-widest">Editing Mode</span>
              </div>
            </div>
          </div>

          <Separator orientation="vertical" className="h-8" />
  {/* Dashboard Button */}
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => window.location.href = '/dashboard'}
                className="w-9 h-9 rounded-lg text-slate-600 hover:bg-slate-100 hover:text-slate-800 transition-all duration-200 border border-transparent hover:border-slate-200"
              >
                <Home className="w-4.5 h-4.5" />
              </Button>
            </TooltipTrigger>
            <TooltipContent side="bottom" className="bg-slate-800 text-white border-slate-700">
              <div className="text-xs font-medium">Dashboard</div>
              <div className="text-xs opacity-70">Go to dashboard</div>
            </TooltipContent>
          </Tooltip>


          <div className="hidden md:flex items-center gap-3 bg-slate-50 px-4 py-2 rounded-xl border border-slate-200 hover:border-primary/50 transition-all duration-200">
            <Globe className="w-4 h-4 text-slate-600" />
            <span className="text-[11px] font-bold text-slate-700">{websiteId || store.activeWebsiteId || 'Project'}</span>
            <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
            <span className="text-[11px] font-black text-slate-900">{page?.name || 'Page'}</span>
          </div>

          <div className="hidden lg:flex items-center gap-2 ml-2">
            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-[10px] text-slate-600 font-medium">Auto-saved</span>
          </div>
        </div>

        {/* RIGHT */}
        <div className="flex items-center gap-3">
          {/* UNDO / REDO */}
          <div className="flex items-center gap-1 bg-slate-100 rounded-lg p-1">
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={undo}
                  disabled={!canUndo}
                  className="w-8 h-8 rounded-md hover:bg-white hover:text-blue-500 hover:shadow-sm transition-all duration-200"
                >
                  <Undo2 className="w-4 h-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent side="bottom">Undo</TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={redo}
                  disabled={!canRedo}
                  className="w-8 h-8 rounded-md hover:bg-white hover:text-blue-500 hover:shadow-sm transition-all duration-200"
                >
                  <Redo2 className="w-4 h-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent side="bottom">Redo</TooltipContent>
            </Tooltip>
          </div>

          <Separator orientation="vertical" className="h-6 mx-2" />

          {/* PREVIEW */}
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setPreviewMode(!editor.previewMode)}
                className={`w-9 h-9 rounded-lg transition-all duration-200 ${editor.previewMode ? 'bg-primary/10 text-primary shadow-md shadow-primary/20' : 'text-slate-600 hover:bg-slate-100 hover:text-slate-800'}`}
              >
                <Eye className="w-4 h-4" />
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
                className="w-9 h-9 rounded-lg text-slate-600 hover:bg-slate-100 hover:text-slate-800 transition-all duration-200"
              >
                <Download className="w-4 h-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent side="bottom">Export JSON</TooltipContent>
          </Tooltip>

          {/* PALETTE */}
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                id="tour-palette"
                onClick={handleDesignTab}
                className="w-9 h-9 rounded-lg text-slate-600 hover:bg-slate-100 hover:text-indigo-600 transition-all duration-200"
              >
                <Palette className="w-4 h-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent side="bottom">Switch Palette</TooltipContent>
          </Tooltip>

          {/* SHARE / GLOBAL FX */}
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                id="tour-global-fx"
                onClick={handleDesignTab}
                className="w-9 h-9 rounded-lg text-slate-600 hover:bg-slate-100 hover:text-amber-500 transition-all duration-200"
              >
                <Share2 className="w-4 h-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent side="bottom">Share Project / Global FX</TooltipContent>
          </Tooltip>

          <Separator orientation="vertical" className="h-6 mx-2" />

          {/* TOUR */}
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                onClick={startTour}
                className="w-9 h-9 rounded-lg text-slate-600 hover:bg-amber-50 hover:text-amber-600 hover:shadow-md hover:shadow-amber-100 transition-all duration-200"
              >
                <HelpCircle className="w-4 h-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent side="bottom">Start Tour</TooltipContent>
          </Tooltip>

          <Separator orientation="vertical" className="h-6 mx-2" />

          {/* PUBLISH */}
          <Button id="tour-publish" className="h-10 gap-2 bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary text-white rounded-xl px-6 text-xs font-bold shadow-lg shadow-primary/25 transition-all duration-200 hover:shadow-xl hover:shadow-primary/30 active:scale-95">
            <Play className="w-4 h-4 fill-current" />
            <span className="hidden sm:inline font-medium">Publish Site</span>
          </Button>
        </div>
      </TooltipProvider>
    </div>
  );
}