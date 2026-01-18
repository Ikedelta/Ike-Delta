import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Bell, Check, Trash2, Info, AlertTriangle, CheckCircle, XCircle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  is_read: boolean;
  link: string | null;
  created_at: string;
}

const Notifications = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchNotifications();
    }
  }, [user]);

  const fetchNotifications = async () => {
    try {
      const { data, error } = await supabase
        .from("notifications")
        .select("*")
        .eq("user_id", user?.id)
        .order("created_at", { ascending: false });

      if (error) throw error;
      setNotifications((data || []) as Notification[]);
    } catch (error) {
      console.error("Error fetching notifications:", error);
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = async (id: string) => {
    try {
      const { error } = await supabase
        .from("notifications")
        .update({ is_read: true })
        .eq("id", id);

      if (error) throw error;

      setNotifications(notifications.map(n => 
        n.id === id ? { ...n, is_read: true } : n
      ));
    } catch (error) {
      console.error("Error marking as read:", error);
    }
  };

  const markAllAsRead = async () => {
    try {
      const { error } = await supabase
        .from("notifications")
        .update({ is_read: true })
        .eq("user_id", user?.id)
        .eq("is_read", false);

      if (error) throw error;

      setNotifications(notifications.map(n => ({ ...n, is_read: true })));
      toast({
        title: "All Marked as Read",
        description: "All notifications have been marked as read.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to mark notifications as read.",
        variant: "destructive",
      });
    }
  };

  const getIcon = (type: string) => {
    switch (type) {
      case 'success':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'warning':
        return <AlertTriangle className="w-5 h-5 text-yellow-500" />;
      case 'error':
        return <XCircle className="w-5 h-5 text-red-500" />;
      default:
        return <Info className="w-5 h-5 text-primary" />;
    }
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    return `${days}d ago`;
  };

  const unreadCount = notifications.filter(n => !n.is_read).length;

  return (
    <div className="p-6 lg:p-8 pb-24 lg:pb-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <div>
          <h1 className="font-display text-3xl font-bold text-foreground mb-2">Notifications</h1>
          <p className="text-muted-foreground">
            {unreadCount > 0 ? `${unreadCount} unread notifications` : "You're all caught up!"}
          </p>
        </div>
        {unreadCount > 0 && (
          <Button variant="outline" className="border-border" onClick={markAllAsRead}>
            <Check className="w-4 h-4 mr-2" />
            Mark All as Read
          </Button>
        )}
      </div>

      {/* Notifications List */}
      {loading ? (
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <Card key={i} className="bg-card border-border">
              <CardContent className="p-4">
                <div className="flex gap-4">
                  <div className="w-10 h-10 bg-muted rounded-full animate-pulse" />
                  <div className="flex-1">
                    <div className="h-5 bg-muted rounded animate-pulse mb-2 w-1/3" />
                    <div className="h-4 bg-muted rounded animate-pulse w-2/3" />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : notifications.length > 0 ? (
        <div className="space-y-3">
          {notifications.map((notification) => (
            <Card 
              key={notification.id} 
              className={`bg-card border-border transition-all cursor-pointer hover:border-primary/50 ${
                !notification.is_read ? 'border-l-4 border-l-primary' : ''
              }`}
              onClick={() => markAsRead(notification.id)}
            >
              <CardContent className="p-4">
                <div className="flex gap-4">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                    !notification.is_read ? 'bg-primary/10' : 'bg-muted'
                  }`}>
                    {getIcon(notification.type)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <h4 className={`font-medium ${!notification.is_read ? 'text-foreground' : 'text-muted-foreground'}`}>
                        {notification.title}
                      </h4>
                      <span className="text-xs text-muted-foreground whitespace-nowrap">
                        {formatTime(notification.created_at)}
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">{notification.message}</p>
                    {notification.link && (
                      <a 
                        href={notification.link} 
                        className="text-sm text-primary hover:underline mt-2 inline-block"
                        onClick={(e) => e.stopPropagation()}
                      >
                        View Details →
                      </a>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card className="bg-card border-border">
          <CardContent className="flex flex-col items-center justify-center py-16">
            <div className="w-20 h-20 rounded-full bg-muted flex items-center justify-center mb-6">
              <Bell className="w-10 h-10 text-muted-foreground" />
            </div>
            <h3 className="font-display text-xl font-semibold text-foreground mb-2">
              No notifications yet
            </h3>
            <p className="text-muted-foreground text-center max-w-sm">
              We'll notify you about important updates and activity
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default Notifications;
