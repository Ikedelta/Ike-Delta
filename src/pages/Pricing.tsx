import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Check, Sparkles, Rocket, Users, Zap } from "lucide-react";

const planIcons = { Free: Zap, Pro: Rocket, Team: Users } as const;



const Pricing = () => {
  const plans = [
    {
      name: "Free",
      description: "Perfect for getting started",
      price: "0",
      period: "forever",
      features: [
        "Access to free assets",
        "5 downloads per month",
        "Personal use license",
        "Community support",
        "Basic tutorials",
      ],
      cta: "Get Started",
      popular: false,
    },
    {
      name: "Pro",
      description: "Best for professionals",
      price: "49",
      period: "month",
      features: [
        "Everything in Free",
        "Unlimited downloads",
        "Commercial license",
        "Access to all premium assets",
        "Priority support",
        "Early access to new products",
        "Exclusive discounts",
      ],
      cta: "Start Free Trial",
      popular: true,
    },
    {
      name: "Team",
      description: "For teams and agencies",
      price: "149",
      period: "month",
      features: [
        "Everything in Pro",
        "Up to 10 team members",
        "Team collaboration tools",
        "Shared asset library",
        "Admin dashboard",
        "Custom invoicing",
        "Dedicated account manager",
      ],
      cta: "Contact Sales",
      popular: false,
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pt-20 sm:pt-24 pb-16">
        <div className="container mx-auto px-4">
          {/* Header */}
          <div className="text-center mb-10 sm:mb-16">
            <span className="text-primary font-semibold mb-3 sm:mb-4 block text-xs sm:text-sm uppercase tracking-wider">Pricing</span>
            <h1 className="font-display text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-4 sm:mb-6">
              Simple, Transparent Pricing
            </h1>
            <p className="text-muted-foreground text-base sm:text-lg max-w-2xl mx-auto px-2">
              Choose the plan that works best for you. All plans include a 7-day free trial.
            </p>
          </div>

          {/* Pricing Cards */}
          <div className="grid md:grid-cols-3 gap-5 sm:gap-6 lg:gap-8 max-w-6xl mx-auto">
            {plans.map((plan) => {
              const Icon = planIcons[plan.name as keyof typeof planIcons];
              return (
              <div
                key={plan.name}
                className={`relative bg-card rounded-3xl border p-5 sm:p-8 ${
                  plan.popular ? 'border-primary glow mt-3 md:mt-0' : 'border-border'
                } card-hover`}
              >
                {plan.popular && (
                  <Badge className="absolute -top-3 left-1/2 -translate-x-1/2 bg-gradient-primary text-primary-foreground border-0 px-3 py-1 text-xs whitespace-nowrap">
                    <Sparkles className="w-3.5 h-3.5 mr-1" />
                    Most Popular
                  </Badge>
                )}
                
                <div className="text-center mb-5 sm:mb-8">
                  <div className={`w-12 h-12 sm:w-16 sm:h-16 rounded-2xl mx-auto mb-3 sm:mb-4 flex items-center justify-center ${plan.popular ? 'bg-gradient-primary glow-sm' : 'bg-primary/10'}`}>
                    <Icon className={`w-6 h-6 sm:w-8 sm:h-8 ${plan.popular ? 'text-primary-foreground' : 'text-primary'}`} />
                  </div>
                  <h3 className="font-display font-bold text-lg sm:text-2xl text-foreground mb-1 sm:mb-2">{plan.name}</h3>
                  <p className="text-muted-foreground text-xs sm:text-sm mb-3 sm:mb-6">{plan.description}</p>
                  <div className="flex items-baseline justify-center gap-1">
                    <span className="text-muted-foreground text-sm">GHS</span>
                    <span className="font-display font-bold text-3xl sm:text-5xl text-foreground">{plan.price}</span>
                    <span className="text-muted-foreground text-sm">/{plan.period}</span>
                  </div>
                </div>


                <ul className="space-y-2.5 sm:space-y-4 mb-6 sm:mb-8">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-2.5 sm:gap-3">
                      <Check className="w-4 h-4 sm:w-5 sm:h-5 text-success flex-shrink-0 mt-0.5" />
                      <span className="text-foreground/80 text-sm sm:text-base leading-snug">{feature}</span>
                    </li>
                  ))}
                </ul>

                <Button
                  variant={plan.popular ? "hero" : "outline"}
                  className={`w-full ${plan.popular ? 'glow-sm' : 'border-border hover:border-primary/50'}`}
                  size="lg"
                >
                  {plan.cta}
                </Button>
              </div>
              );
            })}

          </div>

          {/* FAQ Teaser */}
          <div className="text-center mt-16">
            <p className="text-muted-foreground">
              Have questions? Check out our{" "}
              <a href="#" className="text-primary hover:underline">FAQ</a> or{" "}
              <a href="/contact" className="text-primary hover:underline">contact us</a>
            </p>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Pricing;