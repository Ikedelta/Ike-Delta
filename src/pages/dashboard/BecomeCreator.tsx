import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useMyProfile, useMyCreatorApplication } from "@/hooks/useProfile";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Palette, CheckCircle2, Clock, XCircle, Sparkles } from "lucide-react";
import { z } from "zod";

const schema = z.object({
  display_name: z.string().trim().min(2, "Tell us your creator name").max(80),
  specialty: z.string().trim().min(2, "What do you create?").max(80),
  portfolio_url: z.string().trim().max(255).optional().or(z.literal("")),
  bio: z.string().trim().min(30, "Write at least 30 characters").max(800),
  reason: z.string().trim().max(800).optional().or(z.literal("")),
});

const BecomeCreator = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const qc = useQueryClient();
  const { data: profile } = useMyProfile();
  const { data: application, isLoading } = useMyCreatorApplication();

  const [form, setForm] = useState({
    display_name: "",
    specialty: "",
    portfolio_url: "",
    bio: "",
    reason: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);

  const set = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setForm((f) => ({ ...f, [k]: e.target.value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const parsed = schema.safeParse(form);
    if (!parsed.success) {
      const fieldErrors: Record<string, string> = {};
      Object.entries(parsed.error.flatten().fieldErrors).forEach(([k, v]) => {
        if (v?.[0]) fieldErrors[k] = v[0];
      });
      setErrors(fieldErrors);
      return;
    }
    setErrors({});
    setSubmitting(true);
    try {
      const { error } = await supabase.from("creator_applications").insert({
        user_id: user!.id,
        display_name: parsed.data.display_name,
        specialty: parsed.data.specialty,
        portfolio_url: parsed.data.portfolio_url || null,
        bio: parsed.data.bio,
        reason: parsed.data.reason || null,
        status: "pending",
      });
      if (error) throw error;
      toast({
        title: "Application submitted",
        description: "Our team will review your work and get back to you.",
      });
      qc.invalidateQueries({ queryKey: ["creator-application"] });
    } catch (err) {
      toast({
        title: "Could not submit",
        description: err instanceof Error ? err.message : "Please try again.",
        variant: "destructive",
      });
    } finally {
      setSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center py-20">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (profile?.is_creator) {
    return (
      <div className="p-4 sm:p-6 lg:p-8 max-w-3xl">
        <div className="bg-card border border-border rounded-2xl p-6 sm:p-8 text-center">
          <div className="w-16 h-16 mx-auto rounded-2xl bg-gradient-primary flex items-center justify-center mb-4 glow-sm">
            <Palette className="w-7 h-7 text-primary-foreground" />
          </div>
          <h1 className="font-display text-xl sm:text-2xl font-bold mb-2">You're a creator 🎉</h1>
          <p className="text-muted-foreground text-sm mb-6">
            You can upload and sell your design files on CreativeHub.
          </p>
          <Button variant="hero" asChild>
            <a href="/dashboard/products">
              <Sparkles className="w-4 h-4 mr-2" />
              Manage my designs
            </a>
          </Button>
        </div>
      </div>
    );
  }

  if (application) {
    const status = application.status as string;
    const meta =
      status === "approved"
        ? { icon: CheckCircle2, tone: "text-success", label: "Approved" }
        : status === "rejected"
        ? { icon: XCircle, tone: "text-destructive", label: "Not approved" }
        : { icon: Clock, tone: "text-warning", label: "Under review" };
    const Icon = meta.icon;

    return (
      <div className="p-4 sm:p-6 lg:p-8 max-w-3xl">
        <div className="bg-card border border-border rounded-2xl p-6 sm:p-8">
          <Icon className={`w-10 h-10 mb-4 ${meta.tone}`} />
          <div className="flex items-center gap-3 mb-2">
            <h1 className="font-display text-xl sm:text-2xl font-bold">Creator application</h1>
            <Badge variant="secondary" className="bg-muted text-muted-foreground">
              {meta.label}
            </Badge>
          </div>
          <p className="text-muted-foreground text-sm">
            {status === "pending"
              ? "Thanks for applying. Our team reviews new creators within a few days — you'll be notified once a decision is made."
              : status === "approved"
              ? "You've been approved. Refresh your dashboard to start uploading."
              : "Your application wasn't approved this time. You can reach out to our team for feedback."}
          </p>
          {application.admin_note && (
            <p className="mt-4 text-sm border-l-2 border-primary pl-3 text-muted-foreground">
              {application.admin_note}
            </p>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-3xl">
      <div className="mb-6">
        <h1 className="font-display text-2xl sm:text-3xl font-bold mb-2">
          Become a <span className="text-gradient">Creator</span>
        </h1>
        <p className="text-muted-foreground text-sm">
          Sell your design files, grow a following and earn in Cedis. Tell us about your craft and
          we'll review your application.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="bg-card border border-border rounded-2xl p-5 sm:p-6 space-y-5">
        <div className="grid sm:grid-cols-2 gap-5">
          <div className="space-y-2">
            <Label htmlFor="display_name">Creator name</Label>
            <Input
              id="display_name"
              value={form.display_name}
              onChange={set("display_name")}
              placeholder="e.g. Ama Studio"
              className="bg-background border-border"
            />
            {errors.display_name && <p className="text-xs text-destructive">{errors.display_name}</p>}
          </div>
          <div className="space-y-2">
            <Label htmlFor="specialty">Specialty</Label>
            <Input
              id="specialty"
              value={form.specialty}
              onChange={set("specialty")}
              placeholder="e.g. Brand identity, Illustration"
              className="bg-background border-border"
            />
            {errors.specialty && <p className="text-xs text-destructive">{errors.specialty}</p>}
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="portfolio_url">Portfolio link (optional)</Label>
          <Input
            id="portfolio_url"
            value={form.portfolio_url}
            onChange={set("portfolio_url")}
            placeholder="https://behance.net/yourwork"
            className="bg-background border-border"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="bio">About you</Label>
          <Textarea
            id="bio"
            value={form.bio}
            onChange={set("bio")}
            placeholder="Tell us about your design practice and the work you'd sell here."
            className="bg-background border-border min-h-[120px]"
            maxLength={800}
          />
          {errors.bio && <p className="text-xs text-destructive">{errors.bio}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="reason">Why CreativeHub? (optional)</Label>
          <Textarea
            id="reason"
            value={form.reason}
            onChange={set("reason")}
            className="bg-background border-border min-h-[80px]"
            maxLength={800}
          />
        </div>

        <Button type="submit" variant="hero" className="w-full sm:w-auto glow-sm" disabled={submitting}>
          {submitting ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Submitting...
            </>
          ) : (
            <>
              <Palette className="w-4 h-4 mr-2" />
              Submit application
            </>
          )}
        </Button>
      </form>
    </div>
  );
};

export default BecomeCreator;
