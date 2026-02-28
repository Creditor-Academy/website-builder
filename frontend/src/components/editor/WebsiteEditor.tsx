import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { BuilderProvider } from '@/contexts/BuilderContext';
import { EditorToolbar } from './EditorToolbar';
import { SectionsList } from './SectionsList';
import { PageManager } from './PageManager';
import { SiteSettings } from './SiteSettings';
import { CanvasPreview } from './CanvasPreview';
import { PropertiesPanel } from './PropertiesPanel';
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from '@/components/ui/resizable';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Layers, FileText, Globe, Plus, Settings, Palette, Search } from 'lucide-react';
import useBuilderStore from '@/store/useBuilderStore';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

function EditorContent() {
  const [theme, setTheme] = useState('light');
  const [leftNavTab, setLeftNavTab] = useState('add'); // 'add', 'layers', 'pages', 'settings'
  const { editor } = useBuilderStore();

  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }, [theme]);

  const toggleTheme = () => setTheme((t) => (t === 'light' ? 'dark' : 'light'));

  const navItems = [
    { id: 'add', icon: Plus, label: 'Add Elements' },
    { id: 'layers', icon: Layers, label: 'Layers' },
    { id: 'pages', icon: FileText, label: 'Pages' },
    { id: 'settings', icon: Settings, label: 'Site Settings' },
  ];

  return (
    <div className="h-screen flex flex-col bg-background overflow-hidden font-sans">
      <EditorToolbar theme={theme} onToggleTheme={toggleTheme} />
      <div className="flex-1 min-h-0">
        <ResizablePanelGroup direction="horizontal" className="h-full">
          {!editor.previewMode && editor.showLeftPanel && (
            <>
              <ResizablePanel defaultSize={22} minSize={15} maxSize={35} className="bg-white border-r border-slate-200 flex overflow-hidden">
                {/* Slim Vertical Sidebar */}
                <div className="w-[60px] border-r border-slate-100 flex flex-col items-center py-4 gap-4 bg-slate-50/50">
                  <TooltipProvider delayDuration={0}>
                    {navItems.map((item) => (
                      <Tooltip key={item.id}>
                        <TooltipTrigger asChild>
                          <button
                            onClick={() => setLeftNavTab(item.id)}
                            className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-200 ${leftNavTab === item.id
                              ? 'bg-primary text-white shadow-lg shadow-primary/20 scale-105'
                              : 'text-slate-400 hover:text-slate-600 hover:bg-slate-200/50'
                              }`}
                          >
                            <item.icon className="w-5 h-5" />
                          </button>
                        </TooltipTrigger>
                        <TooltipContent side="right" className="text-xs font-semibold">
                          {item.label}
                        </TooltipContent>
                      </Tooltip>
                    ))}
                  </TooltipProvider>

                  <div className="mt-auto">
                    <TooltipProvider delayDuration={0}>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <button className="w-10 h-10 rounded-xl flex items-center justify-center text-slate-400 hover:text-slate-600 hover:bg-slate-200/50 transition-all">
                            <Palette className="w-5 h-5" />
                          </button>
                        </TooltipTrigger>
                        <TooltipContent side="right" className="text-xs font-semibold">
                          Global Styles
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>
                </div>

                {/* Content Panel */}
                <div className="flex-1 flex flex-col min-w-0 bg-white">
                  <div className="h-full overflow-hidden">
                    {leftNavTab === 'add' && <SectionsList view="add" />}
                    {leftNavTab === 'layers' && <SectionsList view="layers" />}
                    {leftNavTab === 'pages' && <PageManager />}
                    {leftNavTab === 'settings' && <SiteSettings />}
                  </div>
                </div>
              </ResizablePanel>
              <ResizableHandle className="w-1 bg-slate-100 hover:bg-primary/30 transition-all border-r border-slate-200" />
            </>
          )}
          <ResizablePanel defaultSize={editor.previewMode ? 100 : 53} className="bg-slate-100/30 p-4 lg:p-6 overflow-hidden flex flex-col relative">
            <div className="absolute inset-0 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:20px_20px] opacity-40 pointer-events-none"></div>
            <CanvasPreview />
          </ResizablePanel>
          {!editor.previewMode && editor.showRightPanel && (
            <>
              <ResizableHandle className="w-1 bg-slate-100 hover:bg-primary/30 transition-all border-l border-slate-200" />
              <ResizablePanel defaultSize={25} minSize={20} maxSize={35} className="bg-white border-l border-slate-200 shadow-sm">
                <PropertiesPanel />
              </ResizablePanel>
            </>
          )}
        </ResizablePanelGroup>
      </div>
    </div>
  );
}

export function WebsiteEditor() {
  const { id } = useParams();
  const { selectWebsite, activeWebsiteId } = useBuilderStore();

  useEffect(() => {
    if (id) {
      selectWebsite(id);
    }
  }, [id, selectWebsite]);

  if (!activeWebsiteId && id) {
    return <div className="h-screen flex items-center justify-center bg-slate-50">
      <div className="flex flex-col items-center gap-4">
        <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
        <p className="text-slate-600 font-medium">Loading your project...</p>
      </div>
    </div>;
  }

  return (
    <BuilderProvider>
      <EditorContent />
    </BuilderProvider>
  );
}
