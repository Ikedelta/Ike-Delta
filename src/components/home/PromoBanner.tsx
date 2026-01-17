import { Button } from "@/components/ui/button";
import { ArrowRight, Clock, Gift, Sparkles } from "lucide-react";

const PromoBanner = () => {
  return (
    <section className="py-24 lg:py-32 relative overflow-hidden">
      {/* Gradient Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-background to-accent/10" />
      <div className="absolute inset-0 bg-mesh" />
      
      {/* Animated Orbs */}
      <div className="absolute top-10 left-10 w-48 h-48 bg-primary/30 rounded-full blur-[100px] animate-float" />
      <div className="absolute bottom-10 right-10 w-64 h-64 bg-accent/20 rounded-full blur-[120px] animate-float" style={{ animationDelay: '3s' }} />

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-5xl mx-auto">
          <div className="glass-strong rounded-3xl p-8 lg:p-14 overflow-hidden relative">
            {/* Inner Glow */}
            <div className="absolute -top-32 -right-32 w-64 h-64 bg-primary/40 rounded-full blur-[100px]" />
            <div className="absolute -bottom-32 -left-32 w-48 h-48 bg-accent/30 rounded-full blur-[80px]" />
            
            <div className="relative z-10 flex flex-col lg:flex-row items-center gap-10 lg:gap-16">
              {/* Icon */}
              <div className="flex-shrink-0">
                <div className="w-28 h-28 lg:w-36 lg:h-36 rounded-3xl bg-gradient-primary flex items-center justify-center glow animate-float">
                  <Gift className="w-14 h-14 lg:w-18 lg:h-18 text-primary-foreground" />
                </div>
              </div>

              {/* Content */}
              <div className="flex-1 text-center lg:text-left">
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent/20 text-accent mb-6">
                  <Clock className="w-4 h-4" />
                  <span className="text-sm font-semibold">Limited Time Offer</span>
                </div>
                
                <h2 className="font-display text-3xl lg:text-4xl xl:text-5xl font-bold text-foreground mb-5">
                  Get <span className="text-gradient-accent">50% Off</span> Your First Purchase
                </h2>
                
                <p className="text-muted-foreground text-lg mb-8 max-w-xl">
                  Join thousands of creators and get instant access to our entire library of premium design assets.
                </p>

                <div className="flex flex-col sm:flex-row items-center gap-4 justify-center lg:justify-start">
                  <Button variant="accent" size="xl" className="glow-accent hover:scale-105 transition-transform">
                    Claim Your Discount
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </Button>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Sparkles className="w-5 h-5 text-primary" />
                    <span className="text-sm">Use code: <strong className="text-foreground">CREATIVE50</strong></span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PromoBanner;