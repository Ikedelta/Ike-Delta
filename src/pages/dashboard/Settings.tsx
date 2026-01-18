import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { 
  User, 
  Mail, 
  MapPin, 
  Globe, 
  Camera,
  Save,
  Loader2,
  Lock,
  Bell,
  CreditCard
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";

interface Profile {
  full_name: string;
  bio: string;
  website: string;
  location: string;
  avatar_url: string;
}

const Settings = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [profile, setProfile] = useState<Profile>({
    full_name: "",
    bio: "",
    website: "",
    location: "",
    avatar_url: "",
  });

  useEffect(() => {
    if (user) {
      fetchProfile();
    }
  }, [user]);

  const fetchProfile = async () => {
    try {
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("user_id", user?.id)
        .single();

      if (error && error.code !== "PGRST116") throw error;

      if (data) {
        setProfile({
          full_name: data.full_name || "",
          bio: data.bio || "",
          website: data.website || "",
          location: data.location || "",
          avatar_url: data.avatar_url || "",
        });
      }
    } catch (error) {
      console.error("Error fetching profile:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveProfile = async () => {
    setSaving(true);
    try {
      const { error } = await supabase
        .from("profiles")
        .upsert({
          user_id: user?.id,
          ...profile,
          updated_at: new Date().toISOString(),
        });

      if (error) throw error;

      toast({
        title: "Profile Updated",
        description: "Your profile has been saved successfully.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save profile. Please try again.",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="p-6 lg:p-8 flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="p-6 lg:p-8 pb-24 lg:pb-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="font-display text-3xl font-bold text-foreground mb-2">Settings</h1>
        <p className="text-muted-foreground">Manage your account and preferences</p>
      </div>

      <Tabs defaultValue="profile" className="space-y-6">
        <TabsList className="bg-muted/50 border border-border">
          <TabsTrigger value="profile" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
            Profile
          </TabsTrigger>
          <TabsTrigger value="security" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
            Security
          </TabsTrigger>
          <TabsTrigger value="notifications" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
            Notifications
          </TabsTrigger>
          <TabsTrigger value="billing" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
            Billing
          </TabsTrigger>
        </TabsList>

        {/* Profile Tab */}
        <TabsContent value="profile">
          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle className="font-display">Profile Information</CardTitle>
              <CardDescription>Update your personal details</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Avatar */}
              <div className="flex items-center gap-6">
                <div className="relative">
                  <div className="w-24 h-24 rounded-full bg-gradient-primary flex items-center justify-center">
                    {profile.avatar_url ? (
                      <img 
                        src={profile.avatar_url} 
                        alt="Avatar" 
                        className="w-full h-full rounded-full object-cover"
                      />
                    ) : (
                      <span className="text-3xl font-bold text-primary-foreground">
                        {user?.email?.charAt(0).toUpperCase()}
                      </span>
                    )}
                  </div>
                  <button className="absolute bottom-0 right-0 w-8 h-8 rounded-full bg-primary flex items-center justify-center text-primary-foreground shadow-lg hover:bg-primary/90 transition-colors">
                    <Camera className="w-4 h-4" />
                  </button>
                </div>
                <div>
                  <h3 className="font-medium text-foreground">{profile.full_name || "Your Name"}</h3>
                  <p className="text-sm text-muted-foreground">{user?.email}</p>
                </div>
              </div>

              {/* Form */}
              <div className="grid gap-6 sm:grid-cols-2">
                <div>
                  <label className="text-sm font-medium text-foreground mb-2 block">Full Name</label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                    <Input
                      value={profile.full_name}
                      onChange={(e) => setProfile({ ...profile, full_name: e.target.value })}
                      placeholder="John Doe"
                      className="pl-10 bg-muted border-border"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium text-foreground mb-2 block">Email</label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                    <Input
                      value={user?.email || ""}
                      disabled
                      className="pl-10 bg-muted border-border opacity-60"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium text-foreground mb-2 block">Website</label>
                  <div className="relative">
                    <Globe className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                    <Input
                      value={profile.website}
                      onChange={(e) => setProfile({ ...profile, website: e.target.value })}
                      placeholder="https://yourwebsite.com"
                      className="pl-10 bg-muted border-border"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium text-foreground mb-2 block">Location</label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                    <Input
                      value={profile.location}
                      onChange={(e) => setProfile({ ...profile, location: e.target.value })}
                      placeholder="Accra, Ghana"
                      className="pl-10 bg-muted border-border"
                    />
                  </div>
                </div>

                <div className="sm:col-span-2">
                  <label className="text-sm font-medium text-foreground mb-2 block">Bio</label>
                  <Textarea
                    value={profile.bio}
                    onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
                    placeholder="Tell us about yourself..."
                    className="bg-muted border-border min-h-[100px]"
                  />
                </div>
              </div>

              <Button 
                variant="hero" 
                className="glow-sm"
                onClick={handleSaveProfile}
                disabled={saving}
              >
                {saving ? (
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                ) : (
                  <Save className="w-4 h-4 mr-2" />
                )}
                Save Changes
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Security Tab */}
        <TabsContent value="security">
          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle className="font-display flex items-center gap-2">
                <Lock className="w-5 h-5" />
                Security Settings
              </CardTitle>
              <CardDescription>Manage your password and security preferences</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <label className="text-sm font-medium text-foreground mb-2 block">Current Password</label>
                <Input type="password" placeholder="••••••••" className="bg-muted border-border" />
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="text-sm font-medium text-foreground mb-2 block">New Password</label>
                  <Input type="password" placeholder="••••••••" className="bg-muted border-border" />
                </div>
                <div>
                  <label className="text-sm font-medium text-foreground mb-2 block">Confirm Password</label>
                  <Input type="password" placeholder="••••••••" className="bg-muted border-border" />
                </div>
              </div>
              <Button variant="outline" className="border-border">Update Password</Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Notifications Tab */}
        <TabsContent value="notifications">
          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle className="font-display flex items-center gap-2">
                <Bell className="w-5 h-5" />
                Notification Preferences
              </CardTitle>
              <CardDescription>Control how you receive notifications</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {[
                { title: "Email Notifications", desc: "Receive email updates about your account" },
                { title: "Purchase Alerts", desc: "Get notified when someone purchases your product" },
                { title: "Marketing Emails", desc: "Receive tips, updates, and promotional content" },
                { title: "New Features", desc: "Be the first to know about new features" },
              ].map((item, i) => (
                <div key={i} className="flex items-center justify-between py-3 border-b border-border last:border-0">
                  <div>
                    <h4 className="font-medium text-foreground">{item.title}</h4>
                    <p className="text-sm text-muted-foreground">{item.desc}</p>
                  </div>
                  <Switch />
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Billing Tab */}
        <TabsContent value="billing">
          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle className="font-display flex items-center gap-2">
                <CreditCard className="w-5 h-5" />
                Billing & Subscription
              </CardTitle>
              <CardDescription>Manage your subscription and payment methods</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="glass rounded-xl p-6 mb-6">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <span className="text-xs text-muted-foreground uppercase tracking-wider">Current Plan</span>
                    <h3 className="text-2xl font-bold text-foreground">Free</h3>
                  </div>
                  <span className="px-3 py-1 rounded-full bg-muted text-muted-foreground text-sm">Active</span>
                </div>
                <p className="text-muted-foreground mb-4">
                  You're on the free plan. Upgrade to unlock premium features.
                </p>
                <Button variant="hero" className="glow-sm">Upgrade to Pro</Button>
              </div>
              
              <div className="text-center py-8 text-muted-foreground">
                <CreditCard className="w-12 h-12 mx-auto mb-3 opacity-50" />
                <p>No payment methods added</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Settings;
