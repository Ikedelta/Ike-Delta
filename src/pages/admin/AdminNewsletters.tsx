import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { Plus, Send, Mail, Users, Eye, Trash2, Clock } from "lucide-react";

interface Newsletter {
  id: string;
  subject: string;
  content: string;
  status: string | null;
  sent_at: string | null;
  recipient_count: number | null;
  created_at: string;
}

interface Subscriber {
  id: string;
  email: string;
  name: string | null;
  is_active: boolean | null;
  subscribed_at: string;
}

const AdminNewsletters = () => {
  const { user } = useAuth();
  const [newsletters, setNewsletters] = useState<Newsletter[]>([]);
  const [subscribers, setSubscribers] = useState<Subscriber[]>([]);
  const [loading, setLoading] = useState(true);
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [previewDialogOpen, setPreviewDialogOpen] = useState(false);
  const [selectedNewsletter, setSelectedNewsletter] = useState<Newsletter | null>(null);
  const [formData, setFormData] = useState({
    subject: "",
    content: "",
  });
  const { toast } = useToast();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [newslettersResult, subscribersResult] = await Promise.all([
        supabase
          .from("newsletters")
          .select("*")
          .order("created_at", { ascending: false }),
        supabase
          .from("newsletter_subscribers")
          .select("*")
          .order("subscribed_at", { ascending: false }),
      ]);

      if (newslettersResult.data) setNewsletters(newslettersResult.data);
      if (subscribersResult.data) setSubscribers(subscribersResult.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateNewsletter = async (status: "draft" | "sent") => {
    if (!formData.subject || !formData.content) {
      toast({
        title: "Validation Error",
        description: "Subject and content are required.",
        variant: "destructive",
      });
      return;
    }

    try {
      const activeSubscribers = subscribers.filter((s) => s.is_active);

      const { error } = await supabase.from("newsletters").insert({
        subject: formData.subject,
        content: formData.content,
        status,
        created_by: user?.id,
        recipient_count: status === "sent" ? activeSubscribers.length : 0,
        sent_at: status === "sent" ? new Date().toISOString() : null,
      });

      if (error) throw error;

      toast({
        title: status === "sent" ? "Newsletter Sent" : "Draft Saved",
        description:
          status === "sent"
            ? `Newsletter queued for ${activeSubscribers.length} subscribers. Configure Resend API to enable sending.`
            : "Newsletter saved as draft.",
      });

      setCreateDialogOpen(false);
      setFormData({ subject: "", content: "" });
      fetchData();
    } catch (error) {
      console.error("Error creating newsletter:", error);
      toast({
        title: "Error",
        description: "Failed to create newsletter.",
        variant: "destructive",
      });
    }
  };

  const handleDeleteNewsletter = async (newsletterId: string) => {
    try {
      const { error } = await supabase
        .from("newsletters")
        .delete()
        .eq("id", newsletterId);

      if (error) throw error;

      toast({
        title: "Newsletter Deleted",
        description: "Newsletter has been deleted.",
      });

      fetchData();
    } catch (error) {
      console.error("Error deleting newsletter:", error);
      toast({
        title: "Error",
        description: "Failed to delete newsletter.",
        variant: "destructive",
      });
    }
  };

  const handleDeleteSubscriber = async (subscriberId: string) => {
    try {
      const { error } = await supabase
        .from("newsletter_subscribers")
        .delete()
        .eq("id", subscriberId);

      if (error) throw error;

      toast({
        title: "Subscriber Removed",
        description: "Subscriber has been removed.",
      });

      fetchData();
    } catch (error) {
      console.error("Error removing subscriber:", error);
      toast({
        title: "Error",
        description: "Failed to remove subscriber.",
        variant: "destructive",
      });
    }
  };

  const getStatusBadge = (status: string | null) => {
    const statusConfig: Record<string, { variant: "default" | "secondary" | "destructive" | "outline"; label: string }> = {
      sent: { variant: "default", label: "Sent" },
      draft: { variant: "secondary", label: "Draft" },
      scheduled: { variant: "outline", label: "Scheduled" },
      failed: { variant: "destructive", label: "Failed" },
    };

    const config = statusConfig[status || "draft"] || statusConfig.draft;
    return <Badge variant={config.variant}>{config.label}</Badge>;
  };

  const activeSubscribersCount = subscribers.filter((s) => s.is_active).length;

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
          <h1 className="text-3xl font-bold">Newsletter Management</h1>
          <p className="text-muted-foreground">
            Create and send newsletters to your subscribers via Resend.
          </p>
        </div>
        <Button onClick={() => setCreateDialogOpen(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Create Newsletter
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <p className="text-sm text-muted-foreground">Total Subscribers</p>
            <p className="text-2xl font-bold">{subscribers.length}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <p className="text-sm text-muted-foreground">Active Subscribers</p>
            <p className="text-2xl font-bold">{activeSubscribersCount}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <p className="text-sm text-muted-foreground">Newsletters Sent</p>
            <p className="text-2xl font-bold">
              {newsletters.filter((n) => n.status === "sent").length}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <p className="text-sm text-muted-foreground">Drafts</p>
            <p className="text-2xl font-bold">
              {newsletters.filter((n) => n.status === "draft").length}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Newsletters */}
      <Card>
        <CardHeader>
          <CardTitle>Newsletters</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Subject</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Recipients</TableHead>
                <TableHead>Created</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {newsletters.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-8">
                    No newsletters yet. Create your first newsletter.
                  </TableCell>
                </TableRow>
              ) : (
                newsletters.map((newsletter) => (
                  <TableRow key={newsletter.id}>
                    <TableCell className="font-medium">
                      {newsletter.subject}
                    </TableCell>
                    <TableCell>{getStatusBadge(newsletter.status)}</TableCell>
                    <TableCell>{newsletter.recipient_count || 0}</TableCell>
                    <TableCell>
                      {new Date(newsletter.created_at).toLocaleDateString()}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => {
                            setSelectedNewsletter(newsletter);
                            setPreviewDialogOpen(true);
                          }}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDeleteNewsletter(newsletter.id)}
                        >
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Subscribers */}
      <Card>
        <CardHeader>
          <CardTitle>Subscribers</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Email</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Subscribed</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {subscribers.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-8">
                    No subscribers yet.
                  </TableCell>
                </TableRow>
              ) : (
                subscribers.map((subscriber) => (
                  <TableRow key={subscriber.id}>
                    <TableCell>{subscriber.email}</TableCell>
                    <TableCell>{subscriber.name || "-"}</TableCell>
                    <TableCell>
                      <Badge
                        variant={subscriber.is_active ? "default" : "secondary"}
                      >
                        {subscriber.is_active ? "Active" : "Inactive"}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {new Date(subscriber.subscribed_at).toLocaleDateString()}
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDeleteSubscriber(subscriber.id)}
                      >
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Create Newsletter Dialog */}
      <Dialog open={createDialogOpen} onOpenChange={setCreateDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Create Newsletter</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="subject">Subject *</Label>
              <Input
                id="subject"
                value={formData.subject}
                onChange={(e) =>
                  setFormData({ ...formData, subject: e.target.value })
                }
                placeholder="Newsletter subject"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="content">Content *</Label>
              <Textarea
                id="content"
                value={formData.content}
                onChange={(e) =>
                  setFormData({ ...formData, content: e.target.value })
                }
                placeholder="Write your newsletter content... (HTML supported)"
                rows={10}
              />
            </div>
            <p className="text-sm text-muted-foreground">
              This newsletter will be sent to {activeSubscribersCount} active
              subscribers.
            </p>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setCreateDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button
              variant="secondary"
              onClick={() => handleCreateNewsletter("draft")}
            >
              <Clock className="h-4 w-4 mr-2" />
              Save Draft
            </Button>
            <Button onClick={() => handleCreateNewsletter("sent")}>
              <Send className="h-4 w-4 mr-2" />
              Send Now
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Preview Dialog */}
      <Dialog open={previewDialogOpen} onOpenChange={setPreviewDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>{selectedNewsletter?.subject}</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <div
              className="prose prose-sm max-w-none"
              dangerouslySetInnerHTML={{
                __html: selectedNewsletter?.content || "",
              }}
            />
          </div>
          <DialogFooter>
            <Button onClick={() => setPreviewDialogOpen(false)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminNewsletters;
