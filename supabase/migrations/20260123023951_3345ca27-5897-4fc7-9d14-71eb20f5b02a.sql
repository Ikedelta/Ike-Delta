-- Fix activity_logs insert policy to require authentication
DROP POLICY IF EXISTS "System can insert logs" ON public.activity_logs;

CREATE POLICY "Authenticated users can insert their own logs"
ON public.activity_logs FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Admins can insert any logs"
ON public.activity_logs FOR INSERT
WITH CHECK (public.has_role(auth.uid(), 'admin'));