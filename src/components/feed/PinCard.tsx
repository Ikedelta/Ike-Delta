import { Link } from "react-router-dom";
import { Heart, Bookmark, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

export interface PinAuthor {
  user_id: string;
  username: string | null;
  full_name: string | null;
  avatar_url: string | null;
}

export interface PinProduct {
  id: string;
  title: string;
  slug: string;
  price: number | null;
  is_free: boolean | null;
  thumbnail_url: string | null;
  like_count: number | null;
  save_count: number | null;
  tags: string[] | null;
  seller_id: string;
  author?: PinAuthor | null;
}

interface PinCardProps {
  product: PinProduct;
  liked?: boolean;
  onLike?: (product: PinProduct) => void;
  onSave?: (product: PinProduct) => void;
  fallbackImage: string;
}

const PinCard = ({ product, liked, onLike, onSave, fallbackImage }: PinCardProps) => {
  const authorName =
    product.author?.full_name || product.author?.username || "African Creator";
  const authorHandle = product.author?.username || product.seller_id;

  return (
    <article className="mb-4 break-inside-avoid group">
      <div className="relative overflow-hidden rounded-2xl bg-card border border-border">
        <Link to={`/design/${product.slug}`} aria-label={product.title}>
          <img
            src={product.thumbnail_url || fallbackImage}
            alt={product.title}
            loading="lazy"
            className="w-full object-cover transition-transform duration-700 group-hover:scale-105"
          />
        </Link>

        {/* Overlay */}
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-background via-background/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

        <div className="absolute top-3 left-3 flex flex-wrap gap-1.5">
          {product.is_free ? (
            <Badge className="bg-success text-success-foreground border-0 text-[10px]">Free</Badge>
          ) : (
            <Badge className="bg-gradient-primary text-primary-foreground border-0 text-[10px]">
              ₵{Number(product.price ?? 0).toFixed(0)}
            </Badge>
          )}
        </div>

        <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 focus-within:opacity-100 transition-opacity">
          <Button
            size="sm"
            variant="hero"
            className="h-8 rounded-full px-3 text-xs"
            onClick={() => onSave?.(product)}
          >
            <Bookmark className="w-3.5 h-3.5 mr-1.5" />
            Save
          </Button>
        </div>

        <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            type="button"
            onClick={() => onLike?.(product)}
            aria-label={liked ? "Unlike" : "Like"}
            className="h-9 w-9 rounded-full glass flex items-center justify-center hover:bg-primary/20 transition-colors"
          >
            <Heart
              className={cn("w-4 h-4", liked ? "fill-primary text-primary" : "text-foreground")}
            />
          </button>
          <Link
            to={`/design/${product.slug}`}
            className="h-9 w-9 rounded-full glass flex items-center justify-center hover:bg-accent/20 transition-colors"
            aria-label="Comments"
          >
            <MessageCircle className="w-4 h-4" />
          </Link>
        </div>
      </div>

      {/* Meta */}
      <div className="px-1 pt-2.5">
        <Link
          to={`/design/${product.slug}`}
          className="block font-semibold text-sm text-foreground line-clamp-1 hover:text-primary transition-colors"
        >
          {product.title}
        </Link>
        <div className="flex items-center justify-between gap-2 mt-1.5">
          <Link
            to={`/creator/${authorHandle}`}
            className="flex items-center gap-2 min-w-0 group/author"
          >
            <span className="w-6 h-6 rounded-full bg-gradient-primary shrink-0 flex items-center justify-center overflow-hidden">
              {product.author?.avatar_url ? (
                <img src={product.author.avatar_url} alt="" className="w-full h-full object-cover" />
              ) : (
                <span className="text-[10px] font-bold text-primary-foreground">
                  {authorName.charAt(0).toUpperCase()}
                </span>
              )}
            </span>
            <span className="text-xs text-muted-foreground truncate group-hover/author:text-foreground transition-colors">
              {authorName}
            </span>
          </Link>
          <span className="flex items-center gap-1 text-xs text-muted-foreground shrink-0">
            <Heart className="w-3.5 h-3.5" />
            {product.like_count ?? 0}
          </span>
        </div>
      </div>
    </article>
  );
};

export default PinCard;
