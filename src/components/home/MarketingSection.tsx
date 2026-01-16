import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Zap, 
  Shield, 
  Globe, 
  Headphones, 
  CreditCard, 
  RefreshCcw,
  ArrowRight,
  CheckCircle2
} from "lucide-react";

const MarketingSection = () => {
  const features = [
    {
      icon: Zap,
      title: "Instant Downloads",
      description: "Get your files immediately after purchase. No waiting, no hassle.",
    },
    {
      icon: Shield,
      title: "Secure Payments",
      description: "Pay safely with MTN MoMo, Vodafone Cash, or card via Paystack & Flutterwave.",
    },
    {
      icon: Globe,
      title: "Ghana Localized",
      description: "Prices in GHS, local payment methods, and support tailored for you.",
    },
    {
      icon: Headphones,
      title: "24/7 Support",
      description: "Our team is always here to help you with any questions.",
    },
    {
      icon: CreditCard,
      title: "Flexible Plans",
      description: "Choose from one-time purchases or unlock everything with a subscription.",
    },
    {
      icon: RefreshCcw,
      title: "Lifetime Updates",
      description: "Get all future updates for products you purchase, forever.",
    },
  ];

  const benefits = [
    "Access to 15,000+ premium digital assets",
    "New products added weekly",
    "Commercial license included",
    "Priority customer support",
    "Exclusive member discounts",
    "Early access to new releases",
  ];

  return (
    <section className="py-20 lg:py-32 bg-background">
      <div className="container mx-auto px-4">
        {/* Why Choose Us */}
        <div className="mb-24">
          <div className="text-center mb-16">
            <Badge variant="secondary" className="mb-4">Why CreativeHub</Badge>
            <h2 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-4">
              Everything You Need to Create
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              We've built the ultimate platform for African creators with features designed for your success.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
            {features.map((feature, index) => (
              <div
                key={feature.title}
                className="group bg-card rounded-2xl border border-border p-8 card-hover"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center mb-6 group-hover:bg-gradient-primary group-hover:shadow-glow transition-all duration-300">
                  <feature.icon className="w-7 h-7 text-primary group-hover:text-primary-foreground transition-colors" />
                </div>
                <h3 className="font-display font-semibold text-xl text-foreground mb-3">
                  {feature.title}
                </h3>
                <p className="text-muted-foreground leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Subscription CTA */}
        <div className="bg-gradient-hero rounded-3xl p-8 lg:p-16 relative overflow-hidden">
          {/* Decorative */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-primary/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
          <div className="absolute bottom-0 left-0 w-72 h-72 bg-accent/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />

          <div className="relative z-10 grid lg:grid-cols-2 gap-12 items-center">
            {/* Content */}
            <div>
              <Badge className="bg-accent/20 text-accent border-0 mb-6">
                Pro Membership
              </Badge>
              <h2 className="font-display text-3xl lg:text-4xl xl:text-5xl font-bold text-primary-foreground mb-6">
                Unlock Unlimited Access
              </h2>
              <p className="text-primary-foreground/70 text-lg mb-8">
                Get full access to our entire library of premium assets, courses, and exclusive content with a single subscription.
              </p>

              <ul className="grid sm:grid-cols-2 gap-3 mb-8">
                {benefits.map((benefit) => (
                  <li key={benefit} className="flex items-center gap-3 text-primary-foreground/80">
                    <CheckCircle2 className="w-5 h-5 text-success flex-shrink-0" />
                    <span>{benefit}</span>
                  </li>
                ))}
              </ul>

              <div className="flex flex-col sm:flex-row items-start gap-4">
                <Button variant="accent" size="xl">
                  Start Free Trial
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
                <div className="text-primary-foreground/60 text-sm">
                  Starting at <span className="text-primary-foreground font-display font-bold text-2xl">GHS 49</span>/month
                </div>
              </div>
            </div>

            {/* Visual */}
            <div className="hidden lg:block relative">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/30 to-accent/20 rounded-3xl blur-2xl" />
              <div className="relative bg-card/10 backdrop-blur-sm rounded-3xl border border-primary-foreground/10 p-8">
                <div className="text-center">
                  <div className="font-display text-6xl font-bold text-primary-foreground mb-2">
                    15K+
                  </div>
                  <div className="text-primary-foreground/60">
                    Premium Assets
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-4 mt-8">
                  {[1, 2, 3, 4, 5, 6].map((i) => (
                    <div
                      key={i}
                      className="aspect-square rounded-xl bg-primary-foreground/10 animate-pulse"
                      style={{ animationDelay: `${i * 0.2}s` }}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default MarketingSection;
