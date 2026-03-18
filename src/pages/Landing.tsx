import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CalendarDays, DollarSign, Store, MessageCircle, Check, Heart, Sparkles } from "lucide-react";

const features = [
  {
    icon: CalendarDays,
    title: "Event Management",
    description: "Create timelines, set milestones, and track every detail from engagement to the big day.",
  },
  {
    icon: DollarSign,
    title: "Budget Tracking",
    description: "Real-time budget management with category breakdowns, expense tracking, and payment schedules.",
  },
  {
    icon: Store,
    title: "Vendor Marketplace",
    description: "Browse, compare, and book top-rated vendors — photographers, caterers, florists, and more.",
  },
  {
    icon: MessageCircle,
    title: "Seamless Communication",
    description: "Centralized messaging between planners, couples, and vendors. Never miss an update.",
  },
];

const pricing = [
  {
    name: "Starter",
    price: "$0",
    period: "/month",
    description: "For couples planning on their own",
    features: ["1 wedding", "Basic timeline", "Up to 3 vendors", "Email support"],
    cta: "Get Started Free",
    highlighted: false,
  },
  {
    name: "Professional",
    price: "$49",
    period: "/month",
    description: "For wedding planners & coordinators",
    features: ["Unlimited weddings", "Full budget tools", "Vendor marketplace", "Client portal", "Priority support"],
    cta: "Start Free Trial",
    highlighted: true,
  },
  {
    name: "Enterprise",
    price: "$149",
    period: "/month",
    description: "For agencies & large teams",
    features: ["Everything in Pro", "Team collaboration", "Custom branding", "API access", "Dedicated manager"],
    cta: "Contact Sales",
    highlighted: false,
  },
];

export default function Landing() {
  return (
    <div className="min-h-screen bg-background">
      {/* Navbar */}
      <nav className="border-b bg-card/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto flex items-center justify-between h-16 px-4">
          <div className="flex items-center gap-2">
            <Heart className="h-6 w-6 text-primary fill-primary" />
            <span className="text-xl font-bold text-foreground tracking-tight">WedPlan</span>
          </div>
          <div className="hidden md:flex items-center gap-8 text-sm text-muted-foreground">
            <a href="#features" className="hover:text-foreground transition-colors">Features</a>
            <a href="#pricing" className="hover:text-foreground transition-colors">Pricing</a>
          </div>
          <div className="flex items-center gap-3">
            <Link to="/login">
              <Button variant="ghost" size="sm">Log In</Button>
            </Link>
            <Link to="/login">
              <Button size="sm">Get Started</Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-wedding-blush/40 via-background to-wedding-cream/40" />
        <div className="container mx-auto px-4 py-24 md:py-36 relative">
          <div className="max-w-3xl mx-auto text-center space-y-6">
            <Badge variant="secondary" className="text-sm px-4 py-1">
              <Sparkles className="h-3.5 w-3.5 mr-1.5" />
              Trusted by 2,000+ wedding professionals
            </Badge>
            <h1 className="text-4xl md:text-6xl font-bold tracking-tight text-foreground leading-tight">
              Plan Perfect Weddings,{" "}
              <span className="text-primary">Together</span>
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
              The all-in-one platform connecting wedding planners, couples, and vendors.
              Manage timelines, budgets, and communication in one beautiful workspace.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
              <Link to="/login">
                <Button size="lg" className="text-base px-8">
                  Get Started Free
                </Button>
              </Link>
              <Button size="lg" variant="outline" className="text-base px-8">
                Book a Demo
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-20 md:py-28 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Everything You Need
            </h2>
            <p className="text-muted-foreground text-lg max-w-xl mx-auto">
              Powerful tools designed for modern wedding planning.
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
            {features.map((f) => (
              <Card key={f.title} className="border-border/50 bg-card shadow-sm hover:shadow-md transition-shadow">
                <CardHeader>
                  <div className="h-11 w-11 rounded-lg bg-primary/10 flex items-center justify-center mb-2">
                    <f.icon className="h-5 w-5 text-primary" />
                  </div>
                  <CardTitle className="text-lg">{f.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground text-sm">{f.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="py-20 md:py-28">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Simple, Transparent Pricing
            </h2>
            <p className="text-muted-foreground text-lg">
              Start free. Upgrade when you're ready.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {pricing.map((plan) => (
              <Card
                key={plan.name}
                className={`relative ${plan.highlighted ? "border-primary shadow-lg scale-105" : "border-border/50"}`}
              >
                {plan.highlighted && (
                  <Badge className="absolute -top-3 left-1/2 -translate-x-1/2">Most Popular</Badge>
                )}
                <CardHeader className="text-center pb-2">
                  <CardTitle className="text-xl">{plan.name}</CardTitle>
                  <p className="text-sm text-muted-foreground">{plan.description}</p>
                  <div className="pt-4">
                    <span className="text-4xl font-bold text-foreground">{plan.price}</span>
                    <span className="text-muted-foreground">{plan.period}</span>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <ul className="space-y-2.5">
                    {plan.features.map((feat) => (
                      <li key={feat} className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Check className="h-4 w-4 text-primary shrink-0" />
                        {feat}
                      </li>
                    ))}
                  </ul>
                  <Link to="/login" className="block">
                    <Button
                      className="w-full"
                      variant={plan.highlighted ? "default" : "outline"}
                    >
                      {plan.cta}
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t bg-muted/30 py-12">
        <div className="container mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Heart className="h-5 w-5 text-primary fill-primary" />
            <span className="font-semibold text-foreground">WedPlan</span>
          </div>
          <p className="text-sm text-muted-foreground">
            © 2026 WedPlan. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
