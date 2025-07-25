-- Create blog categories table
CREATE TABLE public.blog_categories (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  slug TEXT NOT NULL UNIQUE,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create blog tags table for SEO keywords
CREATE TABLE public.blog_tags (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  slug TEXT NOT NULL UNIQUE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create blog posts table
CREATE TABLE public.blog_posts (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  content TEXT NOT NULL,
  excerpt TEXT,
  meta_description TEXT,
  meta_keywords TEXT,
  featured_image_url TEXT,
  author_id UUID NOT NULL,
  category_id UUID REFERENCES public.blog_categories(id) ON DELETE SET NULL,
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'archived')),
  published_at TIMESTAMP WITH TIME ZONE,
  view_count INTEGER NOT NULL DEFAULT 0,
  like_count INTEGER NOT NULL DEFAULT 0,
  comment_count INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create blog post tags junction table
CREATE TABLE public.blog_post_tags (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  post_id UUID NOT NULL REFERENCES public.blog_posts(id) ON DELETE CASCADE,
  tag_id UUID NOT NULL REFERENCES public.blog_tags(id) ON DELETE CASCADE,
  UNIQUE(post_id, tag_id)
);

-- Create blog comments table
CREATE TABLE public.blog_comments (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  post_id UUID NOT NULL REFERENCES public.blog_posts(id) ON DELETE CASCADE,
  user_id UUID NOT NULL,
  parent_id UUID REFERENCES public.blog_comments(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected', 'spam')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create blog likes table
CREATE TABLE public.blog_likes (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  post_id UUID NOT NULL REFERENCES public.blog_posts(id) ON DELETE CASCADE,
  user_id UUID NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(post_id, user_id)
);

-- Create blog post views table for analytics
CREATE TABLE public.blog_post_views (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  post_id UUID NOT NULL REFERENCES public.blog_posts(id) ON DELETE CASCADE,
  user_id UUID,
  ip_address INET,
  user_agent TEXT,
  viewed_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.blog_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.blog_tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.blog_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.blog_post_tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.blog_comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.blog_likes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.blog_post_views ENABLE ROW LEVEL SECURITY;

-- RLS Policies for blog_categories
CREATE POLICY "Everyone can view categories" ON public.blog_categories FOR SELECT USING (true);
CREATE POLICY "Admins can manage categories" ON public.blog_categories FOR ALL USING (is_admin(auth.uid()));

-- RLS Policies for blog_tags
CREATE POLICY "Everyone can view tags" ON public.blog_tags FOR SELECT USING (true);
CREATE POLICY "Admins can manage tags" ON public.blog_tags FOR ALL USING (is_admin(auth.uid()));

-- RLS Policies for blog_posts
CREATE POLICY "Everyone can view published posts" ON public.blog_posts FOR SELECT USING (status = 'published');
CREATE POLICY "Admins can manage all posts" ON public.blog_posts FOR ALL USING (is_admin(auth.uid()));

-- RLS Policies for blog_post_tags
CREATE POLICY "Everyone can view post tags" ON public.blog_post_tags FOR SELECT USING (true);
CREATE POLICY "Admins can manage post tags" ON public.blog_post_tags FOR ALL USING (is_admin(auth.uid()));

-- RLS Policies for blog_comments
CREATE POLICY "Everyone can view approved comments" ON public.blog_comments FOR SELECT USING (status = 'approved');
CREATE POLICY "Users can create comments" ON public.blog_comments FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own comments" ON public.blog_comments FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Admins can manage all comments" ON public.blog_comments FOR ALL USING (is_admin(auth.uid()));

-- RLS Policies for blog_likes
CREATE POLICY "Users can view all likes" ON public.blog_likes FOR SELECT USING (true);
CREATE POLICY "Users can manage their own likes" ON public.blog_likes FOR ALL USING (auth.uid() = user_id);

-- RLS Policies for blog_post_views
CREATE POLICY "Admins can view all post views" ON public.blog_post_views FOR SELECT USING (is_admin(auth.uid()));
CREATE POLICY "Anyone can insert post views" ON public.blog_post_views FOR INSERT WITH CHECK (true);

-- Create indexes for performance
CREATE INDEX idx_blog_posts_slug ON public.blog_posts(slug);
CREATE INDEX idx_blog_posts_status ON public.blog_posts(status);
CREATE INDEX idx_blog_posts_published_at ON public.blog_posts(published_at);
CREATE INDEX idx_blog_posts_category_id ON public.blog_posts(category_id);
CREATE INDEX idx_blog_comments_post_id ON public.blog_comments(post_id);
CREATE INDEX idx_blog_comments_status ON public.blog_comments(status);
CREATE INDEX idx_blog_likes_post_id ON public.blog_likes(post_id);
CREATE INDEX idx_blog_post_views_post_id ON public.blog_post_views(post_id);

-- Create triggers for updated_at columns
CREATE TRIGGER update_blog_categories_updated_at
  BEFORE UPDATE ON public.blog_categories
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_blog_posts_updated_at
  BEFORE UPDATE ON public.blog_posts
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_blog_comments_updated_at
  BEFORE UPDATE ON public.blog_comments
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Function to increment view count
CREATE OR REPLACE FUNCTION public.increment_blog_post_views(post_uuid uuid, user_uuid uuid DEFAULT NULL, ip_addr inet DEFAULT NULL, user_agent_str text DEFAULT NULL)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
BEGIN
  -- Insert view record
  INSERT INTO blog_post_views (post_id, user_id, ip_address, user_agent)
  VALUES (post_uuid, user_uuid, ip_addr, user_agent_str);
  
  -- Update view count on post
  UPDATE blog_posts 
  SET view_count = view_count + 1
  WHERE id = post_uuid;
  
  RETURN true;
EXCEPTION
  WHEN OTHERS THEN
    RETURN false;
END;
$function$;

-- Function to toggle blog post like
CREATE OR REPLACE FUNCTION public.toggle_blog_post_like(post_uuid uuid, user_uuid uuid)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
DECLARE
  like_exists boolean;
  new_like_count integer;
BEGIN
  -- Check if like exists
  SELECT EXISTS(
    SELECT 1 FROM blog_likes 
    WHERE post_id = post_uuid AND user_id = user_uuid
  ) INTO like_exists;
  
  IF like_exists THEN
    -- Remove like
    DELETE FROM blog_likes 
    WHERE post_id = post_uuid AND user_id = user_uuid;
    
    -- Update like count
    UPDATE blog_posts 
    SET like_count = like_count - 1
    WHERE id = post_uuid
    RETURNING like_count INTO new_like_count;
    
    RETURN jsonb_build_object(
      'liked', false,
      'like_count', new_like_count
    );
  ELSE
    -- Add like
    INSERT INTO blog_likes (post_id, user_id)
    VALUES (post_uuid, user_uuid);
    
    -- Update like count
    UPDATE blog_posts 
    SET like_count = like_count + 1
    WHERE id = post_uuid
    RETURNING like_count INTO new_like_count;
    
    RETURN jsonb_build_object(
      'liked', true,
      'like_count', new_like_count
    );
  END IF;
END;
$function$;