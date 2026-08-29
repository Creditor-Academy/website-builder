import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { VariantProps, cva } from "class-variance-authority";
import {
  PanelLeft,
  Globe,
  Layout,
  LogOut,
  Building2,
  Users,
  Activity,
  X,
  ShieldCheck,
  Image as ImageIcon,
  MessageSquare,
  User as UserIcon,
  PanelLeftClose,
} from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";

import { useIsMobile } from "@/hooks/use-mobile";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { Skeleton } from "@/components/ui/skeleton";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

const SIDEBAR_COOKIE_NAME = "sidebar:state";
const SIDEBAR_COOKIE_MAX_AGE = 60 * 60 * 24 * 7;
const SIDEBAR_WIDTH = "16rem";
const SIDEBAR_WIDTH_MOBILE = "18rem";
const SIDEBAR_WIDTH_ICON = "3.5rem";
const SIDEBAR_KEYBOARD_SHORTCUT = "b";

type SidebarContext = {
  state: "expanded" | "collapsed";
  open: boolean;
  setOpen: (open: boolean) => void;
  openMobile: boolean;
  setOpenMobile: (open: boolean) => void;
  isMobile: boolean;
  toggleSidebar: () => void;
};

const SidebarContext = React.createContext<SidebarContext | null>(null);

function useSidebar() {
  const context = React.useContext(SidebarContext);
  if (!context) {
    throw new Error("useSidebar must be used within a SidebarProvider.");
  }
  return context;
}

const SidebarProvider = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<"div"> & {
    defaultOpen?: boolean;
    open?: boolean;
    onOpenChange?: (open: boolean) => void;
  }
>(({ defaultOpen = true, open: openProp, onOpenChange: setOpenProp, className, style, children, ...props }, ref) => {
  const isMobile = useIsMobile();
  const [openMobile, setOpenMobile] = React.useState(false);

  const [_open, _setOpen] = React.useState(defaultOpen);
  const open = openProp ?? _open;
  const setOpen = React.useCallback(
    (value: boolean | ((value: boolean) => boolean)) => {
      const openState = typeof value === "function" ? value(open) : value;
      if (setOpenProp) {
        setOpenProp(openState);
      } else {
        _setOpen(openState);
      }
      document.cookie = `${SIDEBAR_COOKIE_NAME}=${openState}; path=/; max-age=${SIDEBAR_COOKIE_MAX_AGE}`;
    },
    [setOpenProp, open],
  );

  const toggleSidebar = React.useCallback(() => {
    return isMobile ? setOpenMobile((open) => !open) : setOpen((open) => !open);
  }, [isMobile, setOpen, setOpenMobile]);

  React.useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === SIDEBAR_KEYBOARD_SHORTCUT && (event.metaKey || event.ctrlKey)) {
        event.preventDefault();
        toggleSidebar();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [toggleSidebar]);

  const state = open ? "expanded" : "collapsed";

  const contextValue = React.useMemo<SidebarContext>(
    () => ({
      state,
      open,
      setOpen,
      isMobile,
      openMobile,
      setOpenMobile,
      toggleSidebar,
    }),
    [state, open, setOpen, isMobile, openMobile, setOpenMobile, toggleSidebar],
  );

  return (
    <SidebarContext.Provider value={contextValue}>
      <TooltipProvider delayDuration={0}>
        <div
          style={
            {
              "--sidebar-width": SIDEBAR_WIDTH,
              "--sidebar-width-icon": SIDEBAR_WIDTH_ICON,
              ...style,
            } as React.CSSProperties
          }
          className={cn("flex min-h-svh w-full has-[[data-variant=inset]]:bg-surface-container-low", className)}
          ref={ref}
          {...props}
        >
          {children}
        </div>
      </TooltipProvider>
    </SidebarContext.Provider>
  );
});
SidebarProvider.displayName = "SidebarProvider";

const Sidebar = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<"div"> & {
    side?: "left" | "right";
    variant?: "sidebar" | "floating" | "inset";
    collapsible?: "offcanvas" | "icon" | "none";
  }
>(({ side = "left", variant = "sidebar", collapsible = "offcanvas", className, children, ...props }, ref) => {
  const { isMobile, state, openMobile, setOpenMobile } = useSidebar();

  if (collapsible === "none") {
    return (
      <div
        className={cn(
          "flex h-full w-[--sidebar-width] flex-col bg-primary-container dark:bg-inverse-surface text-on-primary border-r border-outline-variant dark:border-outline",
          className
        )}
        ref={ref}
        {...props}
      >
        {children}
      </div>
    );
  }

  if (isMobile) {
    return (
      <Sheet open={openMobile} onOpenChange={setOpenMobile} {...props}>
        <SheetContent
          data-sidebar="sidebar"
          data-mobile="true"
          className="w-[--sidebar-width] bg-primary-container dark:bg-inverse-surface p-0 text-on-primary border-r border-outline-variant dark:border-outline [&>button]:hidden"
          style={
            {
              "--sidebar-width": SIDEBAR_WIDTH_MOBILE,
            } as React.CSSProperties
          }
          side={side}
        >
          <div className="flex h-full w-full flex-col py-md px-sm">{children}</div>
        </SheetContent>
      </Sheet>
    );
  }

  return (
    <div
      ref={ref}
      className="peer hidden text-on-primary md:block"
      data-state={state}
      data-collapsible={state === "collapsed" ? collapsible : ""}
      data-variant={variant}
      data-side={side}
    >
      <div
        className={cn(
          "relative h-svh w-[--sidebar-width] bg-transparent transition-[width] duration-200 ease-linear",
          "group-data-[collapsible=offcanvas]:w-0",
          "group-data-[side=right]:rotate-180",
          variant === "floating" || variant === "inset"
            ? "group-data-[collapsible=icon]:w-[calc(var(--sidebar-width-icon)_+_theme(spacing.4))]"
            : "group-data-[collapsible=icon]:w-[--sidebar-width-icon]",
        )}
      />
      <div
        className={cn(
          "fixed inset-y-0 z-10 hidden h-svh w-[--sidebar-width] transition-[left,right,width] duration-200 ease-linear md:flex",
          side === "left"
            ? "left-0 group-data-[collapsible=offcanvas]:left-[calc(var(--sidebar-width)*-1)]"
            : "right-0 group-data-[collapsible=offcanvas]:right-[calc(var(--sidebar-width)*-1)]",
          variant === "floating" || variant === "inset"
            ? "p-2 group-data-[collapsible=icon]:w-[calc(var(--sidebar-width-icon)_+_theme(spacing.4)_+2px)]"
            : "group-data-[collapsible=icon]:w-[--sidebar-width-icon] group-data-[side=left]:border-r group-data-[side=left]:border-outline-variant dark:group-data-[side=left]:border-outline group-data-[side=right]:border-l",
          className,
        )}
        {...props}
      >
        <div
          data-sidebar="sidebar"
          className="flex h-full w-full flex-col bg-primary-container dark:bg-inverse-surface py-md px-sm group-data-[variant=floating]:rounded-lg group-data-[variant=floating]:border group-data-[variant=floating]:border-outline-variant group-data-[variant=floating]:shadow"
        >
          {children}
        </div>
      </div>
    </div>
  );
});
Sidebar.displayName = "Sidebar";

const SidebarTrigger = React.forwardRef<React.ElementRef<typeof Button>, React.ComponentProps<typeof Button>>(
  ({ className, onClick, ...props }, ref) => {
    const { toggleSidebar } = useSidebar();

    return (
      <Button
        ref={ref}
        data-sidebar="trigger"
        variant="ghost"
        size="icon"
        className={cn("h-8 w-8 text-on-primary hover:bg-surface-container-high/20", className)}
        onClick={(event) => {
          onClick?.(event);
          toggleSidebar();
        }}
        {...props}
      >
        <PanelLeft className="h-5 w-5" />
        <span className="sr-only">Toggle Sidebar</span>
      </Button>
    );
  },
);
SidebarTrigger.displayName = "SidebarTrigger";

const SidebarRail = React.forwardRef<HTMLButtonElement, React.ComponentProps<"button">>(
  ({ className, ...props }, ref) => {
    const { toggleSidebar } = useSidebar();

    return (
      <button
        ref={ref}
        data-sidebar="rail"
        aria-label="Toggle Sidebar"
        tabIndex={-1}
        onClick={toggleSidebar}
        title="Toggle Sidebar"
        className={cn(
          "absolute inset-y-0 z-20 hidden w-4 -translate-x-1/2 transition-all ease-linear after:absolute after:inset-y-0 after:left-1/2 after:w-[2px] group-data-[side=left]:-right-4 group-data-[side=right]:left-0 hover:after:bg-outline-variant sm:flex",
          "[[data-side=left]_&]:cursor-w-resize [[data-side=right]_&]:cursor-e-resize",
          "[[data-side=left][data-state=collapsed]_&]:cursor-e-resize [[data-side=right][data-state=collapsed]_&]:cursor-w-resize",
          "group-data-[collapsible=offcanvas]:translate-x-0 group-data-[collapsible=offcanvas]:after:left-full group-data-[collapsible=offcanvas]:hover:bg-primary-container",
          "[[data-side=left][data-collapsible=offcanvas]_&]:-right-2",
          "[[data-side=right][data-collapsible=offcanvas]_&]:-left-2",
          className,
        )}
        {...props}
      />
    );
  },
);
SidebarRail.displayName = "SidebarRail";

const SidebarInset = React.forwardRef<HTMLDivElement, React.ComponentProps<"main">>(({ className, ...props }, ref) => {
  return (
    <main
      ref={ref}
      className={cn(
        "relative flex min-h-svh flex-1 flex-col bg-surface-container-low text-on-surface",
        "peer-data-[variant=inset]:min-h-[calc(100svh-theme(spacing.4))] md:peer-data-[variant=inset]:m-2 md:peer-data-[state=collapsed]:peer-data-[variant=inset]:ml-2 md:peer-data-[variant=inset]:ml-0 md:peer-data-[variant=inset]:rounded-xl md:peer-data-[variant=inset]:shadow",
        className,
      )}
      {...props}
    />
  );
});
SidebarInset.displayName = "SidebarInset";

const SidebarHeader = React.forwardRef<HTMLDivElement, React.ComponentProps<"div">>(({ className, ...props }, ref) => {
  return <div ref={ref} data-sidebar="header" className={cn("flex flex-col mb-lg px-sm group-data-[collapsible=icon]:px-0 group-data-[collapsible=icon]:items-center", className)} {...props} />;
});
SidebarHeader.displayName = "SidebarHeader";

const SidebarFooter = React.forwardRef<HTMLDivElement, React.ComponentProps<"div">>(({ className, ...props }, ref) => {
  return <div ref={ref} data-sidebar="footer" className={cn("mt-auto border-t border-outline-variant pt-sm group-data-[collapsible=icon]:px-0", className)} {...props} />;
});
SidebarFooter.displayName = "SidebarFooter";

const SidebarSeparator = React.forwardRef<React.ElementRef<typeof Separator>, React.ComponentProps<typeof Separator>>(
  ({ className, ...props }, ref) => {
    return (
      <Separator
        ref={ref}
        data-sidebar="separator"
        className={cn("mx-2 w-auto bg-outline-variant", className)}
        {...props}
      />
    );
  },
);
SidebarSeparator.displayName = "SidebarSeparator";

const SidebarContent = React.forwardRef<HTMLDivElement, React.ComponentProps<"div">>(({ className, ...props }, ref) => {
  return (
    <div
      ref={ref}
      data-sidebar="content"
      className={cn(
        "flex min-h-0 flex-1 flex-col space-y-xs overflow-auto group-data-[collapsible=icon]:overflow-hidden",
        className,
      )}
      {...props}
    />
  );
});
SidebarContent.displayName = "SidebarContent";

const SidebarMenu = React.forwardRef<HTMLUListElement, React.ComponentProps<"ul">>(({ className, ...props }, ref) => (
  <ul ref={ref} data-sidebar="menu" className={cn("flex w-full min-w-0 flex-col space-y-xs font-label-md text-on-primary", className)} {...props} />
));
SidebarMenu.displayName = "SidebarMenu";

const SidebarMenuItem = React.forwardRef<HTMLLIElement, React.ComponentProps<"li">>(({ className, ...props }, ref) => (
  <li ref={ref} data-sidebar="menu-item" className={cn("group/menu-item relative", className)} {...props} />
));
SidebarMenuItem.displayName = "SidebarMenuItem";

const sidebarMenuButtonVariants = cva(
  "peer/menu-button flex w-full items-center gap-sm px-sm py-xs text-left font-label-md text-label-md rounded-lg duration-200 ease-in-out transition-all outline-none ring-sidebar-ring disabled:pointer-events-none disabled:opacity-50 group-data-[collapsible=icon]:!size-10 group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:!p-0 [&>span:last-child]:truncate [&>svg]:size-5 [&>svg]:shrink-0",
  {
    variants: {
      variant: {
        default:
          "text-on-primary dark:text-surface-variant hover:bg-surface-variant dark:hover:bg-on-primary-fixed-variant hover:text-primary transition-all",
        active:
          "bg-secondary-container dark:bg-primary-container text-on-secondary-container dark:text-on-primary-container text-on-primary",
      },
      size: {
        default: "h-9",
        sm: "h-7 text-xs",
        lg: "h-11",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

const SidebarMenuButton = React.forwardRef<
  HTMLButtonElement,
  React.ComponentProps<"button"> & {
    asChild?: boolean;
    isActive?: boolean;
    tooltip?: string | React.ComponentProps<typeof TooltipContent>;
  } & VariantProps<typeof sidebarMenuButtonVariants>
>(({ asChild = false, isActive = false, variant = "default", size = "default", tooltip, className, ...props }, ref) => {
  const Comp = asChild ? Slot : "button";
  const { isMobile, state } = useSidebar();

  const button = (
    <Comp
      ref={ref}
      data-sidebar="menu-button"
      data-size={size}
      data-active={isActive}
      className={cn(sidebarMenuButtonVariants({ variant: isActive ? "active" : variant, size }), className)}
      {...props}
    />
  );

  if (!tooltip) {
    return button;
  }

  if (typeof tooltip === "string") {
    tooltip = {
      children: tooltip,
    };
  }

  return (
    <Tooltip>
      <TooltipTrigger asChild>{button}</TooltipTrigger>
      <TooltipContent side="right" align="center" hidden={state !== "collapsed" || isMobile} {...tooltip} />
    </Tooltip>
  );
});
SidebarMenuButton.displayName = "SidebarMenuButton";

const NavItem = ({
  icon,
  label,
  to,
  exact = false,
  collapsed,
  onNavigate,
}: {
  icon: React.ReactNode;
  label: string;
  to: string;
  exact?: boolean;
  collapsed: boolean;
  onNavigate?: () => void;
}) => {
  const location = useLocation();
  const navigate = useNavigate();
  const isActive = exact
    ? location.pathname === to
    : location.pathname === to || location.pathname.startsWith(`${to}/`);

  return (
    <button
      type="button"
      title={label}
      aria-label={label}
      onClick={() => {
        onNavigate?.();
        navigate(to);
      }}
      className={cn(
        "inline-flex h-10 items-center gap-2.5 rounded-3xl text-sm transition-colors duration-200",
        collapsed ? "w-10 justify-center px-0" : "w-full justify-start px-3",
        isActive
          ? "bg-white/15 font-semibold text-white"
          : "text-slate-300 hover:bg-white/10 hover:text-white",
      )}
    >
      <span className="shrink-0">{icon}</span>
      {!collapsed && <span className="truncate">{label}</span>}
    </button>
  );
};

function SidebarNav({
  collapsed,
  isAdmin,
  userRole,
  base,
  onNavigate,
}: {
  collapsed: boolean;
  isAdmin: boolean;
  userRole?: string;
  base: string;
  onNavigate?: () => void;
}) {
  return (
    <nav
      className={cn(
        "relative z-10 flex-1 space-y-1 overflow-y-auto py-3 no-scrollbar",
        collapsed ? "flex flex-col items-center px-2" : "px-3",
      )}
    >
      {!collapsed && (
        <p className="mb-1 px-3 text-[10px] font-bold uppercase tracking-widest text-slate-400">
          Main Menu
        </p>
      )}
      <NavItem collapsed={collapsed} onNavigate={onNavigate} icon={<Globe className="h-4 w-4" />} label={isAdmin ? "Admin Dashboard" : "Dashboard"} to={base} exact />
      <NavItem collapsed={collapsed} onNavigate={onNavigate} icon={<Layout className="h-4 w-4" />} label="Templates" to={`${base}/templates`} />
      <NavItem collapsed={collapsed} onNavigate={onNavigate} icon={<ImageIcon className="h-4 w-4" />} label="Assets" to={`${base}/assets`} />
      <NavItem collapsed={collapsed} onNavigate={onNavigate} icon={<MessageSquare className="h-4 w-4" />} label="Messages" to={`${base}/messages`} />
      <NavItem collapsed={collapsed} onNavigate={onNavigate} icon={<UserIcon className="h-4 w-4" />} label="Profile" to={`${base}/profile`} />

      {isAdmin && (
        <div className={cn("pt-2", collapsed && "flex flex-col items-center")}>
          {!collapsed && (
            <p className="mb-1 px-3 text-[10px] font-bold uppercase tracking-widest text-slate-400">
              System
            </p>
          )}
          {collapsed && <div className="my-1 h-px w-8 bg-white/10" />}
          <NavItem collapsed={collapsed} onNavigate={onNavigate} icon={<Users className="h-4 w-4" />} label="Users" to="/admin/users" />
          {userRole === "SUPER_ADMIN" && (
            <NavItem collapsed={collapsed} onNavigate={onNavigate} icon={<Building2 className="h-4 w-4" />} label="Organizations" to="/admin/organizations" />
          )}
          <NavItem collapsed={collapsed} onNavigate={onNavigate} icon={<Layout className="h-4 w-4" />} label="Websites" to="/admin/websites" />
          <NavItem collapsed={collapsed} onNavigate={onNavigate} icon={<Activity className="h-4 w-4" />} label="Deployment Monitoring" to="/admin/deployment" />
          <NavItem collapsed={collapsed} onNavigate={onNavigate} icon={<ShieldCheck className="h-4 w-4" />} label="Audit Logs" to="/admin/audit" />
        </div>
      )}
    </nav>
  );
}

export interface DashboardSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  isCompact: boolean;
  isAdmin: boolean;
  isAdminRole: boolean;
  userRole?: string;
  userName: string;
  base: string;
  onGoAdmin: () => void;
  onExitAdmin: () => void;
  onLogout: () => void;
  isLoggingOut: boolean;
}

export function DashboardSidebar({
  isOpen,
  onClose,
  isCompact,
  isAdmin,
  isAdminRole,
  userRole,
  userName,
  base,
  onGoAdmin,
  onExitAdmin,
  onLogout,
  isLoggingOut,
}: DashboardSidebarProps) {
  const navigate = useNavigate();
  const [collapsed, setCollapsed] = React.useState(() => {
    try {
      return localStorage.getItem("buildora-sidebar-collapsed") === "1";
    } catch {
      return false;
    }
  });

  const toggleCollapsed = () => {
    setCollapsed((prev) => {
      const next = !prev;
      try {
        localStorage.setItem("buildora-sidebar-collapsed", next ? "1" : "0");
      } catch { /* ignore */ }
      return next;
    });
  };

  const shellClass =
    "flex flex-col overflow-hidden rounded-3xl bg-[#0F172A] shadow-[0_12px_40px_-12px_rgba(15,23,42,0.45)]";

  const inner = (isCollapsed: boolean, closeable: boolean) => (
    <>
      <div className="pointer-events-none absolute inset-y-0 right-0 w-[38%] origin-bottom-right skew-x-[-18deg] bg-white/[0.06]" />
      <div className="relative z-10 flex h-full flex-col">
        <div className={cn("shrink-0", isCollapsed ? "px-2 pt-3" : "px-4 pt-4")}>
          <div className={cn("flex items-center", isCollapsed ? "flex-col gap-2" : "justify-between gap-2")}>
            {!isCollapsed && (
              <h1 className="truncate px-1 text-xl font-bold tracking-tight text-white">Buildora</h1>
            )}
            <button
              type="button"
              title={closeable ? "Close sidebar" : isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
              aria-label={closeable ? "Close sidebar" : isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
              onClick={() => (closeable ? onClose() : toggleCollapsed())}
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-3xl text-white/70 transition-colors hover:bg-white/10 hover:text-white"
            >
              {closeable ? (
                <X className="h-4 w-4" />
              ) : isCollapsed ? (
                <PanelLeft className="h-4 w-4" />
              ) : (
                <PanelLeftClose className="h-4 w-4" />
              )}
            </button>
          </div>
        </div>

        <SidebarNav
          collapsed={isCollapsed}
          isAdmin={isAdmin}
          userRole={userRole}
          base={base}
          onNavigate={closeable ? onClose : undefined}
        />

        <div className={cn("relative z-10 mt-auto space-y-2 pb-4", isCollapsed ? "px-2" : "px-3")}>
          {!isAdmin && isAdminRole && (
            isCollapsed ? (
              <button
                type="button"
                title="Go to Admin"
                aria-label="Go to Admin"
                onClick={onGoAdmin}
                className="mx-auto flex h-10 w-10 items-center justify-center rounded-3xl border border-white/10 bg-white/10 text-white transition-colors hover:bg-white/15"
              >
                <ShieldCheck className="h-4 w-4" />
              </button>
            ) : (
              <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-white/10 p-3">
                <p className="text-sm font-bold text-white">Admin Access</p>
                <p className="mt-0.5 mb-2 text-[11px] text-white/60">Switch to manage your platform.</p>
                <button
                  type="button"
                  onClick={onGoAdmin}
                  className="w-full rounded-3xl bg-white py-2 text-xs font-bold text-[#0F172A] transition-colors hover:bg-slate-100"
                >
                  Go to Admin
                </button>
              </div>
            )
          )}

          {isAdmin && isAdminRole && (
            <button
              type="button"
              title="Exit Admin Mode"
              aria-label="Exit Admin Mode"
              onClick={onExitAdmin}
              className={cn(
                "flex items-center gap-2 rounded-3xl border border-white/10 bg-white/10 text-sm font-semibold text-white transition-colors hover:bg-white/15",
                isCollapsed ? "mx-auto h-10 w-10 justify-center" : "w-full px-3 py-2.5",
              )}
            >
              <ShieldCheck className="h-4 w-4 shrink-0 text-slate-300" />
              {!isCollapsed && <span className="truncate">Exit Admin Mode</span>}
            </button>
          )}

          <button
            type="button"
            title="Log out"
            onClick={onLogout}
            disabled={isLoggingOut}
            className={cn(
              "flex items-center rounded-3xl text-sm font-semibold text-white/70 transition-colors hover:bg-white/10 hover:text-rose-400 disabled:opacity-50",
              isCollapsed ? "mx-auto h-10 w-10 justify-center" : "w-full justify-between px-3 py-2.5",
            )}
          >
            {!isCollapsed && <span className="truncate">Log out</span>}
            <LogOut className="h-4 w-4 shrink-0" />
          </button>
          
        </div>
      </div>
    </>
  );

  return (
    <>
      {isCompact && isOpen && (
        <div className="fixed inset-0 z-[55] bg-black/50 lg:hidden" onClick={onClose} />
      )}

      {!isCompact && (
        <aside
          className={cn(
            shellClass,
            "relative z-40 my-3 ml-3 shrink-0 transition-[width] duration-300 ease-in-out",
            collapsed ? "w-[72px]" : "w-64",
          )}
        >
          {inner(collapsed, false)}
        </aside>
      )}

      {isCompact && (
        <aside
          className={cn(
            shellClass,
            "fixed inset-y-3 left-3 z-[60] h-[calc(100svh-1.5rem)] w-64 max-w-[calc(100vw-1.5rem)] shadow-xl transition-transform duration-300 ease-in-out",
            isOpen ? "translate-x-0" : "-translate-x-[calc(100%+1.5rem)] pointer-events-none",
          )}
        >
          {inner(false, true)}
        </aside>
      )}
    </>
  );
}

export {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarRail,
  SidebarSeparator,
  SidebarTrigger,
  useSidebar,
};