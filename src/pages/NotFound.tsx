import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Home, ArrowLeft } from "lucide-react";

const NotFound = () => {
  return (
    <div className="min-h-screen bg-mesh flex items-center justify-center p-4">
      {/* Background Effects */}
      <div className="absolute top-1/3 left-1/3 w-[400px] h-[400px] bg-primary/20 rounded-full blur-[150px]" />
      <div className="absolute bottom-1/3 right-1/3 w-[300px] h-[300px] bg-accent/15 rounded-full blur-[120px]" />

      <div className="text-center relative z-10">
        <div className="font-display text-[150px] md:text-[200px] font-bold text-gradient leading-none mb-4">
          404
        </div>
        <h1 className="font-display text-2xl md:text-3xl font-bold text-foreground mb-4">
          Page Not Found
        </h1>
        <p className="text-muted-foreground text-lg mb-8 max-w-md mx-auto">
          Oops! The page you're looking for doesn't exist or has been moved.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Button variant="hero" asChild className="glow-sm">
            <Link to="/">
              <Home className="w-4 h-4 mr-2" />
              Go Home
            </Link>
          </Button>
          <Button variant="outline" onClick={() => window.history.back()} className="border-border hover:border-primary/50">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Go Back
          </Button>
        </div>
      </div>
    </div>
  );
};

export default NotFound;