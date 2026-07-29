import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Menu, X, Search, ShoppingCart, User, Sparkles, LogOut, Loader2 } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();
  const { user, loading, signOut } = useAuth();
  const { toast } = useToast();

  const navLinks = [
    { name: "Feed", href: "/feed" },
    { name: "Explore", href: "/explore" },
    { name: "Creators", href: "/creators" },
    { name: "Categories", href: "/categories" },
    { name: "Pricing", href: "/pricing" },
    { name: "Blog", href: "/blog" },
  ];


  const handleSignOut = async () => {
    await signOut();
    toast({
      title: "Signed Out",
      description: "You've been successfully signed out.",
    });
    navigate("/");
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 glass-strong">
      <div className="container mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-14 sm:h-16 lg:h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 sm:gap-3 group min-w-0">
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-gradient-primary flex items-center justify-center glow-sm group-hover:glow transition-all duration-300 shrink-0">
              <Sparkles className="w-4 h-4 sm:w-5 sm:h-5 text-primary-foreground" />
            </div>
            <span className="font-display font-bold text-lg sm:text-xl text-foreground truncate">
              CreativeHub
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.href}
                className="text-muted-foreground hover:text-foreground transition-all duration-300 font-medium link-hover"
              >
                {link.name}
              </Link>
            ))}
          </nav>

          {/* Desktop Actions */}
          <div className="hidden lg:flex items-center gap-3">
            <Button variant="ghost" size="icon" onClick={() => navigate("/explore")} className="text-muted-foreground hover:text-foreground hover:bg-muted" aria-label="Search">
              <Search className="w-5 h-5" />
            </Button>
            <Button variant="ghost" size="icon" onClick={() => navigate("/dashboard")} className="text-muted-foreground hover:text-foreground hover:bg-muted relative" aria-label="Cart">
              <ShoppingCart className="w-5 h-5" />
              <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-accent text-accent-foreground text-xs flex items-center justify-center font-medium">
                2
              </span>
            </Button>
            
            {loading ? (
              <Loader2 className="w-5 h-5 animate-spin text-muted-foreground" />
            ) : user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button 
                    variant="outline" 
                    className="border-border hover:border-primary/50 hover:bg-primary/5"
                  >
                    <User className="w-4 h-4 mr-2" />
                    {user.email?.split("@")[0]}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48 bg-card border-border">
                  <DropdownMenuItem className="text-muted-foreground">
                    <User className="w-4 h-4 mr-2" />
                    Profile
                  </DropdownMenuItem>
                  <DropdownMenuSeparator className="bg-border" />
                  <DropdownMenuItem 
                    className="text-destructive focus:text-destructive cursor-pointer"
                    onClick={handleSignOut}
                  >
                    <LogOut className="w-4 h-4 mr-2" />
                    Sign Out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <>
                <Button 
                  variant="outline" 
                  className="border-border hover:border-primary/50 hover:bg-primary/5"
                  onClick={() => navigate("/auth/login")}
                >
                  <User className="w-4 h-4 mr-2" />
                  Sign In
                </Button>
                <Button 
                  variant="hero" 
                  className="glow-sm hover:glow transition-all duration-300"
                  onClick={() => navigate("/auth/register")}
                >
                  Get Started
                </Button>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            aria-label={isMenuOpen ? "Close menu" : "Open menu"}
            className="lg:hidden -mr-2 p-2.5 text-foreground rounded-lg hover:bg-muted/60 transition-colors shrink-0"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? (
              <X className="w-5 h-5" />
            ) : (
              <Menu className="w-5 h-5" />
            )}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="lg:hidden py-3 border-t border-border animate-slide-down">
            <nav className="flex flex-col gap-1">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  to={link.href}
                  className="px-3 py-2.5 text-muted-foreground hover:text-foreground hover:bg-muted rounded-lg transition-all font-medium text-sm"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {link.name}
                </Link>
              ))}
              <div className="flex flex-col gap-2 mt-3 pt-3 border-t border-border/60">
                {user ? (
                  <>
                    <div className="px-3 py-1 text-muted-foreground text-xs truncate">
                      Signed in as {user.email}
                    </div>
                    <Button
                      variant="outline"
                      className="w-full border-border"
                      onClick={() => { handleSignOut(); setIsMenuOpen(false); }}
                    >
                      <LogOut className="w-4 h-4 mr-2" />
                      Sign Out
                    </Button>
                  </>
                ) : (
                  <>
                    <Button
                      variant="outline"
                      className="w-full border-border"
                      onClick={() => { navigate("/auth/login"); setIsMenuOpen(false); }}
                    >
                      Sign In
                    </Button>
                    <Button
                      variant="hero"
                      className="w-full glow-sm"
                      onClick={() => { navigate("/auth/register"); setIsMenuOpen(false); }}
                    >
                      Get Started
                    </Button>
                  </>
                )}
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
