import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { 
  Package, 
  Plus, 
  MoreVertical, 
  Eye, 
  Edit, 
  Trash2,
  Star,
  Download as DownloadIcon
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useToast } from "@/hooks/use-toast";

const MyProducts = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchProducts();
    }
  }, [user]);

  const fetchProducts = async () => {
    try {
      const { data, error } = await supabase
        .from("products")
        .select("*, categories(name)")
        .eq("seller_id", user?.id)
        .order("created_at", { ascending: false });

      if (error) throw error;
      setProducts(data || []);
    } catch (error) {
      console.error("Error fetching products:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (productId: string) => {
    try {
      const { error } = await supabase
        .from("products")
        .delete()
        .eq("id", productId);

      if (error) throw error;

      setProducts(products.filter(p => p.id !== productId));
      toast({
        title: "Product Deleted",
        description: "Your product has been deleted successfully.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete product.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="p-6 lg:p-8 pb-24 lg:pb-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <div>
          <h1 className="font-display text-3xl font-bold text-foreground mb-2">My Products</h1>
          <p className="text-muted-foreground">Manage your creative assets</p>
        </div>
        <Link to="/dashboard/products/new">
          <Button variant="hero" className="glow-sm">
            <Plus className="w-4 h-4 mr-2" />
            New Product
          </Button>
        </Link>
      </div>

      {/* Products Grid */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <Card key={i} className="bg-card border-border">
              <div className="h-40 bg-muted animate-pulse" />
              <CardContent className="p-4">
                <div className="h-5 bg-muted rounded animate-pulse mb-2" />
                <div className="h-4 bg-muted rounded animate-pulse w-2/3" />
              </CardContent>
            </Card>
          ))}
        </div>
      ) : products.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((product) => (
            <Card key={product.id} className="bg-card border-border card-hover overflow-hidden group">
              {/* Thumbnail */}
              <div className="relative h-40 bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center">
                {product.thumbnail_url ? (
                  <img 
                    src={product.thumbnail_url} 
                    alt={product.title} 
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <Package className="w-12 h-12 text-muted-foreground" />
                )}
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                  <Button size="sm" variant="glass">
                    <Eye className="w-4 h-4 mr-1" /> View
                  </Button>
                  <Link to={`/dashboard/products/${product.id}/edit`}>
                    <Button size="sm" variant="glass">
                      <Edit className="w-4 h-4 mr-1" /> Edit
                    </Button>
                  </Link>
                </div>
                <span className={`absolute top-3 right-3 text-xs px-2 py-1 rounded-full font-medium ${
                  product.status === 'published' 
                    ? 'bg-green-500/20 text-green-400' 
                    : product.status === 'pending'
                    ? 'bg-yellow-500/20 text-yellow-400'
                    : 'bg-muted text-muted-foreground'
                }`}>
                  {product.status}
                </span>
              </div>

              <CardContent className="p-4">
                <div className="flex items-start justify-between mb-2">
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-foreground truncate">{product.title}</h3>
                    <p className="text-sm text-muted-foreground">
                      {product.categories?.name || "Uncategorized"}
                    </p>
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <MoreVertical className="w-4 h-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="bg-card border-border">
                      <DropdownMenuItem className="cursor-pointer">
                        <Eye className="w-4 h-4 mr-2" /> View
                      </DropdownMenuItem>
                      <DropdownMenuItem className="cursor-pointer">
                        <Edit className="w-4 h-4 mr-2" /> Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem 
                        className="cursor-pointer text-destructive focus:text-destructive"
                        onClick={() => handleDelete(product.id)}
                      >
                        <Trash2 className="w-4 h-4 mr-2" /> Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>

                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-3 text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <DownloadIcon className="w-3 h-3" />
                      {product.download_count}
                    </span>
                    <span className="flex items-center gap-1">
                      <Star className="w-3 h-3" />
                      {product.rating || 0}
                    </span>
                  </div>
                  <span className="font-semibold text-foreground">
                    {product.is_free ? "Free" : `₵${product.price}`}
                  </span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card className="bg-card border-border">
          <CardContent className="flex flex-col items-center justify-center py-16">
            <div className="w-20 h-20 rounded-full bg-muted flex items-center justify-center mb-6">
              <Package className="w-10 h-10 text-muted-foreground" />
            </div>
            <h3 className="font-display text-xl font-semibold text-foreground mb-2">
              No products yet
            </h3>
            <p className="text-muted-foreground text-center mb-6 max-w-sm">
              Start selling your creative assets by creating your first product
            </p>
            <Link to="/dashboard/products/new">
              <Button variant="hero" className="glow-sm">
                <Plus className="w-4 h-4 mr-2" />
                Create Your First Product
              </Button>
            </Link>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default MyProducts;
