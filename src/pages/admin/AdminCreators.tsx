import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Loader2, CheckCircle2, XCircle, ExternalLink, Palette } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const STATUS_TONE: Record<string, string> = {
  pending: "bg-warning/15 text-warning",
  approved: "bg-success/15 text-success",
  rejected: "bg-destructive/15 text-destructive",
};

const AdminCreators = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const qc = useQueryClient();
  const [notes, setNotes] = useState<Record<string, string>>({});
  const [working, setWorking] = useState<string | null>(null);
  const [filter, setFilter] = useState<"pending" | "approved" | "rejected" | "all">("pending");

  const { data: applications = [], isLoading } = useQuery({
    queryKey: ["admin-creator-applications", filter],
    queryFn: async () => {
      let q = supabase
        .from("creator_applications")
        .select("*")
        .order("created_at", { ascending: false });
      if (filter !== "all") q = q.eq("status", filter);
      const { data, error } = await q;
      if (error) throw error;
      return data ?? [];
    },
  });

  const decide = async (
    app: { id: string; user_id: string; display_name: string; specialty: string; bio: string },
    status: "approved" | "rejected"
  ) => {
    setWorking(app.id);
    try {
      const { error } = await supabase
        .from("creator_applications")
        .update({
          status,
          reviewed_by: user?.id ?? null,
          reviewed_at: new Date().toISOString(),
          admin_note: notes[app.id]?.trim() || null,
        })
        .eq("id", app.id);
      if (error) throw error;

      if (status === "approved") {
        const { error: profileError } = await supabase
          .from("profiles")
          .update({ is_creator: true, specialty: app.specialty })
          .eq("user_id", app.user_id);
        if (profileError) throw profileError;

        const { error: roleError } = await supabase
          .from("user_roles")
          .insert({ user_id: app.user_id, role: "creator" });
        if (roleError && !roleError.message.includes("duplicate")) throw roleError;
      }

      toast({
        title: status === "approved" ? "Creator approved" : "Application rejected",
        description: app.display_name,
      });
      qc.invalidateQueries({ queryKey: ["admin-creator-applications"] });
    } catch (e) {
      toast({
        title: "Action failed",
        description: e instanceof Error ? e.message : "Try again",
        variant: "destructive",
      });
    } finally {
      setWorking(null);
    }
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <div className="mb-6">
        <h1 className="font-display text-2xl sm:text-3xl font-bold mb-1">Creator Applications</h1>
        <p className="text-muted-foreground text-sm">
          Review who can upload and sell design files on the platform.
        </p>
      </div>

      <div className="flex gap-2 overflow-x-auto pb-2 mb-6">
        {(["pending", "approved", "rejected", "all"] as const).map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`h-9 px-4 rounded-full text-sm font-medium capitalize whitespace-nowrap border transition-colors ${
              filter === f
                ? "bg-gradient-primary text-primary-foreground border-transparent"
                : "border-border text-muted-foreground hover:text-foreground"
            }`}
          >
            {f}
          </button>
        ))}
      </div>

      {isLoading ? (
        <div className="flex justify-center py-20">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      ) : applications.length === 0 ? (
        <div className="bg-card border border-border rounded-2xl p-8 text-center">
          <Palette className="w-10 h-10 mx-auto text-primary mb-3" />
          <p className="text-muted-foreground text-sm">No {filter} applications right now.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {applications.map((app) => (
            <div key={app.id} className="bg-card border border-border rounded-2xl p-5 sm:p-6">
              <div className="flex flex-wrap items-start justify-between gap-3 mb-3">
                <div className="min-w-0">
                  <h2 className="font-display font-bold text-lg truncate">{app.display_name}</h2>
                  <p className="text-sm text-muted-foreground">{app.specialty}</p>
                </div>
                <Badge className={`border-0 capitalize ${STATUS_TONE[app.status as string] ?? ""}`}>
                  {app.status}
                </Badge>
              </div>

              <p className="text-sm text-muted-foreground whitespace-pre-line mb-3">{app.bio}</p>
              {app.reason && (
                <p className="text-sm text-muted-foreground border-l-2 border-primary pl-3 mb-3">
                  {app.reason}
                </p>
              )}
              {app.portfolio_url && (
                <a
                  href={app.portfolio_url}
                  target="_blank"
                  rel="noreferrer noopener"
                  className="inline-flex items-center gap-1.5 text-sm text-primary hover:underline mb-4"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  View portfolio
                </a>
              )}

              {app.status === "pending" && (
                <div className="space-y-3 pt-3 border-t border-border">
                  <Textarea
                    value={notes[app.id] ?? ""}
                    onChange={(e) => setNotes((n) => ({ ...n, [app.id]: e.target.value }))}
                    placeholder="Optional note for the applicant"
                    className="bg-background border-border min-h-[70px]"
                    maxLength={500}
                  />
                  <div className="flex flex-wrap gap-2">
                    <Button
                      variant="hero"
                      disabled={working === app.id}
                      onClick={() => decide(app, "approved")}
                    >
                      {working === app.id ? (
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      ) : (
                        <CheckCircle2 className="w-4 h-4 mr-2" />
                      )}
                      Approve
                    </Button>
                    <Button
                      variant="outline"
                      className="border-border hover:border-destructive/50 hover:text-destructive"
                      disabled={working === app.id}
                      onClick={() => decide(app, "rejected")}
                    >
                      <XCircle className="w-4 h-4 mr-2" />
                      Reject
                    </Button>
                  </div>
                </div>
              )}

              {app.admin_note && app.status !== "pending" && (
                <p className="text-xs text-muted-foreground pt-3 border-t border-border">
                  Note: {app.admin_note}
                </p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminCreators;
