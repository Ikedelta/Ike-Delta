import { Button } from "@/components/ui/button";
import { Sparkles, ArrowRight, Clock, Gift } from "lucide-react";

const PromoBanner = () => {
  return (
    <section className="py-20 lg:py-32 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-hero" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_hsl(var(--primary)/0.2),_transparent_70%)]" />
      
      {/* Decorative Elements */}
      <div className="absolute top-10 left-10 w-32 h-32 bg-primary/20 rounded-full blur-3xl animate-float" />
      <div className="absolute bottom-10 right-10 w-48 h-48 bg-accent/15 rounded-full blur-3xl animate-float" style={{ animationDelay: '3s' }} />

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-5xl mx-auto">
          <div className="bg-card/10 backdrop-blur-xl rounded-3xl border border-primary-foreground/10 p-8 lg:p-12 overflow-hidden relative">
            {/* Shine Effect */}
            <div className="absolute -top-24 -right-24 w-48 h-48 bg-primary/30 rounded-full blur-3xl" />
            
            <div className="relative z-10 flex flex-col lg:flex-row items-center gap-8 lg:gap-12">
              {/* Icon */}
              <div className="flex-shrink-0">
                <div className="w-24 h-24 lg:w-32 lg:h-32 rounded-3xl bg-gradient-primary flex items-center justify-center shadow-glow animate-float">
                  <Gift className="w-12 h-12 lg:w-16 lg:h-16 text-primary-foreground" />
                </div>
              </div>

              {/* Content */}
              <div className="flex-1 text-center lg:text-left">
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent/20 text-accent mb-4">
                  <Clock className="w-4 h-4" />
                  <span className="text-sm font-medium">Limited Time Offer</span>
                </div>
                
                <h2 className="font-display text-3xl lg:text-4xl xl:text-5xl font-bold text-primary-foreground mb-4">
                  Get <span className="text-gradient-accent">50% Off</span> Your First Purchase
                </h2>
                
                <p className="text-primary-foreground/70 text-lg mb-6 max-w-xl">
                  Join thousands of creators and get instant access to our entire library of premium design assets.
                </p>

                <div className="flex flex-col sm:flex-row items-center gap-4 justify-center lg:justify-start">
                  <Button variant="accent" size="xl">
                    Claim Your Discount
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </Button>
                  <div className="flex items-center gap-2 text-primary-foreground/60">
                    <Sparkles className="w-5 h-5" />
                    <span className="text-sm">Use code: <strong className="text-primary-foreground">CREATIVE50</strong></span>
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
