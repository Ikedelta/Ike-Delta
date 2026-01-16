import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Mail, Sparkles, ArrowRight, Check } from "lucide-react";

const NewsletterSection = () => {
  const [email, setEmail] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setIsSubmitted(true);
      setEmail("");
    }
  };

  return (
    <section className="py-20 lg:py-32 bg-background relative overflow-hidden">
      {/* Decorative */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-primary/5 rounded-full blur-3xl" />

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-3xl mx-auto text-center">
          {/* Icon */}
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-primary mb-8 shadow-glow">
            <Mail className="w-10 h-10 text-primary-foreground" />
          </div>

          {/* Content */}
          <h2 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-4">
            Stay in the Loop
          </h2>
          <p className="text-muted-foreground text-lg mb-8 max-w-xl mx-auto">
            Get exclusive access to new releases, special offers, and creative inspiration delivered to your inbox.
          </p>

          {/* Form */}
          {isSubmitted ? (
            <div className="flex items-center justify-center gap-3 text-success animate-scale-in">
              <div className="w-12 h-12 rounded-full bg-success/10 flex items-center justify-center">
                <Check className="w-6 h-6" />
              </div>
              <span className="font-medium text-lg">Thanks for subscribing!</span>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
              <Input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="h-14 px-6 rounded-xl bg-card border-border text-base"
                required
              />
              <Button type="submit" variant="hero" size="lg" className="h-14 px-8">
                Subscribe
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </form>
          )}

          {/* Trust */}
          <div className="flex items-center justify-center gap-2 mt-6 text-muted-foreground text-sm">
            <Sparkles className="w-4 h-4" />
            <span>Join 12,000+ creators. No spam, unsubscribe anytime.</span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default NewsletterSection;
