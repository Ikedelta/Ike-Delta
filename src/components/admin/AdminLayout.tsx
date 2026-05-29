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
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";

const navItems = [
  { label: "Dashboard", icon: LayoutDashboard, path: "/admin", color: "from-orange-500 to-amber-500" },
  { label: "Users", icon: Users, path: "/admin/users", color: "from-orange-400 to-red-500" },
  { label: "Products", icon: Package, path: "/admin/products", color: "from-amber-500 to-orange-600" },
  { label: "Categories", icon: FolderOpen, path: "/admin/categories", color: "from-yellow-500 to-orange-500" },
  { label: "Orders", icon: ShoppingCart, path: "/admin/orders", color: "from-orange-500 to-pink-500" },
  { label: "SMS Center", icon: MessageSquare, path: "/admin/sms", color: "from-red-500 to-orange-500" },
  { label: "Newsletters", icon: Mail, path: "/admin/newsletters", color: "from-orange-500 to-rose-500" },
  { label: "Blog Posts", icon: FileText, path: "/admin/blog", color: "from-amber-400 to-orange-500" },
  { label: "Analytics", icon: BarChart3, path: "/admin/analytics", color: "from-orange-600 to-red-600" },
  { label: "Settings", icon: Settings, path: "/admin/settings", color: "from-stone-500 to-orange-500" },
];

const AdminLayout = () => {
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const activeItem = navItems.find((i) => i.path === location.pathname);

  return (
    <div className="min-h-screen bg-mesh">
      {/* Mobile Header */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-50 glass-strong px-4 py-3 flex items-center justify-between border-b border-primary/20">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" onClick={() => setSidebarOpen(!sidebarOpen)}>
            {sidebarOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-gradient-primary flex items-center justify-center glow-sm">
              <Sparkles className="h-4 w-4 text-white" />
            </div>
            <span className="font-bold text-lg text-gradient">Admin</span>
          </div>
        </div>
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-accent animate-pulse" />
        </Button>
      </div>

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed top-0 left-0 z-40 h-screen w-72 bg-sidebar border-r border-primary/10 transition-transform lg:translate-x-0",
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="p-6 border-b border-primary/10">
            <Link to="/admin" className="flex items-center gap-3 group">
              <div className="h-11 w-11 rounded-xl bg-gradient-primary flex items-center justify-center glow-sm group-hover:scale-110 transition-transform">
                <Sparkles className="h-6 w-6 text-white" />
              </div>
              <div>
                <span className="font-bold text-xl text-gradient block leading-tight">Admin Hub</span>
                <span className="text-[10px] text-muted-foreground uppercase tracking-widest">Control Center</span>
              </div>
            </Link>
          </div>

          {/* Search */}
          <div className="px-4 pt-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Quick search..." className="pl-9 bg-muted/40 border-primary/10 focus-visible:ring-primary/40" />
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 overflow-y-auto p-4 space-y-1 mt-2">
            <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-widest px-3 mb-2">Menu</p>
            {navItems.map((item) => {
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setSidebarOpen(false)}
                  className={cn(
                    "group relative flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all overflow-hidden",
                    isActive
                      ? "text-white shadow-glow-sm"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted/60"
                  )}
                >
                  {isActive && (
                    <span className={cn("absolute inset-0 bg-gradient-to-r opacity-100", item.color)} />
                  )}
                  <span className={cn(
                    "absolute left-0 top-1/2 -translate-y-1/2 h-6 w-1 rounded-r-full transition-all",
                    isActive ? "bg-white" : "bg-transparent group-hover:bg-primary/60"
                  )} />
                  <item.icon className={cn("relative h-5 w-5 transition-transform group-hover:scale-110", isActive && "drop-shadow")} />
                  <span className="relative">{item.label}</span>
                </Link>
              );
            })}
          </nav>

          {/* Upgrade card */}
          <div className="px-4 pb-3">
            <div className="relative overflow-hidden rounded-xl bg-gradient-primary p-4 glow-sm">
              <div className="absolute -right-4 -top-4 h-20 w-20 rounded-full bg-white/10 blur-2xl" />
              <Sparkles className="h-5 w-5 text-white mb-2" />
              <p className="text-sm font-bold text-white">Pro Tools</p>
              <p className="text-xs text-white/80 mt-0.5">Unlock advanced analytics & automations</p>
              <Button size="sm" variant="secondary" className="mt-3 w-full bg-white text-orange-600 hover:bg-white/90 font-semibold">
                Explore
              </Button>
            </div>
          </div>

          {/* Footer area */}
          <div className="p-4 border-t border-primary/10">
            <p className="text-xs text-muted-foreground text-center">
              CreativeHub Admin v1.0
            </p>
          </div>
        </div>
      </aside>

      {sidebarOpen && (
        <div className="fixed inset-0 z-30 bg-black/60 backdrop-blur-sm lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      {/* Top bar (desktop) */}
      <div className="hidden lg:flex fixed top-0 right-0 left-72 z-30 h-16 items-center justify-between px-8 glass-strong border-b border-primary/10">
        <div>
          <p className="text-xs text-muted-foreground">Welcome back</p>
          <h2 className="text-sm font-semibold flex items-center gap-2">
            {activeItem?.label ?? "Dashboard"}
            <span className="h-1.5 w-1.5 rounded-full bg-success animate-pulse" />
          </h2>
        </div>
        <div className="flex items-center gap-3">
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
      <main className="lg:ml-72 min-h-screen pt-16">
        <div className="p-6 lg:p-8 animate-fade-in">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default AdminLayout;
