import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";

/* ---------------- Likes ---------------- */

export const useMyLikes = () => {
  const { user } = useAuth();
  return useQuery({
    queryKey: ["my-likes", user?.id],
    enabled: !!user?.id,
    staleTime: 30_000,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("likes")
        .select("product_id")
        .eq("user_id", user!.id);
      if (error) throw error;
      return new Set((data ?? []).map((r) => r.product_id as string));
    },
  });
};

export const useToggleLike = () => {
  const { user } = useAuth();
  const qc = useQueryClient();
  const { toast } = useToast();
  const navigate = useNavigate();

  return useMutation({
    mutationFn: async ({ productId, liked }: { productId: string; liked: boolean }) => {
      if (!user) throw new Error("AUTH_REQUIRED");
      if (liked) {
        const { error } = await supabase
          .from("likes")
          .delete()
          .eq("user_id", user.id)
          .eq("product_id", productId);
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from("likes")
          .insert({ user_id: user.id, product_id: productId });
        if (error) throw error;
      }
      return !liked;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["my-likes"] });
      qc.invalidateQueries({ queryKey: ["feed"] });
      qc.invalidateQueries({ queryKey: ["product"] });
    },
    onError: (e: Error) => {
      if (e.message === "AUTH_REQUIRED") {
        toast({ title: "Sign in required", description: "Create a free account to like designs." });
        navigate("/auth/login");
        return;
      }
      toast({ title: "Something went wrong", description: e.message, variant: "destructive" });
    },
  });
};

/* ---------------- Follows ---------------- */

export const useIsFollowing = (creatorId?: string) => {
  const { user } = useAuth();
  return useQuery({
    queryKey: ["is-following", user?.id, creatorId],
    enabled: !!user?.id && !!creatorId,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("follows")
        .select("id")
        .eq("follower_id", user!.id)
        .eq("following_id", creatorId!)
        .maybeSingle();
      if (error) throw error;
      return !!data;
    },
  });
};

export const useToggleFollow = () => {
  const { user } = useAuth();
  const qc = useQueryClient();
  const { toast } = useToast();
  const navigate = useNavigate();

  return useMutation({
    mutationFn: async ({ creatorId, following }: { creatorId: string; following: boolean }) => {
      if (!user) throw new Error("AUTH_REQUIRED");
      if (following) {
        const { error } = await supabase
          .from("follows")
          .delete()
          .eq("follower_id", user.id)
          .eq("following_id", creatorId);
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from("follows")
          .insert({ follower_id: user.id, following_id: creatorId });
        if (error) throw error;
      }
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["is-following"] });
      qc.invalidateQueries({ queryKey: ["public-profile"] });
      qc.invalidateQueries({ queryKey: ["creators"] });
    },
    onError: (e: Error) => {
      if (e.message === "AUTH_REQUIRED") {
        toast({ title: "Sign in required", description: "Sign in to follow creators." });
        navigate("/auth/login");
        return;
      }
      toast({ title: "Something went wrong", description: e.message, variant: "destructive" });
    },
  });
};

/* ---------------- Boards ---------------- */

export const useMyBoards = () => {
  const { user } = useAuth();
  return useQuery({
    queryKey: ["my-boards", user?.id],
    enabled: !!user?.id,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("boards")
        .select("*")
        .eq("user_id", user!.id)
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data ?? [];
    },
  });
};

const slugify = (s: string) =>
  s.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "").slice(0, 60) ||
  `board-${Date.now()}`;

export const useCreateBoard = () => {
  const { user } = useAuth();
  const qc = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({ name, isPrivate }: { name: string; isPrivate: boolean }) => {
      if (!user) throw new Error("AUTH_REQUIRED");
      const { data, error } = await supabase
        .from("boards")
        .insert({ user_id: user.id, name, slug: slugify(name), is_private: isPrivate })
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["my-boards"] });
      toast({ title: "Board created" });
    },
    onError: (e: Error) =>
      toast({ title: "Could not create board", description: e.message, variant: "destructive" }),
  });
};

export const useSaveToBoard = () => {
  const { user } = useAuth();
  const qc = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({ boardId, productId }: { boardId: string; productId: string }) => {
      if (!user) throw new Error("AUTH_REQUIRED");
      const { error } = await supabase
        .from("board_items")
        .insert({ board_id: boardId, product_id: productId, user_id: user.id });
      if (error) throw error;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["my-boards"] });
      qc.invalidateQueries({ queryKey: ["board-items"] });
      toast({ title: "Saved to board" });
    },
    onError: (e: Error) =>
      toast({
        title: e.message.includes("duplicate") ? "Already saved" : "Could not save",
        description: e.message.includes("duplicate") ? "This design is already on that board." : e.message,
        variant: e.message.includes("duplicate") ? "default" : "destructive",
      }),
  });
};

/* ---------------- Comments ---------------- */

export const useComments = (productId?: string) => {
  return useQuery({
    queryKey: ["comments", productId],
    enabled: !!productId,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("comments")
        .select("id, body, created_at, user_id")
        .eq("product_id", productId!)
        .order("created_at", { ascending: false })
        .limit(100);
      if (error) throw error;

      const ids = [...new Set((data ?? []).map((c) => c.user_id))];
      if (!ids.length) return [];
      const { data: profiles } = await supabase
        .from("profiles")
        .select("user_id, full_name, username, avatar_url")
        .in("user_id", ids);
      const map = new Map((profiles ?? []).map((p) => [p.user_id, p]));
      return (data ?? []).map((c) => ({ ...c, author: map.get(c.user_id) ?? null }));
    },
  });
};

export const useAddComment = () => {
  const { user } = useAuth();
  const qc = useQueryClient();
  const { toast } = useToast();
  const navigate = useNavigate();

  return useMutation({
    mutationFn: async ({ productId, body }: { productId: string; body: string }) => {
      if (!user) throw new Error("AUTH_REQUIRED");
      const { error } = await supabase
        .from("comments")
        .insert({ product_id: productId, user_id: user.id, body: body.trim() });
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["comments"] }),
    onError: (e: Error) => {
      if (e.message === "AUTH_REQUIRED") {
        toast({ title: "Sign in required", description: "Sign in to join the conversation." });
        navigate("/auth/login");
        return;
      }
      toast({ title: "Could not post comment", description: e.message, variant: "destructive" });
    },
  });
};
