import React, { useState } from 'react';
import { useBuilder } from '@/contexts/BuilderContext';
import useBuilderStore from '@/store/useBuilderStore';
import {
  Undo2, Redo2, Eye, Download, Play, Share2, Home,
  HelpCircle, Palette, MoreVertical, Monitor, Tablet, Smartphone, Minus, Plus,
} from 'lucide-react';
import { DEVICE_WIDTHS } from '@/builder/types';
import { statusLabel } from '@/builder/api';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipTrigger, TooltipProvider } from '@/components/ui/tooltip';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { PublishDialog } from './PublishDialog';
import { cn } from '@/lib/utils';

const iconBtnClass =
  'h-8 w-8 shrink-0 rounded-lg text-white/70 hover:bg-white/10 hover:text-white sm:h-9 sm:w-9';

export function EditorToolbar({ websiteId = '', onTabChange = (_tab: string) => {} }: any) {
  const [showPublishDialog, setShowPublishDialog] = useState(false);
  const { state, undo, redo, canUndo, canRedo, setPreviewMode, setLeftPanelVisible } = useBuilder();
  const { editor, page } = state;
  const store = useBuilderStore();
  const { setTourState, templateEditor, setDevice, setZoom, setEditorState } = store;
  const isTemplateEditor = Boolean(templateEditor);
  const activeWebsite = store.getActiveWebsite?.() || store.websites?.find((w: { id: string }) => w.id === (websiteId || store.activeWebsiteId));
  const projectLabel = isTemplateEditor
    ? templateEditor?.name || 'Template'
    : activeWebsite?.name || 'Project';

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

  const goDashboard = () => {
    window.location.href = isTemplateEditor ? '/dashboard/templates' : '/dashboard';
  };

  return (
    <div className="sticky top-0 z-50 flex h-12 shrink-0 items-center gap-1 border-b border-white/10 bg-[#0F172A] px-2 text-white sm:h-14 sm:gap-2 sm:px-3 md:px-4">
      <TooltipProvider delayDuration={0}>
        <div className="flex min-w-0 flex-1 items-center gap-1 sm:gap-2">
          <div id="tour-logo" className="flex min-w-0 items-center gap-2">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-white/10 sm:h-9 sm:w-9">
              <span className="text-xs font-black tracking-tighter text-white sm:text-sm">B</span>
            </div>
            <div className="hidden min-w-0 flex-col sm:flex">
              <span className="text-[13px] font-bold leading-none tracking-tight text-white">Buildora</span>
              <div className="mt-1 flex items-center gap-1.5">
                <div className="h-1.5 w-1.5 rounded-full bg-emerald-400 shadow-sm shadow-emerald-400/50" />
                <span className="text-[10px] font-semibold uppercase tracking-wider text-white/50">
                  {isTemplateEditor ? 'Template Mode' : 'Editing Mode'}
                </span>
              </div>
            </div>
          </div>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setLeftPanelVisible(!editor.showLeftPanel)}
                className={iconBtnClass}
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="18" x="3" y="3" rx="2"/><path d="M9 3v18"/></svg>
              </Button>
            </TooltipTrigger>
            <TooltipContent side="bottom" className="border-[#1e293b] bg-[#0F172A] text-white">
              <div className="text-xs font-medium">Toggle Sidebar</div>
            </TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setEditorState({ showRightPanel: !editor.showRightPanel })}
                className={cn(iconBtnClass, 'hidden sm:inline-flex')}
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="18" x="3" y="3" rx="2"/><path d="M15 3v18"/></svg>
              </Button>
            </TooltipTrigger>
            <TooltipContent side="bottom" className="border-[#1e293b] bg-[#0F172A] text-white">
              <div className="text-xs font-medium">Toggle Properties</div>
            </TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                onClick={goDashboard}
                className={cn(iconBtnClass, 'hidden sm:inline-flex')}
              >
                <Home className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent side="bottom" className="border-[#1e293b] bg-[#0F172A] text-white">
              <div className="text-xs font-medium">Dashboard</div>
            </TooltipContent>
          </Tooltip>

          <div className="hidden min-w-0 max-w-[14rem] flex-col rounded-lg border border-white/10 bg-white/5 px-2.5 py-1 lg:flex xl:max-w-xs">
            <span className="truncate text-[11px] font-semibold text-white">{projectLabel}</span>
            <span className="truncate text-[10px] text-white/50">{page?.name || 'Page'}</span>
          </div>

          <div className="hidden items-center gap-1.5 xl:flex">
            <div className={`h-1.5 w-1.5 rounded-full ${editor.saveStatus === 'error' || editor.saveStatus === 'publish-error' ? 'bg-rose-400' : editor.saveStatus === 'saving' || editor.saveStatus === 'publishing' ? 'bg-amber-400' : 'bg-emerald-400'}`} />
            <span className="text-[10px] font-medium text-white/50">{statusLabel(editor.saveStatus || 'idle')}</span>
          </div>
        </div>

        <div className="flex shrink-0 items-center gap-0.5 sm:gap-1">
          <div className="flex items-center rounded-lg bg-white/10 p-0.5">
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={undo}
                  disabled={!canUndo}
                  className="h-7 w-7 rounded-md text-white/70 hover:bg-white/10 hover:text-white disabled:text-white/25 sm:h-8 sm:w-8"
                >
                  <Undo2 className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent side="bottom" className="border-[#1e293b] bg-[#0F172A] text-white">Undo</TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={redo}
                  disabled={!canRedo}
                  className="h-7 w-7 rounded-md text-white/70 hover:bg-white/10 hover:text-white disabled:text-white/25 sm:h-8 sm:w-8"
                >
                  <Redo2 className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent side="bottom" className="border-[#1e293b] bg-[#0F172A] text-white">Redo</TooltipContent>
            </Tooltip>
          </div>

          <div className="hidden items-center rounded-lg bg-white/10 p-0.5 md:flex">
            {([
              ['desktop', Monitor],
              ['tablet', Tablet],
              ['mobile', Smartphone],
            ] as const).map(([device, Icon]) => (
              <Tooltip key={device}>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setDevice(device)}
                    className={cn(
                      'h-7 w-7 rounded-md text-white/70 hover:bg-white/10 hover:text-white sm:h-8 sm:w-8',
                      editor.device === device && 'bg-white/15 text-white',
                    )}
                  >
                    <Icon className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="bottom" className="border-[#1e293b] bg-[#0F172A] text-white capitalize">{device}</TooltipContent>
              </Tooltip>
            ))}
          </div>

          <div className="hidden items-center rounded-lg bg-white/10 p-0.5 lg:flex">
            <Button variant="ghost" size="icon" className="h-7 w-7 text-white/70 hover:bg-white/10 hover:text-white sm:h-8 sm:w-8" onClick={() => setZoom((editor.zoom || 100) - 10)}>
              <Minus className="h-3.5 w-3.5" />
            </Button>
            <button
              type="button"
              className="min-w-[3rem] text-center text-[11px] font-semibold text-white/80"
              onClick={() => setZoom(100)}
            >
              {Math.round(editor.zoom || 100)}%
            </button>
            <Button variant="ghost" size="icon" className="h-7 w-7 text-white/70 hover:bg-white/10 hover:text-white sm:h-8 sm:w-8" onClick={() => setZoom((editor.zoom || 100) + 10)}>
              <Plus className="h-3.5 w-3.5" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7 text-white/70 hover:bg-white/10 hover:text-white sm:h-8 sm:w-8"
              onClick={() => {
                const canvas = document.getElementById('tour-canvas');
                const width = canvas?.clientWidth || DEVICE_WIDTHS.desktop;
                const frame = DEVICE_WIDTHS[editor.device] || DEVICE_WIDTHS.desktop;
                setZoom(Math.floor(((width - 64) / frame) * 100));
              }}
            >
              <span className="text-[9px] font-bold">Fit</span>
            </Button>
          </div>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setPreviewMode(!editor.previewMode)}
                className={cn(
                  iconBtnClass,
                  editor.previewMode && 'bg-white/15 text-white',
                )}
              >
                <Eye className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent side="bottom" className="border-[#1e293b] bg-[#0F172A] text-white">Preview Mode</TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                onClick={handleExport}
                className={cn(iconBtnClass, 'hidden md:inline-flex')}
              >
                <Download className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent side="bottom" className="border-[#1e293b] bg-[#0F172A] text-white">Export JSON</TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                id="tour-palette"
                onClick={handleDesignTab}
                className={cn(iconBtnClass, 'hidden md:inline-flex')}
              >
                <Palette className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent side="bottom" className="border-[#1e293b] bg-[#0F172A] text-white">Switch Palette</TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                id="tour-global-fx"
                onClick={handleDesignTab}
                className={cn(iconBtnClass, 'hidden lg:inline-flex')}
              >
                <Share2 className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent side="bottom" className="border-[#1e293b] bg-[#0F172A] text-white">Share Project / Global FX</TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                onClick={startTour}
                className={cn(iconBtnClass, 'hidden lg:inline-flex')}
              >
                <HelpCircle className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent side="bottom" className="border-[#1e293b] bg-[#0F172A] text-white">Start Tour</TooltipContent>
          </Tooltip>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                aria-label="More actions"
                className={cn(iconBtnClass, 'lg:hidden')}
              >
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48 rounded-xl border-white/10 bg-[#0F172A] p-1.5 text-white">
              <DropdownMenuItem className="cursor-pointer gap-2 rounded-lg focus:bg-white/10 focus:text-white sm:hidden" onClick={goDashboard}>
                <Home className="h-4 w-4" /> Dashboard
              </DropdownMenuItem>
              <DropdownMenuItem className="cursor-pointer gap-2 rounded-lg focus:bg-white/10 focus:text-white md:hidden" onClick={handleExport}>
                <Download className="h-4 w-4" /> Export JSON
              </DropdownMenuItem>
              <DropdownMenuItem className="cursor-pointer gap-2 rounded-lg focus:bg-white/10 focus:text-white md:hidden" onClick={handleDesignTab}>
                <Palette className="h-4 w-4" /> Switch Palette
              </DropdownMenuItem>
              <DropdownMenuItem className="cursor-pointer gap-2 rounded-lg focus:bg-white/10 focus:text-white" onClick={handleDesignTab}>
                <Share2 className="h-4 w-4" /> Global FX
              </DropdownMenuItem>
              <DropdownMenuItem className="cursor-pointer gap-2 rounded-lg focus:bg-white/10 focus:text-white" onClick={startTour}>
                <HelpCircle className="h-4 w-4" /> Start Tour
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {!isTemplateEditor && (
            <Button
              id="tour-publish"
              onClick={() => setShowPublishDialog(true)}
              className="ml-0.5 h-8 shrink-0 gap-1.5 rounded-full bg-white px-2.5 text-[11px] font-semibold text-[#0F172A] shadow-none hover:bg-slate-100 hover:text-[#0F172A] sm:ml-1 sm:h-9 sm:px-4 sm:text-xs"
            >
              <Play className="h-3.5 w-3.5 fill-current" />
              <span className="hidden sm:inline">Publish Site</span>
            </Button>
          )}
        </div>
      </TooltipProvider>

      <PublishDialog
        open={showPublishDialog}
        onOpenChange={setShowPublishDialog}
        websiteId={websiteId}
      />
    </div>
  );
}
