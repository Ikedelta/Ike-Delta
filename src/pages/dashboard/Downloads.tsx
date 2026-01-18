import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Download, Package, Calendar, ExternalLink } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface Purchase {
  id: string;
  amount: number;
  currency: string;
  status: string;
  created_at: string;
  downloaded_at: string | null;
  product: {
    id: string;
    title: string;
    thumbnail_url: string | null;
    file_url: string | null;
  };
}

const Downloads = () => {
  const { user } = useAuth();
  const [purchases, setPurchases] = useState<Purchase[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchPurchases();
    }
  }, [user]);

  const fetchPurchases = async () => {
    try {
      const { data, error } = await supabase
        .from("purchases")
        .select(`
          *,
          product:products(id, title, thumbnail_url, file_url)
        `)
        .eq("user_id", user?.id)
        .eq("status", "completed")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setPurchases(data || []);
    } catch (error) {
      console.error("Error fetching purchases:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = async (purchase: Purchase) => {
    // Update downloaded_at timestamp
    await supabase
      .from("purchases")
      .update({ downloaded_at: new Date().toISOString() })
      .eq("id", purchase.id);

    // In a real app, this would trigger a secure download
    if (purchase.product.file_url) {
      window.open(purchase.product.file_url, "_blank");
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <div className="p-6 lg:p-8 pb-24 lg:pb-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="font-display text-3xl font-bold text-foreground mb-2">Downloads</h1>
        <p className="text-muted-foreground">Access your purchased products</p>
      </div>

      {/* Downloads List */}
      {loading ? (
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <Card key={i} className="bg-card border-border">
              <CardContent className="p-4">
                <div className="flex gap-4">
                  <div className="w-20 h-20 bg-muted rounded-lg animate-pulse" />
                  <div className="flex-1">
                    <div className="h-5 bg-muted rounded animate-pulse mb-2 w-1/3" />
                    <div className="h-4 bg-muted rounded animate-pulse w-1/4" />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : purchases.length > 0 ? (
        <div className="space-y-4">
          {purchases.map((purchase) => (
            <Card key={purchase.id} className="bg-card border-border card-hover">
              <CardContent className="p-4">
                <div className="flex flex-col sm:flex-row gap-4">
                  {/* Thumbnail */}
                  <div className="w-full sm:w-24 h-32 sm:h-24 rounded-lg bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center overflow-hidden">
                    {purchase.product.thumbnail_url ? (
                      <img 
                        src={purchase.product.thumbnail_url} 
                        alt={purchase.product.title}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <Package className="w-8 h-8 text-muted-foreground" />
                    )}
                  </div>

                  {/* Details */}
                  <div className="flex-1">
                    <h3 className="font-semibold text-foreground text-lg mb-1">
                      {purchase.product.title}
                    </h3>
                    <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground mb-3">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        Purchased {formatDate(purchase.created_at)}
                      </span>
                      <span className="font-medium text-foreground">
                        {purchase.currency} {purchase.amount}
                      </span>
                    </div>
                    {purchase.downloaded_at && (
                      <p className="text-xs text-muted-foreground">
                        Last downloaded: {formatDate(purchase.downloaded_at)}
                      </p>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex sm:flex-col gap-2">
                    <Button 
                      variant="hero" 
                      className="flex-1 sm:flex-none glow-sm"
                      onClick={() => handleDownload(purchase)}
                    >
                      <Download className="w-4 h-4 mr-2" />
                      Download
                    </Button>
                    <Button variant="outline" className="flex-1 sm:flex-none border-border">
                      <ExternalLink className="w-4 h-4 mr-2" />
                      View
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card className="bg-card border-border">
          <CardContent className="flex flex-col items-center justify-center py-16">
            <div className="w-20 h-20 rounded-full bg-muted flex items-center justify-center mb-6">
              <Download className="w-10 h-10 text-muted-foreground" />
            </div>
            <h3 className="font-display text-xl font-semibold text-foreground mb-2">
              No downloads yet
            </h3>
            <p className="text-muted-foreground text-center mb-6 max-w-sm">
              Your purchased products will appear here for easy access
            </p>
            <Button variant="hero" className="glow-sm" asChild>
              <a href="/explore">Browse Products</a>
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default Downloads;
