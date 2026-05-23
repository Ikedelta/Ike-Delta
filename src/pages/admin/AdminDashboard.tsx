import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import {
  Users,
  Package,
  ShoppingCart,
  DollarSign,
  TrendingUp,
  Eye,
  Download,
  Star,
} from "lucide-react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
} from "recharts";

interface DashboardStats {
  totalUsers: number;
  totalProducts: number;
  totalOrders: number;
  totalRevenue: number;
  pendingProducts: number;
  activeSubscribers: number;
}

interface RecentActivity {
  id: string;
  action: string;
  entity_type: string;
  created_at: string;
  metadata: Record<string, unknown>;
}

const AdminDashboard = () => {
  const [stats, setStats] = useState<DashboardStats>({
    totalUsers: 0,
    totalProducts: 0,
    totalOrders: 0,
    totalRevenue: 0,
    pendingProducts: 0,
    activeSubscribers: 0,
  });
  const [recentActivity, setRecentActivity] = useState<RecentActivity[]>([]);
  const [loading, setLoading] = useState(true);

  // Sample chart data - replace with real data
  const revenueData = [
    { name: "Jan", revenue: 4000 },
    { name: "Feb", revenue: 3000 },
    { name: "Mar", revenue: 5000 },
    { name: "Apr", revenue: 4500 },
    { name: "May", revenue: 6000 },
    { name: "Jun", revenue: 5500 },
  ];

  const ordersData = [
    { name: "Mon", orders: 12 },
    { name: "Tue", orders: 19 },
    { name: "Wed", orders: 15 },
    { name: "Thu", orders: 22 },
    { name: "Fri", orders: 28 },
    { name: "Sat", orders: 18 },
    { name: "Sun", orders: 14 },
  ];

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      // Fetch counts in parallel
      const [
        usersResult,
        productsResult,
        ordersResult,
        pendingResult,
        subscribersResult,
        activityResult,
      ] = await Promise.all([
        supabase.from("profiles").select("id", { count: "exact", head: true }),
        supabase.from("products").select("id", { count: "exact", head: true }),
        supabase.from("purchases").select("amount"),
        supabase
          .from("products")
          .select("id", { count: "exact", head: true })
          .eq("status", "pending"),
        supabase
          .from("newsletter_subscribers")
          .select("id", { count: "exact", head: true })
          .eq("is_active", true),
        supabase
          .from("activity_logs")
          .select("*")
          .order("created_at", { ascending: false })
          .limit(10),
      ]);

      const totalRevenue =
        ordersResult.data?.reduce((sum, order) => sum + (order.amount || 0), 0) || 0;

      setStats({
        totalUsers: usersResult.count || 0,
        totalProducts: productsResult.count || 0,
        totalOrders: ordersResult.data?.length || 0,
        totalRevenue,
        pendingProducts: pendingResult.count || 0,
        activeSubscribers: subscribersResult.count || 0,
      });

      if (activityResult.data) {
        setRecentActivity(activityResult.data as RecentActivity[]);
      }
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
    } finally {
      setLoading(false);
    }
  };

  const statCards = [
    {
      title: "Total Users",
      value: stats.totalUsers,
      icon: Users,
      gradient: "from-orange-500 via-orange-600 to-red-500",
      change: "+12.5%",
    },
    {
      title: "Total Products",
      value: stats.totalProducts,
      icon: Package,
      gradient: "from-amber-500 via-orange-500 to-orange-600",
      change: "+8.2%",
    },
    {
      title: "Total Orders",
      value: stats.totalOrders,
      icon: ShoppingCart,
      gradient: "from-orange-400 via-orange-500 to-amber-600",
      change: "+23.1%",
    },
    {
      title: "Total Revenue",
      value: `₵${stats.totalRevenue.toLocaleString()}`,
      icon: DollarSign,
      gradient: "from-red-500 via-orange-600 to-amber-500",
      change: "+18.7%",
    },
    {
      title: "Pending Products",
      value: stats.pendingProducts,
      icon: Eye,
      gradient: "from-yellow-500 via-amber-500 to-orange-500",
      change: "+3",
    },
    {
      title: "Subscribers",
      value: stats.activeSubscribers,
      icon: TrendingUp,
      gradient: "from-orange-500 via-rose-500 to-red-500",
      change: "+45",
    },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary/20 border-t-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Hero header */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-primary p-8 glow-sm">
        <div className="absolute -right-12 -top-12 h-56 w-56 rounded-full bg-white/10 blur-3xl" />
        <div className="absolute -left-10 -bottom-16 h-48 w-48 rounded-full bg-accent/30 blur-3xl" />
        <div className="relative">
          <p className="text-white/80 text-sm font-medium">👋 Welcome back, Admin</p>
          <h1 className="text-3xl lg:text-4xl font-extrabold text-white mt-1">
            Your marketplace at a glance
          </h1>
          <p className="text-white/90 mt-2 max-w-xl">
            Monitor sales, manage products, and engage your community — all in one vibrant control center.
          </p>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {statCards.map((stat, i) => (
          <Card
            key={stat.title}
            className="relative overflow-hidden border-primary/10 card-hover group"
            style={{ animationDelay: `${i * 60}ms` }}
          >
            <div className={`absolute inset-0 bg-gradient-to-br ${stat.gradient} opacity-10 group-hover:opacity-20 transition-opacity`} />
            <div className={`absolute -right-6 -top-6 h-24 w-24 rounded-full bg-gradient-to-br ${stat.gradient} opacity-20 blur-2xl`} />
            <CardContent className="relative p-6">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-xs uppercase tracking-wider text-muted-foreground font-semibold">{stat.title}</p>
                  <p className="text-3xl font-extrabold mt-2">{stat.value}</p>
                  <div className="flex items-center gap-1.5 mt-2">
                    <span className="text-xs font-semibold text-success">{stat.change}</span>
                    <span className="text-xs text-muted-foreground">vs last month</span>
                  </div>
                </div>
                <div className={`p-3 rounded-xl bg-gradient-to-br ${stat.gradient} shadow-lg group-hover:scale-110 group-hover:rotate-6 transition-transform`}>
                  <stat.icon className="h-6 w-6 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="border-primary/10 overflow-hidden">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-gradient">Revenue Overview</CardTitle>
              <p className="text-xs text-muted-foreground mt-1">Last 6 months performance</p>
            </div>
            <div className="p-2 rounded-lg bg-primary/10">
              <TrendingUp className="h-4 w-4 text-primary" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={revenueData}>
                  <defs>
                    <linearGradient id="revGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="hsl(22 95% 58%)" stopOpacity={0.6} />
                      <stop offset="100%" stopColor="hsl(22 95% 58%)" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                  <XAxis dataKey="name" className="text-xs" stroke="hsl(var(--muted-foreground))" />
                  <YAxis className="text-xs" stroke="hsl(var(--muted-foreground))" />
                  <Tooltip
                    contentStyle={{
                      background: "hsl(var(--popover))",
                      border: "1px solid hsl(var(--primary) / 0.3)",
                      borderRadius: 12,
                    }}
                  />
                  <Area type="monotone" dataKey="revenue" stroke="hsl(22 95% 58%)" strokeWidth={3} fill="url(#revGrad)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card className="border-primary/10 overflow-hidden">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-gradient-accent">Weekly Orders</CardTitle>
              <p className="text-xs text-muted-foreground mt-1">Order volume this week</p>
            </div>
            <div className="p-2 rounded-lg bg-accent/10">
              <ShoppingCart className="h-4 w-4 text-accent" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={ordersData}>
                  <defs>
                    <linearGradient id="barGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="hsl(22 95% 58%)" />
                      <stop offset="100%" stopColor="hsl(14 90% 55%)" />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                  <XAxis dataKey="name" className="text-xs" stroke="hsl(var(--muted-foreground))" />
                  <YAxis className="text-xs" stroke="hsl(var(--muted-foreground))" />
                  <Tooltip
                    contentStyle={{
                      background: "hsl(var(--popover))",
                      border: "1px solid hsl(var(--primary) / 0.3)",
                      borderRadius: 12,
                    }}
                  />
                  <Bar dataKey="orders" fill="url(#barGrad)" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick actions */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: "Add Product", icon: Package, href: "/admin/products" },
          { label: "Send SMS", icon: Download, href: "/admin/sms" },
          { label: "New Newsletter", icon: Star, href: "/admin/newsletters" },
          { label: "View Reports", icon: TrendingUp, href: "/admin/analytics" },
        ].map((qa) => (
          <a
            key={qa.label}
            href={qa.href}
            className="group relative overflow-hidden rounded-xl p-5 bg-card border border-primary/10 hover:border-primary/40 transition-all hover:-translate-y-1 hover:shadow-glow-sm"
          >
            <div className="absolute -right-4 -top-4 h-20 w-20 rounded-full bg-gradient-primary opacity-10 group-hover:opacity-30 blur-2xl transition" />
            <qa.icon className="h-6 w-6 text-primary mb-3 group-hover:scale-110 transition-transform" />
            <p className="font-semibold text-sm">{qa.label}</p>
            <p className="text-xs text-muted-foreground mt-0.5">Quick action</p>
          </a>
        ))}
      </div>

      {/* Recent Activity */}
      <Card className="border-primary/10">
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Recent Activity</CardTitle>
            <p className="text-xs text-muted-foreground mt-1">Live admin events</p>
          </div>
          <span className="flex items-center gap-2 text-xs text-muted-foreground">
            <span className="h-2 w-2 rounded-full bg-success animate-pulse" />
            Live
          </span>
        </CardHeader>
        <CardContent>
          {recentActivity.length === 0 ? (
            <div className="text-center py-12">
              <div className="inline-flex p-4 rounded-full bg-primary/10 mb-3">
                <Star className="h-6 w-6 text-primary" />
              </div>
              <p className="text-muted-foreground">No recent activity yet.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {recentActivity.map((activity) => (
                <div
                  key={activity.id}
                  className="flex items-center gap-4 p-3 rounded-xl bg-muted/40 hover:bg-muted/70 transition-colors border border-transparent hover:border-primary/20"
                >
                  <div className="h-10 w-10 rounded-xl bg-gradient-primary flex items-center justify-center glow-sm">
                    <Star className="h-5 w-5 text-white" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium capitalize">
                      {activity.action} <span className="text-primary">·</span> {activity.entity_type}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {new Date(activity.created_at).toLocaleString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminDashboard;
