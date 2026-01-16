import { Button } from "@/components/ui/button";
import { ArrowRight, Play, Star, Download, Users } from "lucide-react";

const HeroSection = () => {
  const stats = [
    { icon: Download, value: "50K+", label: "Downloads" },
    { icon: Users, value: "12K+", label: "Creators" },
    { icon: Star, value: "4.9", label: "Rating" },
  ];

  return (
    <section className="relative min-h-screen flex items-center pt-20 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-hero" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_hsl(var(--primary)/0.15),_transparent_50%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,_hsl(var(--accent)/0.1),_transparent_50%)]" />
      
      {/* Floating Elements */}
      <div className="absolute top-1/4 right-1/4 w-72 h-72 bg-primary/20 rounded-full blur-3xl animate-float" />
      <div className="absolute bottom-1/4 left-1/4 w-96 h-96 bg-accent/10 rounded-full blur-3xl animate-float" style={{ animationDelay: '2s' }} />

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary mb-8 animate-fade-in">
            <Star className="w-4 h-4 fill-current" />
            <span className="text-sm font-medium">Trusted by 12,000+ creators worldwide</span>
          </div>

          {/* Headline */}
          <h1 className="font-display text-4xl md:text-5xl lg:text-7xl font-bold text-primary-foreground mb-6 leading-tight animate-slide-up">
            Premium Digital Assets for{" "}
            <span className="text-gradient-primary">Creative Minds</span>
          </h1>

          {/* Subheadline */}
          <p className="text-lg md:text-xl text-primary-foreground/70 mb-10 max-w-2xl mx-auto animate-slide-up" style={{ animationDelay: '0.1s' }}>
            Discover thousands of high-quality templates, UI kits, graphics, and courses. 
            Create stunning designs faster than ever before.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16 animate-slide-up" style={{ animationDelay: '0.2s' }}>
            <Button variant="hero" size="xl">
              Start Exploring
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
            <Button variant="glass" size="xl" className="border-primary-foreground/20 text-primary-foreground hover:bg-primary-foreground/10">
              <Play className="w-5 h-5 mr-2" />
              Watch Demo
            </Button>
          </div>

          {/* Stats */}
          <div className="flex flex-wrap items-center justify-center gap-8 md:gap-16 animate-fade-in" style={{ animationDelay: '0.4s' }}>
            {stats.map((stat) => (
              <div key={stat.label} className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-primary-foreground/10 flex items-center justify-center">
                  <stat.icon className="w-6 h-6 text-primary" />
                </div>
                <div className="text-left">
                  <div className="font-display font-bold text-2xl text-primary-foreground">
                    {stat.value}
                  </div>
                  <div className="text-primary-foreground/60 text-sm">
                    {stat.label}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom Gradient */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent" />
    </section>
  );
};

export default HeroSection;
