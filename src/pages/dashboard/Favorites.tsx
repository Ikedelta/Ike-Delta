import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Heart, Package, Trash2, ShoppingCart, Star } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

interface Favorite {
  id: string;
  created_at: string;
  product: {
    id: string;
    title: string;
    thumbnail_url: string | null;
    price: number;
    is_free: boolean;
    rating: number;
    seller_id: string;
  };
}

const Favorites = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [favorites, setFavorites] = useState<Favorite[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchFavorites();
    }
  }, [user]);

  const fetchFavorites = async () => {
    try {
      const { data, error } = await supabase
        .from("favorites")
        .select(`
          *,
          product:products(id, title, thumbnail_url, price, is_free, rating, seller_id)
        `)
        .eq("user_id", user?.id)
        .order("created_at", { ascending: false });

      if (error) throw error;
      setFavorites(data || []);
    } catch (error) {
      console.error("Error fetching favorites:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleRemove = async (favoriteId: string) => {
    try {
      const { error } = await supabase
        .from("favorites")
        .delete()
        .eq("id", favoriteId);

      if (error) throw error;

      setFavorites(favorites.filter(f => f.id !== favoriteId));
      toast({
        title: "Removed from Favorites",
        description: "Product removed from your favorites.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to remove from favorites.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="p-6 lg:p-8 pb-24 lg:pb-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="font-display text-3xl font-bold text-foreground mb-2">Favorites</h1>
        <p className="text-muted-foreground">Products you've saved for later</p>
      </div>

      {/* Favorites Grid */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map((i) => (
            <Card key={i} className="bg-card border-border">
              <div className="h-40 bg-muted animate-pulse" />
              <CardContent className="p-4">
                <div className="h-5 bg-muted rounded animate-pulse mb-2" />
                <div className="h-4 bg-muted rounded animate-pulse w-2/3" />
              </CardContent>
            </Card>
          ))}
        </div>
      ) : favorites.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {favorites.map((favorite) => (
            <Card key={favorite.id} className="bg-card border-border card-hover overflow-hidden group">
              {/* Thumbnail */}
              <div className="relative h-40 bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center">
                {favorite.product.thumbnail_url ? (
                  <img 
                    src={favorite.product.thumbnail_url} 
                    alt={favorite.product.title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <Package className="w-12 h-12 text-muted-foreground" />
                )}
                <button
                  onClick={() => handleRemove(favorite.id)}
                  className="absolute top-3 right-3 w-8 h-8 rounded-full bg-destructive/80 hover:bg-destructive flex items-center justify-center transition-colors"
                >
                  <Heart className="w-4 h-4 text-white fill-white" />
                </button>
              </div>

              <CardContent className="p-4">
                <h3 className="font-semibold text-foreground truncate mb-2">
                  {favorite.product.title}
                </h3>
                
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-1 text-sm text-muted-foreground">
                    <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                    <span>{favorite.product.rating || 0}</span>
                  </div>
                  <span className="font-semibold text-foreground">
                    {favorite.product.is_free ? "Free" : `₵${favorite.product.price}`}
                  </span>
                </div>

                <div className="flex gap-2">
                  <Button variant="hero" size="sm" className="flex-1 glow-sm">
                    <ShoppingCart className="w-4 h-4 mr-1" />
                    {favorite.product.is_free ? "Get" : "Buy"}
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => handleRemove(favorite.id)}
                    className="text-muted-foreground hover:text-destructive"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card className="bg-card border-border">
          <CardContent className="flex flex-col items-center justify-center py-16">
            <div className="w-20 h-20 rounded-full bg-muted flex items-center justify-center mb-6">
              <Heart className="w-10 h-10 text-muted-foreground" />
            </div>
            <h3 className="font-display text-xl font-semibold text-foreground mb-2">
              No favorites yet
            </h3>
            <p className="text-muted-foreground text-center mb-6 max-w-sm">
              Save products you love to find them easily later
            </p>
            <Button variant="hero" className="glow-sm" asChild>
              <a href="/explore">Discover Products</a>
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default Favorites;
