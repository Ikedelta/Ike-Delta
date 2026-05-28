import { useAuth } from "@/contexts/AuthContext";

// NOTE: Security layer temporarily disabled per user request.
// All authenticated and unauthenticated users are treated as admins.
export const useAdminCheck = () => {
  const { user } = useAuth();
  return { isAdmin: true, loading: false, user };
};
