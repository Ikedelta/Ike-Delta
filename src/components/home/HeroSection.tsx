import { Button } from "@/components/ui/button";
import { ArrowRight, Play, Star, Download, Users } from "lucide-react";

const HeroSection = () => {
  const stats = [
    { icon: Download, value: "50K+", label: "Downloads" },
    { icon: Users, value: "12K+", label: "Creators" },
    { icon: Star, value: "4.9", label: "Rating" },
  ];

  return (
    <section className="relative min-h-screen flex items-center pt-20 overflow-hidden bg-mesh">
      {/* Animated Orbs */}
      <div className="absolute top-1/4 right-1/4 w-[500px] h-[500px] bg-primary/30 rounded-full blur-[120px] animate-float" />
      <div className="absolute bottom-1/3 left-1/5 w-[400px] h-[400px] bg-accent/20 rounded-full blur-[100px] animate-float" style={{ animationDelay: '3s' }} />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/10 rounded-full blur-[150px]" />
      
      {/* Grid Pattern Overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(139,92,246,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(139,92,246,0.03)_1px,transparent_1px)] bg-[size:60px_60px]" />

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-5xl mx-auto text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full glass border-primary/20 text-primary mb-8 animate-fade-in">
            <Star className="w-4 h-4 fill-current" />
            <span className="text-sm font-medium">Trusted by 12,000+ creators worldwide</span>
          </div>

          {/* Headline */}
          <h1 className="font-display text-5xl md:text-6xl lg:text-8xl font-bold text-foreground mb-8 leading-[1.1] animate-slide-up">
            Premium Digital Assets for{" "}
            <span className="text-gradient">Creative Minds</span>
          </h1>

          {/* Subheadline */}
          <p className="text-lg md:text-xl text-muted-foreground mb-12 max-w-2xl mx-auto animate-slide-up leading-relaxed" style={{ animationDelay: '0.1s' }}>
            Discover thousands of high-quality templates, UI kits, graphics, and courses. 
            Create stunning designs faster than ever before.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-20 animate-slide-up" style={{ animationDelay: '0.2s' }}>
            <Button variant="hero" size="xl" className="glow hover:scale-105 transition-transform duration-300">
              Start Exploring
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
            <Button variant="glass" size="xl" className="hover:bg-muted/50">
              <Play className="w-5 h-5 mr-2 fill-current" />
              Watch Demo
            </Button>
          </div>

          {/* Stats */}
          <div className="flex flex-wrap items-center justify-center gap-8 md:gap-16 animate-fade-in" style={{ animationDelay: '0.4s' }}>
            {stats.map((stat) => (
              <div key={stat.label} className="flex items-center gap-4 group">
                <div className="w-14 h-14 rounded-2xl glass flex items-center justify-center group-hover:bg-primary/20 transition-all duration-300">
                  <stat.icon className="w-6 h-6 text-primary" />
                </div>
                <div className="text-left">
                  <div className="font-display font-bold text-3xl text-foreground">
                    {stat.value}
                  </div>
                  <div className="text-muted-foreground text-sm">
                    {stat.label}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom Gradient Fade */}
      <div className="absolute bottom-0 left-0 right-0 h-48 bg-gradient-to-t from-background via-background/80 to-transparent" />
    </section>
  );
};

export default HeroSection;