import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { 
  Package, 
  Download, 
  Heart, 
  DollarSign,
  TrendingUp,
  Eye,
  Star,
  ArrowUpRight,
  Clock
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface DashboardStats {
  totalProducts: number;
  totalDownloads: number;
  totalFavorites: number;
  totalEarnings: number;
}

interface RecentActivity {
  id: string;
  type: 'purchase' | 'download' | 'review';
  title: string;
  time: string;
}

const DashboardOverview = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState<DashboardStats>({
    totalProducts: 0,
    totalDownloads: 0,
    totalFavorites: 0,
    totalEarnings: 0,
  });
  const [recentProducts, setRecentProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchDashboardData();
    }
  }, [user]);

  const fetchDashboardData = async () => {
    try {
      const { data: purchases } = await supabase
        .from("purchases")
        .select("*")
        .eq("user_id", user?.id);

      const { data: favorites } = await supabase
        .from("favorites")
        .select("*")
        .eq("user_id", user?.id);

      setStats({
        totalProducts: 0,
        totalDownloads: purchases?.length || 0,
        totalFavorites: favorites?.length || 0,
        totalEarnings: 0,
      });
      setRecentProducts([]);
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
    } finally {
      setLoading(false);
    }
  };


  const statCards = [
    {
      title: "Downloads",
      value: stats.totalDownloads,
      icon: Download,
      color: "from-accent to-accent/50",
      change: "+8%"
    },
    {
      title: "Favorites",
      value: stats.totalFavorites,
      icon: Heart,
      color: "from-orange-500 to-red-500/60",
      change: "+24%"
    },
    {
      title: "Orders",
      value: stats.totalDownloads,
      icon: Package,
      color: "from-primary to-primary/50",
      change: "+12%"
    },
  ];


  return (
    <div className="p-6 lg:p-8 pb-24 lg:pb-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="font-display text-3xl font-bold text-foreground mb-2">
          Welcome back, {user?.email?.split("@")[0]}!
        </h1>
        <p className="text-muted-foreground">Here's what's happening with your creative assets</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {statCards.map((stat, index) => (
          <Card key={index} className="bg-card border-border card-hover">
            <CardContent className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center`}>
                  <stat.icon className="w-6 h-6 text-white" />
                </div>
                <span className="flex items-center text-sm text-green-500 font-medium">
                  <TrendingUp className="w-4 h-4 mr-1" />
                  {stat.change}
                </span>
              </div>
              <h3 className="text-2xl font-bold text-foreground mb-1">{stat.value}</h3>
              <p className="text-sm text-muted-foreground">{stat.title}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Downloads */}
        <Card className="lg:col-span-2 bg-card border-border">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="font-display text-lg">Recent Downloads</CardTitle>
            <Link to="/dashboard/downloads">
              <Button variant="ghost" size="sm" className="text-primary">
                View All <ArrowUpRight className="w-4 h-4 ml-1" />
              </Button>
            </Link>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="h-16 bg-muted rounded-lg animate-pulse" />
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <Package className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
                <p className="text-muted-foreground mb-4">No downloads yet</p>
                <Link to="/explore">
                  <Button variant="hero" size="sm">Browse Marketplace</Button>
                </Link>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="font-display text-lg">Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Link to="/explore" className="block">
              <Button variant="outline" className="w-full justify-start border-border hover:border-primary/50">
                <Download className="w-4 h-4 mr-3" />
                Browse Products
              </Button>
            </Link>
            <Link to="/dashboard/favorites" className="block">
              <Button variant="outline" className="w-full justify-start border-border hover:border-primary/50">
                <Heart className="w-4 h-4 mr-3" />
                View Favorites
              </Button>
            </Link>
            <Link to="/dashboard/settings" className="block">
              <Button variant="outline" className="w-full justify-start border-border hover:border-primary/50">
                <Star className="w-4 h-4 mr-3" />
                Update Profile
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>


      {/* Recent Activity */}
      <Card className="mt-6 bg-card border-border">
        <CardHeader>
          <CardTitle className="font-display text-lg">Recent Activity</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-muted-foreground">
            <Clock className="w-12 h-12 mx-auto mb-3 opacity-50" />
            <p>Your recent activity will appear here</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DashboardOverview;
