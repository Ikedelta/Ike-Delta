import { useEffect, useMemo, useState, useRef, useCallback } from "react";
import { useInfiniteQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import PinCard, { PinProduct } from "@/components/feed/PinCard";
import SaveToBoardDialog from "@/components/feed/SaveToBoardDialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2, Search, Sparkles, Flame, Clock, Users } from "lucide-react";
import { useMyLikes, useToggleLike } from "@/hooks/useSocial";
import { useAuth } from "@/contexts/AuthContext";
import { cn } from "@/lib/utils";
import fallback1 from "@/assets/product-ui-kit.jpg";
import fallback2 from "@/assets/product-patterns.jpg";
import fallback3 from "@/assets/product-branding.jpg";
import fallback4 from "@/assets/product-icons.jpg";
import fallback5 from "@/assets/product-mobile.jpg";
import fallback6 from "@/assets/product-social.jpg";

const FALLBACKS = [fallback1, fallback2, fallback3, fallback4, fallback5, fallback6];
const PAGE_SIZE = 24;

type FeedTab = "for-you" | "trending" | "fresh" | "following";

const TABS: { id: FeedTab; label: string; icon: typeof Sparkles }[] = [
  { id: "for-you", label: "For You", icon: Sparkles },
  { id: "trending", label: "Trending", icon: Flame },
  { id: "fresh", label: "Fresh", icon: Clock },
  { id: "following", label: "Following", icon: Users },
];

const Feed = () => {
  const { user } = useAuth();
  const [tab, setTab] = useState<FeedTab>("for-you");
  const [searchInput, setSearchInput] = useState("");
  const [search, setSearch] = useState("");
  const [saveTarget, setSaveTarget] = useState<string | null>(null);
  const sentinelRef = useRef<HTMLDivElement | null>(null);

  const { data: likedSet } = useMyLikes();
  const toggleLike = useToggleLike();

  useEffect(() => {
    const t = setTimeout(() => setSearch(searchInput.trim()), 350);
    return () => clearTimeout(t);
  }, [searchInput]);

  const query = useInfiniteQuery({
    queryKey: ["feed", tab, search, user?.id],
    initialPageParam: 0,
    queryFn: async ({ pageParam }) => {
      const from = (pageParam as number) * PAGE_SIZE;
      const to = from + PAGE_SIZE - 1;

      let followingIds: string[] | null = null;
      if (tab === "following" && user) {
        const { data: follows } = await supabase
          .from("follows")
          .select("following_id")
          .eq("follower_id", user.id);
        followingIds = (follows ?? []).map((f) => f.following_id as string);
        if (followingIds.length === 0) return { items: [] as PinProduct[], next: null };
      }

      let q = supabase
        .from("products")
        .select(
          "id, title, slug, price, is_free, thumbnail_url, like_count, save_count, tags, seller_id"
        )
        .eq("status", "published");

      if (search) q = q.ilike("title", `%${search}%`);
      if (followingIds) q = q.in("seller_id", followingIds);

      q =
        tab === "trending"
          ? q.order("like_count", { ascending: false }).order("created_at", { ascending: false })
          : q.order("created_at", { ascending: false });

      const { data, error } = await q.range(from, to);
      if (error) throw error;

      const rows = (data ?? []) as unknown as PinProduct[];
      const sellerIds = [...new Set(rows.map((r) => r.seller_id))];
      if (sellerIds.length) {
        const { data: profiles } = await supabase
          .from("profiles")
          .select("user_id, username, full_name, avatar_url")
          .in("user_id", sellerIds);
        const map = new Map((profiles ?? []).map((p) => [p.user_id, p]));
        rows.forEach((r) => {
          r.author = (map.get(r.seller_id) as PinProduct["author"]) ?? null;
        });
      }

      return {
        items: rows,
        next: rows.length === PAGE_SIZE ? (pageParam as number) + 1 : null,
      };
    },
    getNextPageParam: (last) => last.next,
  });

  const items = useMemo(
    () => query.data?.pages.flatMap((p) => p.items) ?? [],
    [query.data]
  );

  const loadMore = useCallback(() => {
    if (query.hasNextPage && !query.isFetchingNextPage) query.fetchNextPage();
  }, [query]);

  useEffect(() => {
    const el = sentinelRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      (entries) => entries[0]?.isIntersecting && loadMore(),
      { rootMargin: "600px" }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [loadMore]);

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pt-20 sm:pt-24 pb-16">
        <div className="container mx-auto px-4">
          {/* Heading */}
          <div className="mb-6 sm:mb-8">
            <h1 className="font-display text-2xl sm:text-4xl font-bold mb-2">
              The <span className="text-gradient">Creative Feed</span>
            </h1>
            <p className="text-muted-foreground text-sm sm:text-base max-w-2xl">
              Discover design files, mockups and inspiration from African creators — save what you
              love, follow the makers behind it.
            </p>
          </div>

          {/* Controls */}
          <div className="flex flex-col lg:flex-row gap-3 lg:items-center mb-8 sticky top-14 sm:top-16 lg:top-20 z-30 py-3 bg-background/85 backdrop-blur-md -mx-4 px-4">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                placeholder="Search designs, mockups, patterns..."
                className="pl-11 h-11 bg-card border-border"
              />
            </div>
            <div className="flex gap-2 overflow-x-auto pb-1 lg:pb-0 -mx-1 px-1">
              {TABS.map((t) => (
                <button
                  key={t.id}
                  onClick={() => setTab(t.id)}
                  className={cn(
                    "flex items-center gap-1.5 h-10 px-4 rounded-full text-sm font-medium whitespace-nowrap transition-colors border",
                    tab === t.id
                      ? "bg-gradient-primary text-primary-foreground border-transparent glow-sm"
                      : "border-border text-muted-foreground hover:text-foreground hover:border-primary/40"
                  )}
                >
                  <t.icon className="w-4 h-4" />
                  {t.label}
                </button>
              ))}
            </div>
          </div>

          {/* Masonry */}
          {query.isLoading ? (
            <div className="flex justify-center py-24">
              <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
          ) : items.length === 0 ? (
            <div className="text-center py-20 sm:py-28">
              <div className="w-16 h-16 mx-auto rounded-2xl bg-gradient-primary flex items-center justify-center mb-5 glow-sm">
                <Sparkles className="w-7 h-7 text-primary-foreground" />
              </div>
              <h2 className="font-display text-xl font-bold mb-2">Nothing here yet</h2>
              <p className="text-muted-foreground text-sm max-w-sm mx-auto mb-6">
                {tab === "following"
                  ? "Follow a few creators and their newest work will land right here."
                  : "New designs are added every day. Check back soon or explore the marketplace."}
              </p>
              <Button variant="hero" onClick={() => setTab("fresh")}>
                Browse everything
              </Button>
            </div>
          ) : (
            <div className="columns-2 md:columns-3 xl:columns-4 2xl:columns-5 gap-4">
              {items.map((product, i) => (
                <PinCard
                  key={product.id}
                  product={product}
                  fallbackImage={FALLBACKS[i % FALLBACKS.length]}
                  liked={likedSet?.has(product.id)}
                  onLike={(p) =>
                    toggleLike.mutate({ productId: p.id, liked: !!likedSet?.has(p.id) })
                  }
                  onSave={(p) => setSaveTarget(p.id)}
                />
              ))}
            </div>
          )}

          <div ref={sentinelRef} className="h-8" />
          {query.isFetchingNextPage && (
            <div className="flex justify-center py-6">
              <Loader2 className="w-6 h-6 animate-spin text-primary" />
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

export default Feed;
