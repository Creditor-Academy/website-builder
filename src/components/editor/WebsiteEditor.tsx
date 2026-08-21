import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { BuilderProvider } from "@/contexts/BuilderContext";
import useBuilderStore from "@/store/useBuilderStore";
import { useIsCompact } from "@/hooks/use-mobile";
import { EditorToolbar } from "./EditorToolbar";
import { SectionsList } from "./SectionsList";
import { PageManager } from "./PageManager";
import { SiteSettings } from "./SiteSettings";
import { CanvasPreview } from "./CanvasPreview";
import { PropertiesPanel } from "./PropertiesPanel";
import { TextFormattingToolbar } from "./TextFormattingToolbar";
import { GuidedTour } from "./GuidedTour";
import { AssetLibraryPanel } from "./AssetLibraryPanel";
import { DesignSystemPanel } from "./DesignSystemPanel";
import { VersionHistoryPanel } from "./VersionHistoryPanel";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import {
  Layers,
  FileText,
  Plus,
  Settings,
  Image as ImageIcon,
  Palette,
  Edit,
  History,
  X,
} from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

const NAV_ITEMS = [
  { id: "add", icon: Plus, label: "Sections" },
  { id: "layers", icon: Layers, label: "Layers" },
  { id: "pages", icon: FileText, label: "Pages" },
  { id: "assets", icon: ImageIcon, label: "Assets" },
  { id: "design", icon: Palette, label: "Design System" },
  { id: "edit", icon: Edit, label: "Edit" },
  { id: "history", icon: History, label: "Version History" },
];

function EditorSidebarPanels({ leftNavTab }: { leftNavTab: string }) {
  return (
    <div className="flex-1 flex flex-col min-w-0 bg-white overflow-hidden">
      <div className="h-full min-h-0 overflow-hidden">
        {leftNavTab === "add" && <SectionsList view="add" />}
        {leftNavTab === "layers" && <SectionsList view="layers" />}
        {leftNavTab === "assets" && <AssetLibraryPanel />}
        {leftNavTab === "design" && <DesignSystemPanel />}
        {leftNavTab === "pages" && <PageManager />}
        {leftNavTab === "edit" && <PropertiesPanel />}
        {leftNavTab === "settings" && <SiteSettings />}
        {leftNavTab === "history" && <VersionHistoryPanel />}
      </div>
    </div>
  );
}

function EditorLeftSidebar({
  leftNavTab,
  setLeftNavTab,
  onClose,
}: {
  leftNavTab: string;
  setLeftNavTab: (id: string) => void;
  onClose?: () => void;
}) {
  return (
    <div className="h-full w-full flex overflow-hidden bg-white">
      <div className="w-14 shrink-0 border-r border-white/10 flex flex-col items-center bg-[#131b2e]">
        <TooltipProvider delayDuration={0}>
          <nav className="flex flex-1 flex-col items-center py-3 w-full min-h-0 bg-[#131b2e]">
            {onClose && (
              <button
                type="button"
                onClick={onClose}
                aria-label="Close sidebar"
                className="mb-2 w-9 h-9 rounded-lg flex items-center justify-center text-slate-200 hover:text-white hover:bg-white/10"
              >
                <X className="w-[18px] h-[18px]" strokeWidth={1.75} />
              </button>
            )}
            <div className="flex flex-col items-center gap-1 overflow-y-auto">
              {NAV_ITEMS.map((item) => {
                const isActive = leftNavTab === item.id;
                return (
                  <Tooltip key={item.id}>
                    <TooltipTrigger asChild>
                      <button
                        id={`tour-nav-${item.id}`}
                        type="button"
                        onClick={() => setLeftNavTab(item.id)}
                        aria-label={item.label}
                        aria-current={isActive ? "page" : undefined}
                        className={`w-9 h-9 rounded-lg flex items-center justify-center transition-colors ${isActive
                            ? "bg-[#dedfeb] text-[#191b24]"
                            : "text-slate-200 hover:text-white hover:bg-white/10"
                          }`}
                      >
                        <item.icon className="w-[18px] h-[18px]" strokeWidth={1.75} />
                      </button>
                    </TooltipTrigger>
                    <TooltipContent side="right" className="text-xs font-medium">
                      {item.label}
                    </TooltipContent>
                  </Tooltip>
                );
              })}
            </div>

            <div className="mt-auto pt-2">
              <Tooltip>
                <TooltipTrigger asChild>
                  <button
                    type="button"
                    onClick={() => setLeftNavTab("settings")}
                    aria-label="Site Settings"
                    aria-current={leftNavTab === "settings" ? "page" : undefined}
                    className={`w-9 h-9 rounded-lg flex items-center justify-center transition-colors ${leftNavTab === "settings"
                        ? "bg-[#dedfeb] text-[#191b24]"
                        : "text-slate-200 hover:text-white hover:bg-white/10"
                      }`}
                  >
                    <Settings className="w-[18px] h-[18px]" strokeWidth={1.75} />
                  </button>
                </TooltipTrigger>
                <TooltipContent side="right" className="text-xs font-medium">
                  Site Settings
                </TooltipContent>
              </Tooltip>
            </div>
          </nav>
        </TooltipProvider>
      </div>

      <EditorSidebarPanels leftNavTab={leftNavTab} />
    </div>
  );
}

function EditorContent() {
  const [leftNavTab, setLeftNavTab] = useState("add");
  const store = useBuilderStore();
  const { editor, setTourState, activeWebsiteId, setEditorState } = store;
  const { id } = useParams();
  const isCompact = useIsCompact();

  useEffect(() => {
    setEditorState({ showLeftPanel: !isCompact });
  }, [isCompact, setEditorState]);

  useEffect(() => {
    if (editor.selectedSectionId || editor.selectedComponentId) {
      setLeftNavTab("edit");
      if (isCompact) {
        setEditorState({ showLeftPanel: true });
      }
    }
  }, [editor.selectedSectionId, editor.selectedComponentId, isCompact, setEditorState]);

  useEffect(() => {
    if (!isCompact || !editor.showLeftPanel) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setEditorState({ showLeftPanel: false });
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [isCompact, editor.showLeftPanel, setEditorState]);

  const showSidebar = !editor.previewMode && editor.showLeftPanel;
  const closeSidebar = () => setEditorState({ showLeftPanel: false });

  return (
    <div className="h-screen flex flex-col bg-white overflow-hidden font-sans">
      <EditorToolbar
        websiteId={activeWebsiteId || id}
        onTabChange={setLeftNavTab}
      />
      <TextFormattingToolbar />
      <GuidedTour />

      {!editor.tour.isActive && (
        <button
          onClick={() => setTourState({ isActive: true, step: 0, isFinished: false })}
          className="fixed bottom-4 right-4 z-50 w-12 h-12 flex items-center justify-center bg-sky-400 text-white rounded-full shadow-lg hover:bg-sky-500 transition-colors"
        >
          ?
        </button>
      )}

      <div className={`relative z-0 flex-1 min-h-0 isolate ${editor.tour.isActive ? "pointer-events-none opacity-90" : ""}`}>
        <ResizablePanelGroup direction="horizontal" className="h-full relative z-0">
          {!isCompact && showSidebar && (
            <>
              <ResizablePanel
                defaultSize={24}
                minSize={20}
                maxSize={40}
                className="min-w-[20rem] bg-white border-r border-slate-200 flex overflow-hidden"
              >
                <EditorLeftSidebar
                  leftNavTab={leftNavTab}
                  setLeftNavTab={setLeftNavTab}
                />
              </ResizablePanel>
              <ResizableHandle className="w-1 bg-slate-100 hover:bg-primary/30 transition-all border-r border-slate-200" />
            </>
          )}
          <ResizablePanel
            defaultSize={editor.previewMode || isCompact ? 100 : 53}
            className="bg-slate-100/30 p-3 sm:p-4 lg:p-6 overflow-hidden flex flex-col relative z-0 isolate min-w-0"
          >
            <div className="absolute inset-0 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:20px_20px] opacity-40 pointer-events-none"></div>
            <CanvasPreview />
          </ResizablePanel>
        </ResizablePanelGroup>

        {isCompact && showSidebar && (
          <>
            <button
              type="button"
              aria-label="Close sidebar"
              className="absolute inset-0 z-40 bg-slate-900/40"
              onClick={closeSidebar}
            />
            <aside
              role="dialog"
              aria-modal="true"
              aria-label="Editor sidebar"
              className="absolute z-50 inset-y-0 left-0 w-[min(22.5rem,calc(100vw-2.5rem))] max-w-full bg-white border-r border-slate-200 shadow-[8px_0_24px_-8px_rgba(15,23,42,0.28)] flex overflow-hidden"
            >
              <EditorLeftSidebar
                leftNavTab={leftNavTab}
                setLeftNavTab={setLeftNavTab}
                onClose={closeSidebar}
              />
            </aside>
          </>
        )}
      </div>
    </div>
  );
}

export function WebsiteEditor({ initialPage }: { initialPage?: any }) {
  const { id } = useParams();
  const store = useBuilderStore();
  const { selectWebsite, activeWebsiteId } = store;

  useEffect(() => {
    document.documentElement.classList.remove("dark");
    document.body.style.backgroundColor = "";
    return () => {
      try {
        const saved = localStorage.getItem("buildora-theme");
        if (saved === "dark") document.documentElement.classList.add("dark");
      } catch { }
    };
  }, []);

  useEffect(() => {
    if (id) {
      selectWebsite(id);
    }
  }, [id, selectWebsite]);

  if (!activeWebsiteId && id) {
    return (
      <div className="h-screen flex items-center justify-center bg-slate-50">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
          <p className="text-slate-600 font-medium">Loading your project...</p>
        </div>
      </div>
    );
  }

  return (
    <BuilderProvider initialPage={initialPage}>
      <EditorContent />
    </BuilderProvider>
  );
}
