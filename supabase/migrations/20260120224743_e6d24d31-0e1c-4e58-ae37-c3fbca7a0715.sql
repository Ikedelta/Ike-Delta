-- Add admin role to profiles
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS role text DEFAULT 'user';

-- Create admin_settings table for web content management
CREATE TABLE public.admin_settings (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  key text NOT NULL UNIQUE,
  value jsonb NOT NULL DEFAULT '{}',
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Create blog_posts table
CREATE TABLE public.blog_posts (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  author_id uuid NOT NULL,
  title text NOT NULL,
  slug text NOT NULL UNIQUE,
  content text,
  excerpt text,
  cover_image text,
  status text DEFAULT 'draft',
  published_at timestamp with time zone,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Create payment_transactions table for Paystack
CREATE TABLE public.payment_transactions (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid NOT NULL,
  product_id uuid,
  amount numeric NOT NULL,
  currency text DEFAULT 'GHS',
  payment_method text,
  reference text UNIQUE,
  paystack_reference text,
  status text DEFAULT 'pending',
  metadata jsonb DEFAULT '{}',
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Create contact_messages table
CREATE TABLE public.contact_messages (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name text NOT NULL,
  email text NOT NULL,
  subject text,
  message text NOT NULL,
  status text DEFAULT 'unread',
  replied_at timestamp with time zone,
  created_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.admin_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.blog_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payment_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contact_messages ENABLE ROW LEVEL SECURITY;

-- Create security definer function for admin check
CREATE OR REPLACE FUNCTION public.is_admin(user_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.profiles
    WHERE profiles.user_id = $1 AND role = 'admin'
  )
$$;

-- Admin settings policies (admin only)
CREATE POLICY "Admins can view settings" ON public.admin_settings
FOR SELECT USING (public.is_admin(auth.uid()));

CREATE POLICY "Admins can manage settings" ON public.admin_settings
FOR ALL USING (public.is_admin(auth.uid()));

-- Blog posts policies
CREATE POLICY "Published posts are viewable by everyone" ON public.blog_posts
FOR SELECT USING (status = 'published' OR author_id = auth.uid() OR public.is_admin(auth.uid()));

CREATE POLICY "Admins can manage posts" ON public.blog_posts
FOR ALL USING (public.is_admin(auth.uid()));

-- Payment transactions policies
CREATE POLICY "Users can view their own transactions" ON public.payment_transactions
FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create transactions" ON public.payment_transactions
FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Admins can view all transactions" ON public.payment_transactions
FOR SELECT USING (public.is_admin(auth.uid()));

-- Contact messages policies
CREATE POLICY "Anyone can submit contact" ON public.contact_messages
FOR INSERT WITH CHECK (true);

CREATE POLICY "Admins can view messages" ON public.contact_messages
FOR SELECT USING (public.is_admin(auth.uid()));

CREATE POLICY "Admins can update messages" ON public.contact_messages
FOR UPDATE USING (public.is_admin(auth.uid()));

-- Add triggers for updated_at
CREATE TRIGGER update_admin_settings_updated_at
BEFORE UPDATE ON public.admin_settings
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_blog_posts_updated_at
BEFORE UPDATE ON public.blog_posts
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_payment_transactions_updated_at
BEFORE UPDATE ON public.payment_transactions
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();