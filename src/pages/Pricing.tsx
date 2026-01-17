import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Check, Sparkles } from "lucide-react";

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
      <main className="pt-24 pb-16">
        <div className="container mx-auto px-4">
          {/* Header */}
          <div className="text-center mb-16">
            <span className="text-primary font-semibold mb-4 block text-sm uppercase tracking-wider">Pricing</span>
            <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-6">
              Simple, Transparent Pricing
            </h1>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Choose the plan that works best for you. All plans include a 7-day free trial.
            </p>
          </div>

          {/* Pricing Cards */}
          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {plans.map((plan) => (
              <div
                key={plan.name}
                className={`relative bg-card rounded-3xl border p-8 ${
                  plan.popular ? 'border-primary glow' : 'border-border'
                } card-hover`}
              >
                {plan.popular && (
                  <Badge className="absolute -top-3 left-1/2 -translate-x-1/2 bg-gradient-primary text-primary-foreground border-0 px-4 py-1">
                    <Sparkles className="w-4 h-4 mr-1" />
                    Most Popular
                  </Badge>
                )}
                
                <div className="text-center mb-8">
                  <h3 className="font-display font-bold text-2xl text-foreground mb-2">{plan.name}</h3>
                  <p className="text-muted-foreground text-sm mb-6">{plan.description}</p>
                  <div className="flex items-baseline justify-center gap-1">
                    <span className="text-muted-foreground">GHS</span>
                    <span className="font-display font-bold text-5xl text-foreground">{plan.price}</span>
                    <span className="text-muted-foreground">/{plan.period}</span>
                  </div>
                </div>

                <ul className="space-y-4 mb-8">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-center gap-3">
                      <Check className="w-5 h-5 text-success flex-shrink-0" />
                      <span className="text-foreground/80">{feature}</span>
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
            ))}
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