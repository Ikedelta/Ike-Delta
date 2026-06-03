import { Link } from "react-router-dom";
import {
  Sparkles,
  Twitter,
  Instagram,
  Youtube,
  Linkedin,
  Facebook,
  Mail,
  MapPin,
  Globe,
  ShieldCheck,
  Heart,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const Footer = () => {
  const footerLinks = {
    Explore: [
      { name: "All Assets", href: "/explore" },
      { name: "Categories", href: "/categories" },
      { name: "UI Kits", href: "/explore" },
      { name: "Graphics", href: "/explore" },
      { name: "Fonts", href: "/explore" },
      { name: "Mockups", href: "/explore" },
    ],
    Resources: [
      { name: "Blog", href: "/blog" },
      { name: "Tutorials", href: "/blog" },
      { name: "Design Tips", href: "/blog" },
      { name: "License Info", href: "/about" },
    ],
    Creators: [
      { name: "Become a Seller", href: "/auth/register" },
      { name: "Creator Hub", href: "/dashboard" },
      { name: "Upload Assets", href: "/dashboard/products/new" },
      { name: "Pricing", href: "/pricing" },
    ],
    Company: [
      { name: "About Us", href: "/about" },
      { name: "Contact", href: "/contact" },
      { name: "Careers", href: "/about" },
      { name: "Press Kit", href: "/about" },
    ],
    Support: [
      { name: "Help Center", href: "/contact" },
      { name: "License Info", href: "/about" },
      { name: "Refunds", href: "/contact" },
      { name: "Terms", href: "/about" },
      { name: "Privacy", href: "/about" },
    ],
  };

  const socialLinks = [
    { icon: Twitter, href: "#", label: "Twitter" },
    { icon: Instagram, href: "#", label: "Instagram" },
    { icon: Youtube, href: "#", label: "YouTube" },
    { icon: Linkedin, href: "#", label: "LinkedIn" },
    { icon: Facebook, href: "#", label: "Facebook" },
  ];

  return (
    <footer className="bg-card border-t border-border">
      {/* Newsletter strip */}
      <div className="border-b border-border">
        <div className="container mx-auto px-4 py-10">
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
            <div>
              <h3 className="font-display font-bold text-xl sm:text-2xl text-foreground mb-1">
                Join the creative community
              </h3>
              <p className="text-muted-foreground text-sm">
                Fresh assets, templates, and design inspiration — straight to your inbox.
              </p>
            </div>
            <form
              onSubmit={(e) => e.preventDefault()}
              className="flex w-full lg:w-auto items-center gap-2"
            >
              <Input
                type="email"
                placeholder="you@studio.com"
                className="w-full lg:w-80 bg-background border-border"
              />
              <Button type="submit" variant="hero" className="shrink-0">
                Subscribe
              </Button>
            </form>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 pt-14 pb-8">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-12 gap-8 mb-12">
          {/* Brand Column */}
          <div className="col-span-2 lg:col-span-3">
            <Link to="/" className="flex items-center gap-3 mb-5 group">
              <div className="w-10 h-10 rounded-xl bg-gradient-primary flex items-center justify-center glow-sm">
                <Sparkles className="w-5 h-5 text-primary-foreground" />
              </div>
              <span className="font-display font-bold text-xl text-foreground">
                CreativeHub
              </span>
            </Link>
            <p className="text-muted-foreground text-sm mb-5 leading-relaxed max-w-xs">
              A creative platform for designers, illustrators, and makers — discover, learn, and sell premium digital assets.
            </p>

            <div className="space-y-2 text-sm text-muted-foreground mb-6">
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-primary" />
                <span>hello@creativehub.com</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-primary" />
                <span>Accra, Ghana</span>
              </div>
              <div className="flex items-center gap-2">
                <Globe className="w-4 h-4 text-primary" />
                <span>Serving creators worldwide</span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  className="w-9 h-9 rounded-lg bg-muted flex items-center justify-center text-muted-foreground hover:text-primary-foreground hover:bg-primary transition-all duration-300"
                  aria-label={social.label}
                >
                  <social.icon className="w-4 h-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Link columns */}
          {Object.entries(footerLinks).map(([category, links]) => (
            <div key={category} className="lg:col-span-2 min-w-0">
              <h4 className="font-display font-semibold mb-4 text-foreground text-sm uppercase tracking-wider">
                {category}
              </h4>
              <ul className="space-y-2.5">
                {links.map((link) => (
                  <li key={link.name}>
                    <Link
                      to={link.href}
                      className="text-muted-foreground hover:text-primary transition-colors duration-200 text-sm"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Trust row */}
        <div className="pt-6 border-t border-border flex flex-wrap items-center justify-center md:justify-between gap-4 text-xs text-muted-foreground">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-success" />
            <span>Secure payments · Standard & Extended licenses · 30-day refund policy</span>
          </div>
          <div className="flex items-center gap-3">
            <span>🌍 English</span>
            <span className="opacity-40">·</span>
            <span>₵ GHS / $ USD</span>
          </div>
        </div>

        {/* Bottom */}
        <div className="pt-6 mt-6 border-t border-border flex flex-col md:flex-row items-center justify-between gap-3">
          <p className="text-muted-foreground text-sm">
            © {new Date().getFullYear()} CreativeHub. All rights reserved.
          </p>
          <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
            <span>Crafted with</span>
            <Heart className="w-4 h-4 text-accent fill-current" />
            <span>for creators in Ghana & beyond</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
