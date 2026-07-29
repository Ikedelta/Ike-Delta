import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Loader2, Search, UserPlus, UserCheck, Users, Sparkles } from "lucide-react";
import { useIsFollowing, useToggleFollow } from "@/hooks/useSocial";
import { AppProfile } from "@/hooks/useProfile";
import { useAuth } from "@/contexts/AuthContext";

const FollowButton = ({ creatorId }: { creatorId: string }) => {
  const { data: isFollowing } = useIsFollowing(creatorId);
  const toggleFollow = useToggleFollow();
  return (
    <Button
      size="sm"
      variant={isFollowing ? "outline" : "hero"}
      className={isFollowing ? "border-border" : ""}
      disabled={toggleFollow.isPending}
      onClick={(e) => {
        e.preventDefault();
        toggleFollow.mutate({ creatorId, following: !!isFollowing });
      }}
    >
      {toggleFollow.isPending ? (
        <Loader2 className="w-3.5 h-3.5 animate-spin" />
      ) : isFollowing ? (
        <>
          <UserCheck className="w-3.5 h-3.5 mr-1.5" /> Following
        </>
      ) : (
        <>
          <UserPlus className="w-3.5 h-3.5 mr-1.5" /> Follow
        </>
      )}
    </Button>
  );
};

const Creators = () => {
  const { user } = useAuth();
  const [input, setInput] = useState("");
  const [search, setSearch] = useState("");

  useEffect(() => {
    const t = setTimeout(() => setSearch(input.trim()), 350);
    return () => clearTimeout(t);
  }, [input]);

  const { data: creators = [], isLoading } = useQuery({
    queryKey: ["creators", search],
    queryFn: async () => {
      let q = supabase
        .from("profiles")
        .select("*")
        .eq("is_creator", true)
        .order("follower_count", { ascending: false })
        .limit(60);
      if (search) q = q.ilike("full_name", `%${search}%`);
      const { data, error } = await q;
      if (error) throw error;
      return (data ?? []) as unknown as AppProfile[];
    },
  });

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pt-20 sm:pt-24 pb-16">
        <div className="container mx-auto px-4">
          <div className="mb-6 sm:mb-8">
            <h1 className="font-display text-2xl sm:text-4xl font-bold mb-2">
              Meet the <span className="text-gradient">Creators</span>
            </h1>
            <p className="text-muted-foreground text-sm sm:text-base max-w-2xl">
              Designers, illustrators and studios across Africa sharing and selling their craft.
            </p>
          </div>

          <div className="relative mb-8 max-w-xl">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Search creators by name..."
              className="pl-11 h-11 bg-card border-border"
            />
          </div>

          {isLoading ? (
            <div className="flex justify-center py-20">
              <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
          ) : creators.length === 0 ? (
            <div className="text-center py-20">
              <div className="w-16 h-16 mx-auto rounded-2xl bg-gradient-accent flex items-center justify-center mb-5">
                <Users className="w-7 h-7 text-accent-foreground" />
              </div>
              <h2 className="font-display text-xl font-bold mb-2">No creators yet</h2>
              <p className="text-muted-foreground text-sm mb-6">
                Be one of the first to publish your work on the platform.
              </p>
              <Button variant="hero" asChild>
                <Link to="/dashboard/become-creator">
                  <Sparkles className="w-4 h-4 mr-2" />
                  Apply to be a creator
                </Link>
              </Button>
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-5">
              {creators.map((c) => {
                const name = c.full_name || c.username || "African Creator";
                return (
                  <Link
                    key={c.user_id}
                    to={`/creator/${c.username || c.user_id}`}
                    className="bg-card border border-border rounded-2xl overflow-hidden card-hover"
                  >
                    <div className="h-20 bg-mesh" />
                    <div className="p-4 sm:p-5 -mt-10">
                      <span className="w-16 h-16 rounded-2xl bg-gradient-primary border-4 border-card flex items-center justify-center overflow-hidden">
                        {c.avatar_url ? (
                          <img src={c.avatar_url} alt={name} className="w-full h-full object-cover" />
                        ) : (
                          <span className="text-xl font-bold text-primary-foreground">
                            {name.charAt(0).toUpperCase()}
                          </span>
                        )}
                      </span>
                      <h3 className="font-display font-semibold mt-3 truncate">{name}</h3>
                      <p className="text-xs text-muted-foreground truncate">
                        {c.specialty || "Creative"}
                      </p>
                      {c.location && (
                        <Badge variant="secondary" className="mt-2 bg-muted text-muted-foreground text-[10px]">
                          {c.location}
                        </Badge>
                      )}
                      <div className="flex items-center justify-between gap-2 mt-4">
                        <span className="text-xs text-muted-foreground">
                          <strong className="text-foreground">{c.follower_count}</strong> followers
                        </span>
                        {user?.id !== c.user_id && <FollowButton creatorId={c.user_id} />}
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Creators;
