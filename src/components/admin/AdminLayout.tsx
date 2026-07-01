import { useState } from "react";
import { Outlet, Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  LayoutDashboard,
  Users,
  Package,
  ShoppingCart,
  MessageSquare,
  Mail,
  BarChart3,
  Settings,
  Bell,
  Menu,
  X,
  FolderOpen,
  FileText,
  Sparkles,
  Search,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

const navItems = [
  { label: "Dashboard", icon: LayoutDashboard, path: "/admin", color: "from-orange-500 to-amber-500" },
  { label: "Users", icon: Users, path: "/admin/users", color: "from-teal-500 to-emerald-600" },
  { label: "Products", icon: Package, path: "/admin/products", color: "from-amber-500 to-orange-600" },
  { label: "Categories", icon: FolderOpen, path: "/admin/categories", color: "from-yellow-500 to-amber-600" },
  { label: "Orders", icon: ShoppingCart, path: "/admin/orders", color: "from-rose-500 to-orange-500" },
  { label: "SMS Center", icon: MessageSquare, path: "/admin/sms", color: "from-cyan-600 to-teal-700" },
  { label: "Newsletters", icon: Mail, path: "/admin/newsletters", color: "from-amber-500 to-yellow-600" },
  { label: "Blog Posts", icon: FileText, path: "/admin/blog", color: "from-emerald-500 to-teal-600" },
  { label: "Analytics", icon: BarChart3, path: "/admin/analytics", color: "from-orange-600 to-rose-600" },
  { label: "Settings", icon: Settings, path: "/admin/settings", color: "from-stone-500 to-amber-600" },
];

const AdminLayout = () => {
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false); // mobile drawer
  const [collapsed, setCollapsed] = useState(false); // desktop collapsed

  const activeItem = navItems.find((i) => i.path === location.pathname);
  const sidebarWidth = collapsed ? "md:w-20" : "md:w-64";
  const mainOffset = collapsed ? "md:ml-20" : "md:ml-64";
  const topOffset = collapsed ? "md:left-20" : "md:left-64";

  return (
    <TooltipProvider delayDuration={100}>
      <div className="min-h-screen bg-mesh">
        {/* Mobile Header */}
        <div className="md:hidden fixed top-0 left-0 right-0 z-50 glass-strong px-4 py-3 flex items-center justify-between border-b border-primary/20">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="icon" onClick={() => setSidebarOpen(!sidebarOpen)}>
              {sidebarOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-lg bg-gradient-primary flex items-center justify-center glow-sm">
                <Sparkles className="h-4 w-4 text-white" />
              </div>
              <span className="font-bold text-base text-gradient truncate">
                {activeItem?.label ?? "Admin"}
              </span>
            </div>
          </div>
          <Button variant="ghost" size="icon" className="relative shrink-0">
            <Bell className="h-5 w-5" />
            <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-accent animate-pulse" />
          </Button>
        </div>

        {/* Sidebar */}
        <aside
          className={cn(
            "fixed top-0 left-0 z-40 h-screen w-72 bg-sidebar border-r border-primary/10 transition-all duration-300 md:translate-x-0",
            sidebarWidth,
            sidebarOpen ? "translate-x-0" : "-translate-x-full"
          )}
        >
          <div className="flex flex-col h-full">
            {/* Logo */}
            <div className={cn("border-b border-primary/10 flex items-center", collapsed ? "p-3 justify-center" : "p-5")}>
              <Link to="/admin" className="flex items-center gap-3 group min-w-0">
                <div className="h-10 w-10 shrink-0 rounded-xl bg-gradient-primary flex items-center justify-center glow-sm group-hover:scale-110 transition-transform">
                  <Sparkles className="h-5 w-5 text-white" />
                </div>
                {!collapsed && (
                  <div className="min-w-0">
                    <span className="font-bold text-lg text-gradient block leading-tight truncate">Admin Hub</span>
                    <span className="text-[10px] text-muted-foreground uppercase tracking-widest">Control Center</span>
                  </div>
                )}
              </Link>
            </div>

            {/* Search */}
            {!collapsed && (
              <div className="px-3 pt-3">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input placeholder="Quick search..." className="pl-9 h-9 bg-muted/40 border-primary/10 focus-visible:ring-primary/40" />
                </div>
              </div>
            )}

            {/* Navigation */}
            <nav className={cn("flex-1 overflow-y-auto py-3 space-y-1", collapsed ? "px-2" : "px-3")}>
              {!collapsed && (
                <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-widest px-3 mb-2">Menu</p>
              )}
              {navItems.map((item) => {
                const isActive = location.pathname === item.path;
                const link = (
                  <Link
                    key={item.path}
                    to={item.path}
                    onClick={() => setSidebarOpen(false)}
                    className={cn(
                      "group relative flex items-center gap-3 rounded-xl text-sm font-medium transition-all overflow-hidden",
                      collapsed ? "justify-center p-2.5" : "px-3 py-2",
                      isActive
                        ? "text-white shadow-glow-sm"
                        : "text-muted-foreground hover:text-foreground hover:bg-muted/60"
                    )}
                  >
                    {isActive && (
                      <span className={cn("absolute inset-0 bg-gradient-to-r opacity-100", item.color)} />
                    )}
                    {!collapsed && (
                      <span className={cn(
                        "absolute left-0 top-1/2 -translate-y-1/2 h-6 w-1 rounded-r-full transition-all",
                        isActive ? "bg-white" : "bg-transparent group-hover:bg-primary/60"
                      )} />
                    )}
                    <item.icon className={cn("relative h-5 w-5 shrink-0 transition-transform group-hover:scale-110", isActive && "drop-shadow")} />
                    {!collapsed && <span className="relative truncate">{item.label}</span>}
                  </Link>
                );
                return collapsed ? (
                  <Tooltip key={item.path}>
                    <TooltipTrigger asChild>{link}</TooltipTrigger>
                    <TooltipContent side="right">{item.label}</TooltipContent>
                  </Tooltip>
                ) : (
                  link
                );
              })}
            </nav>

            {/* Upgrade card */}
            {!collapsed && (
              <div className="px-3 pb-2">
                <div className="relative overflow-hidden rounded-xl bg-gradient-primary p-3 glow-sm">
                  <div className="absolute -right-4 -top-4 h-16 w-16 rounded-full bg-white/10 blur-2xl" />
                  <div className="flex items-center gap-2">
                    <Sparkles className="h-4 w-4 text-white" />
                    <p className="text-sm font-bold text-white">Pro Tools</p>
                  </div>
                  <p className="text-[11px] text-white/80 mt-1">Unlock advanced analytics</p>
                </div>
              </div>
            )}

            {/* Footer area */}
            <div className={cn("border-t border-primary/10", collapsed ? "p-2" : "p-3")}>
              {!collapsed && (
                <p className="text-[10px] text-muted-foreground text-center mb-2">CreativeHub Admin v1.0</p>
              )}
            </div>
          </div>
        </aside>

        {sidebarOpen && (
          <div className="fixed inset-0 z-30 bg-black/60 backdrop-blur-sm md:hidden" onClick={() => setSidebarOpen(false)} />
        )}

        {/* Top bar (desktop) */}
        <div className={cn(
          "hidden md:flex fixed top-0 right-0 z-30 h-14 items-center justify-between px-4 lg:px-6 glass-strong border-b border-primary/10 transition-all duration-300",
          topOffset
        )}>
          <div className="flex items-center gap-2 min-w-0">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setCollapsed(!collapsed)}
              className="shrink-0"
              aria-label="Toggle sidebar"
            >
              {collapsed ? <ChevronRight className="h-5 w-5" /> : <ChevronLeft className="h-5 w-5" />}
            </Button>
            <div className="min-w-0">
              <p className="text-[10px] text-muted-foreground uppercase tracking-wider leading-none">Welcome back</p>
              <h2 className="text-sm font-semibold flex items-center gap-2 truncate">
                {activeItem?.label ?? "Dashboard"}
                <span className="h-1.5 w-1.5 rounded-full bg-success animate-pulse shrink-0" />
              </h2>
            </div>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <Button variant="ghost" size="icon" className="relative">
              <Bell className="h-5 w-5" />
              <span className="absolute top-2 right-2 h-2 w-2 rounded-full bg-accent animate-pulse" />
            </Button>
            <div className="h-9 w-9 rounded-full bg-gradient-primary flex items-center justify-center text-white font-bold text-sm glow-sm">
              A
            </div>
          </div>
        </div>

        {/* Main */}
        <main className={cn("min-h-screen pt-14 transition-all duration-300", mainOffset)}>
          <div className="p-4 sm:p-5 lg:p-7 animate-fade-in max-w-[1600px] mx-auto">
            <Outlet />
          </div>
        </main>
      </div>
    </TooltipProvider>
  );
};

export default AdminLayout;
