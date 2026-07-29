import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import SaveToBoardDialog from "@/components/feed/SaveToBoardDialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import {
  Heart,
  Bookmark,
  Download,
  Loader2,
  Share2,
  MessageCircle,
  ShieldCheck,
  Eye,
} from "lucide-react";
import { useMyLikes, useToggleLike, useComments, useAddComment } from "@/hooks/useSocial";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import fallbackImg from "@/assets/product-ui-kit.jpg";

const DesignDetail = () => {
  const { slug } = useParams<{ slug: string }>();
  const { toast } = useToast();
  const [saveOpen, setSaveOpen] = useState(false);
  const [comment, setComment] = useState("");

  const { data: likedSet } = useMyLikes();
  const toggleLike = useToggleLike();
  const addComment = useAddComment();

  const { data: product, isLoading } = useQuery({
    queryKey: ["product", slug],
    enabled: !!slug,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("products")
        .select("*")
        .eq("slug", slug!)
        .maybeSingle();
      if (error) throw error;
      if (!data) return null;

      const { data: author } = await supabase
        .from("profiles")
        .select("user_id, username, full_name, avatar_url, specialty, follower_count")
        .eq("user_id", data.seller_id)
        .maybeSingle();

      return { ...data, author };
    },
  });

  const { data: comments = [], isLoading: commentsLoading } = useComments(product?.id);

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

  if (!product) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="pt-32 pb-20 text-center container mx-auto px-4">
          <h1 className="font-display text-2xl font-bold mb-3">Design not found</h1>
          <p className="text-muted-foreground mb-6">
            This design may have been removed or is not published yet.
          </p>
          <Button variant="hero" asChild>
            <Link to="/feed">Back to the feed</Link>
          </Button>
        </main>
        <Footer />
      </div>
    );
  }

  const liked = !!likedSet?.has(product.id);
  const authorName = product.author?.full_name || product.author?.username || "African Creator";
  const authorHandle = product.author?.username || product.seller_id;

  const handleShare = async () => {
    const url = window.location.href;
    try {
      if (navigator.share) await navigator.share({ title: product.title, url });
      else {
        await navigator.clipboard.writeText(url);
        toast({ title: "Link copied", description: "Share it with your community." });
      }
    } catch {
      /* dismissed */
    }
  };

  const handleComment = async () => {
    if (!comment.trim()) return;
    await addComment.mutateAsync({ productId: product.id, body: comment });
    setComment("");
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pt-20 sm:pt-24 pb-16">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-5 gap-6 lg:gap-10">
            {/* Media */}
            <div className="lg:col-span-3">
              <div className="rounded-2xl overflow-hidden border border-border bg-card">
                <img
                  src={product.thumbnail_url || fallbackImg}
                  alt={product.title}
                  className="w-full object-cover"
                />
              </div>

              {/* Comments */}
              <section className="mt-8">
                <h2 className="font-display text-lg font-bold mb-4 flex items-center gap-2">
                  <MessageCircle className="w-5 h-5 text-primary" />
                  Comments ({comments.length})
                </h2>

                <div className="flex flex-col sm:flex-row gap-3 mb-6">
                  <Textarea
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    placeholder="Share your thoughts with the creator..."
                    maxLength={800}
                    className="bg-card border-border min-h-[80px]"
                  />
                  <Button
                    variant="hero"
                    className="sm:self-end"
                    disabled={!comment.trim() || addComment.isPending}
                    onClick={handleComment}
                  >
                    {addComment.isPending ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Posting...
                      </>
                    ) : (
                      "Post"
                    )}
                  </Button>
                </div>

                {commentsLoading ? (
                  <Loader2 className="w-5 h-5 animate-spin text-primary" />
                ) : comments.length === 0 ? (
                  <p className="text-sm text-muted-foreground">
                    No comments yet — be the first to give feedback.
                  </p>
                ) : (
                  <ul className="space-y-4">
                    {comments.map((c) => (
                      <li key={c.id} className="flex gap-3">
                        <span className="w-9 h-9 rounded-full bg-gradient-primary shrink-0 flex items-center justify-center overflow-hidden">
                          {c.author?.avatar_url ? (
                            <img src={c.author.avatar_url} alt="" className="w-full h-full object-cover" />
                          ) : (
                            <span className="text-xs font-bold text-primary-foreground">
                              {(c.author?.full_name || c.author?.username || "U")
                                .charAt(0)
                                .toUpperCase()}
                            </span>
                          )}
                        </span>
                        <div className="flex-1 min-w-0 bg-card border border-border rounded-xl p-3">
                          <p className="text-sm font-semibold">
                            {c.author?.full_name || c.author?.username || "Community member"}
                          </p>
                          <p className="text-sm text-muted-foreground mt-1 break-words">{c.body}</p>
                        </div>
                      </li>
                    ))}
                  </ul>
                )}
              </section>
            </div>

            {/* Sidebar */}
            <aside className="lg:col-span-2 space-y-5">
              <div className="bg-card border border-border rounded-2xl p-5 sm:p-6">
                <div className="flex flex-wrap gap-2 mb-3">
                  {product.is_free ? (
                    <Badge className="bg-success text-success-foreground border-0">Free</Badge>
                  ) : (
                    <Badge className="bg-gradient-primary text-primary-foreground border-0">
                      ₵{Number(product.price ?? 0).toFixed(2)}
                    </Badge>
                  )}
                  {product.file_type && (
                    <Badge variant="secondary" className="bg-muted text-muted-foreground">
                      {product.file_type}
                    </Badge>
                  )}
                </div>

                <h1 className="font-display text-xl sm:text-2xl font-bold mb-2">{product.title}</h1>
                <p className="text-muted-foreground text-sm mb-5 whitespace-pre-line">
                  {product.short_description || product.description || "No description provided."}
                </p>

                <div className="flex items-center gap-4 text-xs text-muted-foreground mb-5">
                  <span className="flex items-center gap-1">
                    <Heart className="w-3.5 h-3.5" /> {product.like_count ?? 0}
                  </span>
                  <span className="flex items-center gap-1">
                    <Bookmark className="w-3.5 h-3.5" /> {product.save_count ?? 0}
                  </span>
                  <span className="flex items-center gap-1">
                    <Eye className="w-3.5 h-3.5" /> {product.view_count ?? 0}
                  </span>
                </div>

                <div className="space-y-2.5">
                  <Button variant="hero" className="w-full glow-sm">
                    <Download className="w-4 h-4 mr-2" />
                    {product.is_free ? "Download free" : `Buy for ₵${Number(product.price ?? 0).toFixed(2)}`}
                  </Button>
                  <div className="grid grid-cols-3 gap-2">
                    <Button
                      variant="outline"
                      className={cn("border-border", liked && "border-primary/60 text-primary")}
                      onClick={() => toggleLike.mutate({ productId: product.id, liked })}
                      disabled={toggleLike.isPending}
                    >
                      <Heart className={cn("w-4 h-4", liked && "fill-primary")} />
                    </Button>
                    <Button variant="outline" className="border-border" onClick={() => setSaveOpen(true)}>
                      <Bookmark className="w-4 h-4" />
                    </Button>
                    <Button variant="outline" className="border-border" onClick={handleShare}>
                      <Share2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>

                <p className="flex items-center gap-2 text-xs text-muted-foreground mt-4">
                  <ShieldCheck className="w-3.5 h-3.5 text-success" />
                  Commercial licence included · Secure Cedis checkout
                </p>
              </div>

              {/* Creator card */}
              <Link
                to={`/creator/${authorHandle}`}
                className="block bg-card border border-border rounded-2xl p-5 hover:border-primary/50 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <span className="w-12 h-12 rounded-full bg-gradient-primary flex items-center justify-center overflow-hidden shrink-0">
                    {product.author?.avatar_url ? (
                      <img src={product.author.avatar_url} alt="" className="w-full h-full object-cover" />
                    ) : (
                      <span className="font-bold text-primary-foreground">
                        {authorName.charAt(0).toUpperCase()}
                      </span>
                    )}
                  </span>
                  <div className="min-w-0">
                    <p className="font-semibold truncate">{authorName}</p>
                    <p className="text-xs text-muted-foreground truncate">
                      {product.author?.specialty || "Creative"} ·{" "}
                      {product.author?.follower_count ?? 0} followers
                    </p>
                  </div>
                </div>
              </Link>
            </aside>
          </div>
        </div>
      </main>

      <SaveToBoardDialog productId={product.id} open={saveOpen} onOpenChange={setSaveOpen} />
      <Footer />
    </div>
  );
};

export default DesignDetail;
