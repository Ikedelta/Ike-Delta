import { Link } from "react-router-dom";
import { Sparkles, Twitter, Instagram, Youtube, Linkedin } from "lucide-react";

const Footer = () => {
  const footerLinks = {
    Product: [
      { name: "Explore", href: "/explore" },
      { name: "Categories", href: "/categories" },
      { name: "Pricing", href: "/pricing" },
      { name: "Courses", href: "/courses" },
    ],
    Resources: [
      { name: "Blog", href: "/blog" },
      { name: "Documentation", href: "/docs" },
      { name: "Help Center", href: "/help" },
      { name: "API", href: "/api" },
    ],
    Company: [
      { name: "About", href: "/about" },
      { name: "Careers", href: "/careers" },
      { name: "Contact", href: "/contact" },
      { name: "Partners", href: "/partners" },
    ],
    Legal: [
      { name: "Privacy", href: "/privacy" },
      { name: "Terms", href: "/terms" },
      { name: "Licenses", href: "/licenses" },
      { name: "Refunds", href: "/refunds" },
    ],
  };

  const socialLinks = [
    { icon: Twitter, href: "#", label: "Twitter" },
    { icon: Instagram, href: "#", label: "Instagram" },
    { icon: Youtube, href: "#", label: "YouTube" },
    { icon: Linkedin, href: "#", label: "LinkedIn" },
  ];

  return (
    <footer className="bg-foreground text-background pt-16 pb-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8 mb-12">
          {/* Brand Column */}
          <div className="col-span-2">
            <Link to="/" className="flex items-center gap-2 mb-4">
              <div className="w-9 h-9 rounded-xl bg-gradient-primary flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-primary-foreground" />
              </div>
              <span className="font-display font-bold text-xl">
                CreativeHub
              </span>
            </Link>
            <p className="text-background/60 mb-6 max-w-xs">
              The premium marketplace for digital creators. Find and sell beautiful design assets, templates, and courses.
            </p>
            <div className="flex items-center gap-4">
              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  className="w-10 h-10 rounded-lg bg-background/10 flex items-center justify-center hover:bg-background/20 transition-colors"
                  aria-label={social.label}
                >
                  <social.icon className="w-5 h-5" />
                </a>
              ))}
            </div>
          </div>

          {/* Links */}
          {Object.entries(footerLinks).map(([category, links]) => (
            <div key={category}>
              <h4 className="font-display font-semibold mb-4">{category}</h4>
              <ul className="space-y-3">
                {links.map((link) => (
                  <li key={link.name}>
                    <Link
                      to={link.href}
                      className="text-background/60 hover:text-background transition-colors"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom */}
        <div className="pt-8 border-t border-background/10 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-background/60 text-sm">
            © 2024 CreativeHub. All rights reserved.
          </p>
          <div className="flex items-center gap-6">
            <span className="text-background/60 text-sm">
              Made with ❤️ in Ghana
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
