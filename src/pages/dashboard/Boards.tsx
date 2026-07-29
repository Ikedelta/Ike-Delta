import { useState } from "react";
import { Link } from "react-router-dom";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useMyBoards, useCreateBoard } from "@/hooks/useSocial";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Loader2, Plus, Lock, Trash2, FolderOpen } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const Boards = () => {
  const { data: boards = [], isLoading } = useMyBoards();
  const createBoard = useCreateBoard();
  const qc = useQueryClient();
  const { toast } = useToast();

  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [isPrivate, setIsPrivate] = useState(false);
  const [deleting, setDeleting] = useState<string | null>(null);
  const [active, setActive] = useState<string | null>(null);

  const { data: items = [], isLoading: itemsLoading } = useQuery({
    queryKey: ["board-items", active],
    enabled: !!active,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("board_items")
        .select("id, product_id, products(id, title, slug, thumbnail_url, price, is_free)")
        .eq("board_id", active!)
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data ?? [];
    },
  });

  const handleCreate = async () => {
    if (!name.trim()) return;
    await createBoard.mutateAsync({ name: name.trim(), isPrivate });
    setName("");
    setIsPrivate(false);
    setOpen(false);
  };

  const handleDelete = async (id: string) => {
    setDeleting(id);
    try {
      const { error } = await supabase.from("boards").delete().eq("id", id);
      if (error) throw error;
      if (active === id) setActive(null);
      qc.invalidateQueries({ queryKey: ["my-boards"] });
      toast({ title: "Board deleted" });
    } catch (e) {
      toast({
        title: "Could not delete",
        description: e instanceof Error ? e.message : "Try again",
        variant: "destructive",
      });
    } finally {
      setDeleting(null);
    }
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="font-display text-2xl sm:text-3xl font-bold mb-1">My Boards</h1>
          <p className="text-muted-foreground text-sm">
            Collections of designs you've saved from across the platform.
          </p>
        </div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button variant="hero" className="glow-sm">
              <Plus className="w-4 h-4 mr-2" />
              New board
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-card border-border max-w-md">
            <DialogHeader>
              <DialogTitle className="font-display">Create a board</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="board-name">Name</Label>
                <Input
                  id="board-name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Kente inspiration"
                  className="bg-background border-border"
                  maxLength={60}
                />
              </div>
              <div className="flex items-center justify-between">
                <Label htmlFor="board-private" className="text-sm text-muted-foreground">
                  Keep this board private
                </Label>
                <Switch id="board-private" checked={isPrivate} onCheckedChange={setIsPrivate} />
              </div>
              <Button
                variant="hero"
                className="w-full"
                onClick={handleCreate}
                disabled={!name.trim() || createBoard.isPending}
              >
                {createBoard.isPending ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Creating...
                  </>
                ) : (
                  "Create board"
                )}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-20">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      ) : boards.length === 0 ? (
        <div className="bg-card border border-border rounded-2xl p-8 text-center">
          <FolderOpen className="w-10 h-10 mx-auto text-primary mb-3" />
          <h2 className="font-display font-bold mb-2">No boards yet</h2>
          <p className="text-muted-foreground text-sm mb-5">
            Save designs from the feed into boards to keep your ideas organised.
          </p>
          <Button variant="hero" asChild>
            <Link to="/feed">Explore the feed</Link>
          </Button>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {boards.map((b) => (
            <div
              key={b.id}
              className={`bg-card border rounded-2xl p-5 transition-colors ${
                active === b.id ? "border-primary" : "border-border hover:border-primary/40"
              }`}
            >
              <button
                type="button"
                onClick={() => setActive(active === b.id ? null : b.id)}
                className="w-full text-left"
              >
                <div className="flex items-center gap-2 mb-1">
                  <FolderOpen className="w-4 h-4 text-primary shrink-0" />
                  <span className="font-display font-semibold truncate">{b.name}</span>
                  {b.is_private && <Lock className="w-3.5 h-3.5 text-muted-foreground" />}
                </div>
                <p className="text-xs text-muted-foreground">{b.item_count} saved</p>
              </button>
              <Button
                size="sm"
                variant="ghost"
                className="mt-3 text-muted-foreground hover:text-destructive"
                onClick={() => handleDelete(b.id)}
                disabled={deleting === b.id}
              >
                {deleting === b.id ? (
                  <Loader2 className="w-3.5 h-3.5 mr-1.5 animate-spin" />
                ) : (
                  <Trash2 className="w-3.5 h-3.5 mr-1.5" />
                )}
                Delete
              </Button>
            </div>
          ))}
        </div>
      )}

      {active && (
        <section className="mt-8">
          <h2 className="font-display text-lg font-bold mb-4">Saved in this board</h2>
          {itemsLoading ? (
            <Loader2 className="w-6 h-6 animate-spin text-primary" />
          ) : items.length === 0 ? (
            <p className="text-sm text-muted-foreground">Nothing saved here yet.</p>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
              {items.map((item) => {
                const p = item.products as unknown as {
                  slug: string;
                  title: string;
                  thumbnail_url: string | null;
                  price: number | null;
                  is_free: boolean | null;
                } | null;
                if (!p) return null;
                return (
                  <Link
                    key={item.id}
                    to={`/design/${p.slug}`}
                    className="bg-card border border-border rounded-xl overflow-hidden card-hover"
                  >
                    {p.thumbnail_url && (
                      <img
                        src={p.thumbnail_url}
                        alt={p.title}
                        loading="lazy"
                        className="w-full aspect-[4/3] object-cover"
                      />
                    )}
                    <div className="p-3">
                      <p className="text-sm font-medium line-clamp-1">{p.title}</p>
                      <p className="text-xs text-muted-foreground mt-1">
                        {p.is_free ? "Free" : `₵${Number(p.price ?? 0).toFixed(2)}`}
                      </p>
                    </div>
                  </Link>
                );
              })}
            </div>
          )}
        </section>
      )}
    </div>
  );
};

export default Boards;
