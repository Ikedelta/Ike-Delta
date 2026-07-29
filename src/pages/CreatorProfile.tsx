import { useParams, Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useState } from "react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import PinCard, { PinProduct } from "@/components/feed/PinCard";
import SaveToBoardDialog from "@/components/feed/SaveToBoardDialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Loader2,
  MapPin,
  Globe,
  Instagram,
  Twitter,
  UserPlus,
  UserCheck,
  Palette,
} from "lucide-react";
import { usePublicProfile } from "@/hooks/useProfile";
import { useIsFollowing, useToggleFollow, useMyLikes, useToggleLike } from "@/hooks/useSocial";
import { useAuth } from "@/contexts/AuthContext";
import fallback1 from "@/assets/product-ui-kit.jpg";
import fallback2 from "@/assets/product-patterns.jpg";
import fallback3 from "@/assets/product-branding.jpg";

const FALLBACKS = [fallback1, fallback2, fallback3];

const CreatorProfile = () => {
  const { handle } = useParams<{ handle: string }>();
  const { user } = useAuth();
  const [saveTarget, setSaveTarget] = useState<string | null>(null);

  const { data: profile, isLoading } = usePublicProfile(handle);
  const { data: isFollowing } = useIsFollowing(profile?.user_id);
  const toggleFollow = useToggleFollow();
  const { data: likedSet } = useMyLikes();
  const toggleLike = useToggleLike();

  const { data: products = [], isLoading: productsLoading } = useQuery({
    queryKey: ["creator-products", profile?.user_id],
    enabled: !!profile?.user_id,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("products")
        .select(
          "id, title, slug, price, is_free, thumbnail_url, like_count, save_count, tags, seller_id"
        )
        .eq("seller_id", profile!.user_id)
        .eq("status", "published")
        .order("created_at", { ascending: false })
        .limit(60);
      if (error) throw error;
      return (data ?? []) as unknown as PinProduct[];
    },
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="flex justify-center pt-40">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="pt-32 pb-20 text-center container mx-auto px-4">
          <h1 className="font-display text-2xl font-bold mb-3">Creator not found</h1>
          <Button variant="hero" asChild>
            <Link to="/creators">Browse creators</Link>
          </Button>
        </main>
        <Footer />
      </div>
    );
  }

  const name = profile.full_name || profile.username || "African Creator";
  const isSelf = user?.id === profile.user_id;

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pt-14 sm:pt-16 lg:pt-20 pb-16">
        {/* Banner */}
        <div
          className="h-32 sm:h-48 lg:h-60 w-full bg-mesh relative"
          style={
            profile.banner_url
              ? { backgroundImage: `url(${profile.banner_url})`, backgroundSize: "cover", backgroundPosition: "center" }
              : undefined
          }
        >
          <div className="absolute inset-0 bg-gradient-to-t from-background to-transparent" />
        </div>

        <div className="container mx-auto px-4">
          {/* Identity */}
          <div className="-mt-12 sm:-mt-16 relative flex flex-col sm:flex-row sm:items-end gap-4 sm:gap-6 mb-8">
            <span className="w-24 h-24 sm:w-32 sm:h-32 rounded-2xl bg-gradient-primary border-4 border-background flex items-center justify-center overflow-hidden shrink-0 glow-sm">
              {profile.avatar_url ? (
                <img src={profile.avatar_url} alt={name} className="w-full h-full object-cover" />
              ) : (
                <span className="text-3xl font-bold text-primary-foreground">
                  {name.charAt(0).toUpperCase()}
                </span>
              )}
            </span>

            <div className="flex-1 min-w-0">
              <div className="flex flex-wrap items-center gap-2 mb-1">
                <h1 className="font-display text-2xl sm:text-3xl font-bold">{name}</h1>
                {profile.is_creator && (
                  <Badge className="bg-gradient-primary text-primary-foreground border-0">
                    <Palette className="w-3 h-3 mr-1" /> Creator
                  </Badge>
                )}
              </div>
              {profile.username && (
                <p className="text-muted-foreground text-sm">@{profile.username}</p>
              )}
              <div className="flex flex-wrap items-center gap-x-5 gap-y-1 mt-2 text-sm text-muted-foreground">
                <span>
                  <strong className="text-foreground">{profile.follower_count}</strong> followers
                </span>
                <span>
                  <strong className="text-foreground">{profile.following_count}</strong> following
                </span>
                <span>
                  <strong className="text-foreground">{products.length}</strong> designs
                </span>
              </div>
            </div>

            {!isSelf && (
              <Button
                variant={isFollowing ? "outline" : "hero"}
                className={isFollowing ? "border-border" : "glow-sm"}
                disabled={toggleFollow.isPending}
                onClick={() =>
                  toggleFollow.mutate({ creatorId: profile.user_id, following: !!isFollowing })
                }
              >
                {toggleFollow.isPending ? (
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                ) : isFollowing ? (
                  <UserCheck className="w-4 h-4 mr-2" />
                ) : (
                  <UserPlus className="w-4 h-4 mr-2" />
                )}
                {isFollowing ? "Following" : "Follow"}
              </Button>
            )}
          </div>

          {/* Bio */}
          {(profile.bio || profile.location || profile.website) && (
            <div className="bg-card border border-border rounded-2xl p-5 mb-8 max-w-3xl">
              {profile.bio && <p className="text-sm text-muted-foreground mb-3">{profile.bio}</p>}
              <div className="flex flex-wrap gap-x-5 gap-y-2 text-xs text-muted-foreground">
                {profile.location && (
                  <span className="flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-primary" /> {profile.location}
                  </span>
                )}
                {profile.website && (
                  <a
                    href={profile.website}
                    target="_blank"
                    rel="noreferrer noopener"
                    className="flex items-center gap-1.5 hover:text-foreground"
                  >
                    <Globe className="w-3.5 h-3.5 text-primary" /> Website
                  </a>
                )}
                {profile.instagram && (
                  <span className="flex items-center gap-1.5">
                    <Instagram className="w-3.5 h-3.5 text-primary" /> {profile.instagram}
                  </span>
                )}
                {profile.twitter && (
                  <span className="flex items-center gap-1.5">
                    <Twitter className="w-3.5 h-3.5 text-primary" /> {profile.twitter}
                  </span>
                )}
              </div>
            </div>
          )}

          {/* Works */}
          <h2 className="font-display text-lg font-bold mb-4">Designs</h2>
          {productsLoading ? (
            <div className="flex justify-center py-16">
              <Loader2 className="w-6 h-6 animate-spin text-primary" />
            </div>
          ) : products.length === 0 ? (
            <p className="text-muted-foreground text-sm py-10">
              This creator hasn't published anything yet.
            </p>
          ) : (
            <div className="columns-2 md:columns-3 xl:columns-4 gap-4">
              {products.map((p, i) => (
                <PinCard
                  key={p.id}
                  product={{ ...p, author: profile }}
                  fallbackImage={FALLBACKS[i % FALLBACKS.length]}
                  liked={likedSet?.has(p.id)}
                  onLike={(prod) =>
                    toggleLike.mutate({ productId: prod.id, liked: !!likedSet?.has(prod.id) })
                  }
                  onSave={(prod) => setSaveTarget(prod.id)}
                />
              ))}
            </div>
          )}
        </div>
      </main>

      <SaveToBoardDialog
        productId={saveTarget}
        open={!!saveTarget}
        onOpenChange={(o) => !o && setSaveTarget(null)}
      />
      <Footer />
    </div>
  );
};

export default CreatorProfile;
