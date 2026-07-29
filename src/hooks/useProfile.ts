import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

export interface AppProfile {
  id: string;
  user_id: string;
  username: string | null;
  full_name: string | null;
  avatar_url: string | null;
  banner_url: string | null;
  bio: string | null;
  location: string | null;
  website: string | null;
  specialty: string | null;
  is_creator: boolean;
  follower_count: number;
  following_count: number;
  instagram: string | null;
  twitter: string | null;
  behance: string | null;
}

/** Current signed-in user's profile. */
export const useMyProfile = () => {
  const { user } = useAuth();

  return useQuery({
    queryKey: ["my-profile", user?.id],
    enabled: !!user?.id,
    staleTime: 60_000,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("user_id", user!.id)
        .maybeSingle();
      if (error) throw error;
      return (data as unknown as AppProfile) ?? null;
    },
  });
};

/** Public profile lookup by username (falls back to user id). */
export const usePublicProfile = (handle?: string) => {
  return useQuery({
    queryKey: ["public-profile", handle],
    enabled: !!handle,
    queryFn: async () => {
      const isUuid = /^[0-9a-f-]{36}$/i.test(handle!);
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq(isUuid ? "user_id" : "username", handle!)
        .maybeSingle();
      if (error) throw error;
      return (data as unknown as AppProfile) ?? null;
    },
  });
};

/** Application status for the current user, if any. */
export const useMyCreatorApplication = () => {
  const { user } = useAuth();

  return useQuery({
    queryKey: ["creator-application", user?.id],
    enabled: !!user?.id,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("creator_applications")
        .select("*")
        .eq("user_id", user!.id)
        .maybeSingle();
      if (error) throw error;
      return data;
    },
  });
};
