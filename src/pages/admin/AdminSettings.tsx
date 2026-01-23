import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Save, Key, Globe, Bell, Shield, Palette } from "lucide-react";

interface Settings {
  site_name: string;
  site_description: string;
  contact_email: string;
  enable_registration: boolean;
  enable_reviews: boolean;
  maintenance_mode: boolean;
  commission_rate: number;
}

const AdminSettings = () => {
  const [settings, setSettings] = useState<Settings>({
    site_name: "Digital Marketplace",
    site_description: "Your one-stop shop for digital resources",
    contact_email: "",
    enable_registration: true,
    enable_reviews: true,
    maintenance_mode: false,
    commission_rate: 10,
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const { data, error } = await supabase
        .from("admin_settings")
        .select("key, value");

      if (error) throw error;

      if (data) {
        const newSettings = { ...settings };
        data.forEach((item) => {
          if (item.key === "site_name" && typeof item.value === "string") {
            newSettings.site_name = item.value;
          }
          // Add more specific key handlers as needed
        });
        setSettings(newSettings);
      }
    } catch (error) {
      console.error("Error fetching settings:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);

    try {
      for (const [key, value] of Object.entries(settings)) {
        const { error } = await supabase.from("admin_settings").upsert(
          {
            key,
            value: value as unknown as Record<string, unknown>,
          },
          { onConflict: "key" }
        );

        if (error) throw error;
      }

      toast({
        title: "Settings Saved",
        description: "Your settings have been saved successfully.",
      });
    } catch (error) {
      console.error("Error saving settings:", error);
      toast({
        title: "Error",
        description: "Failed to save settings.",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">Settings</h1>
          <p className="text-muted-foreground">
            Configure your platform settings and integrations.
          </p>
        </div>
        <Button onClick={handleSave} disabled={saving}>
          <Save className="h-4 w-4 mr-2" />
          {saving ? "Saving..." : "Save Changes"}
        </Button>
      </div>

      <Tabs defaultValue="general" className="space-y-6">
        <TabsList>
          <TabsTrigger value="general">
            <Globe className="h-4 w-4 mr-2" />
            General
          </TabsTrigger>
          <TabsTrigger value="integrations">
            <Key className="h-4 w-4 mr-2" />
            Integrations
          </TabsTrigger>
          <TabsTrigger value="notifications">
            <Bell className="h-4 w-4 mr-2" />
            Notifications
          </TabsTrigger>
          <TabsTrigger value="security">
            <Shield className="h-4 w-4 mr-2" />
            Security
          </TabsTrigger>
        </TabsList>

        <TabsContent value="general" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Site Information</CardTitle>
              <CardDescription>
                Basic information about your platform.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="site_name">Site Name</Label>
                <Input
                  id="site_name"
                  value={settings.site_name}
                  onChange={(e) =>
                    setSettings({ ...settings, site_name: e.target.value })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="site_description">Site Description</Label>
                <Input
                  id="site_description"
                  value={settings.site_description}
                  onChange={(e) =>
                    setSettings({ ...settings, site_description: e.target.value })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="contact_email">Contact Email</Label>
                <Input
                  id="contact_email"
                  type="email"
                  value={settings.contact_email}
                  onChange={(e) =>
                    setSettings({ ...settings, contact_email: e.target.value })
                  }
                  placeholder="support@example.com"
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Platform Settings</CardTitle>
              <CardDescription>
                Control platform features and functionality.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <Label>Enable User Registration</Label>
                  <p className="text-sm text-muted-foreground">
                    Allow new users to sign up for the platform.
                  </p>
                </div>
                <Switch
                  checked={settings.enable_registration}
                  onCheckedChange={(checked) =>
                    setSettings({ ...settings, enable_registration: checked })
                  }
                />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div>
                  <Label>Enable Product Reviews</Label>
                  <p className="text-sm text-muted-foreground">
                    Allow users to leave reviews on products.
                  </p>
                </div>
                <Switch
                  checked={settings.enable_reviews}
                  onCheckedChange={(checked) =>
                    setSettings({ ...settings, enable_reviews: checked })
                  }
                />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div>
                  <Label>Maintenance Mode</Label>
                  <p className="text-sm text-muted-foreground">
                    Put the site in maintenance mode (only admins can access).
                  </p>
                </div>
                <Switch
                  checked={settings.maintenance_mode}
                  onCheckedChange={(checked) =>
                    setSettings({ ...settings, maintenance_mode: checked })
                  }
                />
              </div>
              <Separator />
              <div className="space-y-2">
                <Label htmlFor="commission">Commission Rate (%)</Label>
                <Input
                  id="commission"
                  type="number"
                  min="0"
                  max="100"
                  value={settings.commission_rate}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      commission_rate: parseInt(e.target.value) || 0,
                    })
                  }
                  className="w-32"
                />
                <p className="text-sm text-muted-foreground">
                  Platform commission on each sale.
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="integrations" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>SMS Integration (Africa's Talking)</CardTitle>
              <CardDescription>
                Configure Africa's Talking for SMS notifications.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="p-4 bg-yellow-500/10 text-yellow-700 dark:text-yellow-300 rounded-lg">
                <p className="text-sm">
                  <strong>Note:</strong> Add your Africa's Talking API credentials via the secrets manager to enable SMS functionality.
                </p>
              </div>
              <div className="space-y-2">
                <Label>API Key</Label>
                <Input
                  type="password"
                  placeholder="••••••••••••••••"
                  disabled
                />
                <p className="text-xs text-muted-foreground">
                  Stored securely as AFRICASTALKING_API_KEY
                </p>
              </div>
              <div className="space-y-2">
                <Label>Username</Label>
                <Input placeholder="sandbox" disabled />
                <p className="text-xs text-muted-foreground">
                  Stored securely as AFRICASTALKING_USERNAME
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Email Integration (Resend)</CardTitle>
              <CardDescription>
                Configure Resend for email newsletters and notifications.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="p-4 bg-yellow-500/10 text-yellow-700 dark:text-yellow-300 rounded-lg">
                <p className="text-sm">
                  <strong>Note:</strong> Add your Resend API key via the secrets manager to enable email functionality.
                </p>
              </div>
              <div className="space-y-2">
                <Label>API Key</Label>
                <Input
                  type="password"
                  placeholder="••••••••••••••••"
                  disabled
                />
                <p className="text-xs text-muted-foreground">
                  Stored securely as RESEND_API_KEY
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Payment Integration (Paystack)</CardTitle>
              <CardDescription>
                Configure Paystack for payment processing.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Public Key</Label>
                <Input placeholder="pk_live_..." disabled />
              </div>
              <div className="space-y-2">
                <Label>Secret Key</Label>
                <Input
                  type="password"
                  placeholder="••••••••••••••••"
                  disabled
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notifications" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Email Notifications</CardTitle>
              <CardDescription>
                Configure when to send email notifications.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <Label>New User Signup</Label>
                  <p className="text-sm text-muted-foreground">
                    Send welcome email to new users.
                  </p>
                </div>
                <Switch defaultChecked />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div>
                  <Label>Purchase Confirmation</Label>
                  <p className="text-sm text-muted-foreground">
                    Send receipt after successful purchase.
                  </p>
                </div>
                <Switch defaultChecked />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div>
                  <Label>Product Approved</Label>
                  <p className="text-sm text-muted-foreground">
                    Notify seller when product is approved.
                  </p>
                </div>
                <Switch defaultChecked />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div>
                  <Label>New Sale Notification</Label>
                  <p className="text-sm text-muted-foreground">
                    Notify seller when their product is purchased.
                  </p>
                </div>
                <Switch defaultChecked />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="security" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Security Settings</CardTitle>
              <CardDescription>
                Configure security options for your platform.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <Label>Require Email Verification</Label>
                  <p className="text-sm text-muted-foreground">
                    Users must verify their email before accessing the platform.
                  </p>
                </div>
                <Switch />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div>
                  <Label>Two-Factor Authentication</Label>
                  <p className="text-sm text-muted-foreground">
                    Allow users to enable 2FA for their accounts.
                  </p>
                </div>
                <Switch />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div>
                  <Label>Admin Action Logging</Label>
                  <p className="text-sm text-muted-foreground">
                    Log all admin actions for audit purposes.
                  </p>
                </div>
                <Switch defaultChecked />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminSettings;
