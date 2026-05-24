import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Mail, Sparkles, ArrowRight, Check, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

const NewsletterSection = () => {
  const [email, setEmail] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setSubmitting(true);
    try {
      const { error } = await supabase
        .from("newsletter_subscribers")
        .insert({ email });
      if (error) throw error;
      setIsSubmitted(true);
      setEmail("");
    } catch (err) {
      toast({
        title: "Subscription failed",
        description: "Please try again later.",
        variant: "destructive",
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section className="py-24 lg:py-32 bg-background relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-primary/10 rounded-full blur-[200px]" />

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-3xl mx-auto text-center">
          {/* Icon */}
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-primary mb-8 glow animate-float">
            <Mail className="w-10 h-10 text-primary-foreground" />
          </div>

          {/* Content */}
          <h2 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-6">
            Stay in the Loop
          </h2>
          <p className="text-muted-foreground text-lg mb-10 max-w-xl mx-auto">
            Get exclusive access to new releases, special offers, and creative inspiration delivered to your inbox.
          </p>

          {/* Form */}
          {isSubmitted ? (
            <div className="flex items-center justify-center gap-4 text-success animate-scale-in">
              <div className="w-14 h-14 rounded-full bg-success/20 flex items-center justify-center">
                <Check className="w-7 h-7" />
              </div>
              <span className="font-display font-medium text-xl">Thanks for subscribing!</span>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-4 max-w-lg mx-auto">
              <Input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="h-14 px-6 rounded-xl bg-card border-border text-base focus:border-primary focus:ring-primary/20"
                required
              />
              <Button type="submit" variant="hero" size="lg" className="h-14 px-8 glow-sm hover:glow transition-all" disabled={submitting}>
                {submitting ? (
                  <>
                    <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                    Subscribing...
                  </>
                ) : (
                  <>
                    Subscribe
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </>
                )}
              </Button>
            </form>
          )}

          {/* Trust */}
          <div className="flex items-center justify-center gap-3 mt-8 text-muted-foreground text-sm">
            <Sparkles className="w-4 h-4 text-primary" />
            <span>Join 12,000+ creators. No spam, unsubscribe anytime.</span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default NewsletterSection;