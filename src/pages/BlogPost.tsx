import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import Layout from "@/components/Layout";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { 
  Heart, 
  MessageCircle, 
  Eye, 
  Calendar, 
  User, 
  Tag, 
  Share2, 
  ArrowLeft,
  Send
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useContext } from "react";
import { AuthContext } from "@/components/AuthProvider";

interface BlogPost {
  id: string;
  title: string;
  content: string;
  excerpt: string;
  featured_image_url: string | null;
  meta_description: string | null;
  meta_keywords: string | null;
  view_count: number;
  like_count: number;
  comment_count: number;
  published_at: string;
  author_id: string;
  blog_categories?: {
    name: string;
    slug: string;
  } | null;
  profiles?: {
    name: string;
  } | null;
}

interface BlogComment {
  id: string;
  content: string;
  created_at: string;
  user_id: string;
  profiles?: {
    name: string;
  } | null;
}

const BlogPost = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  
  const [post, setPost] = useState<BlogPost | null>(null);
  const [comments, setComments] = useState<BlogComment[]>([]);
  const [loading, setLoading] = useState(true);
  const [isLiked, setIsLiked] = useState(false);
  const [newComment, setNewComment] = useState("");
  const [submittingComment, setSubmittingComment] = useState(false);

  useEffect(() => {
    if (slug) {
      fetchPost();
      incrementViewCount();
    }
  }, [slug]);

  useEffect(() => {
    if (post && user) {
      checkIfLiked();
    }
  }, [post, user]);

  const fetchPost = async () => {
    try {
      const { data, error } = await supabase
        .from('blog_posts')
        .select(`
          *,
          blog_categories (
            name,
            slug
          ),
          profiles (
            name
          )
        `)
        .eq('slug', slug)
        .eq('status', 'published')
        .single();

      if (error) throw error;
      
      if (!data) {
        navigate('/blog');
        return;
      }

      setPost(data as unknown as BlogPost);
      fetchComments(data.id);
    } catch (error) {
      console.error('Error fetching post:', error);
      navigate('/blog');
    } finally {
      setLoading(false);
    }
  };

  const fetchComments = async (postId: string) => {
    try {
      const { data, error } = await supabase
        .from('blog_comments')
        .select(`
          *,
          profiles (
            name
          )
        `)
        .eq('post_id', postId)
        .eq('status', 'approved')
        .is('parent_id', null)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setComments(data as unknown as BlogComment[] || []);
    } catch (error) {
      console.error('Error fetching comments:', error);
    }
  };

  const incrementViewCount = async () => {
    if (!slug) return;
    
    try {
      await supabase.rpc('increment_blog_post_views', {
        post_uuid: await getPostIdBySlug(slug),
        user_uuid: user?.id || null,
        ip_addr: null,
        user_agent_str: navigator.userAgent
      });
    } catch (error) {
      console.error('Error incrementing view count:', error);
    }
  };

  const getPostIdBySlug = async (slug: string): Promise<string> => {
    const { data } = await supabase
      .from('blog_posts')
      .select('id')
      .eq('slug', slug)
      .single();
    return data?.id;
  };

  const checkIfLiked = async () => {
    if (!post || !user) return;

    try {
      const { data, error } = await supabase
        .from('blog_likes')
        .select('id')
        .eq('post_id', post.id)
        .eq('user_id', user.id)
        .single();

      if (error && error.code !== 'PGRST116') throw error;
      setIsLiked(!!data);
    } catch (error) {
      console.error('Error checking like status:', error);
    }
  };

  const toggleLike = async () => {
    if (!post || !user) {
      toast.error('लाइक करने के लिए कृपया लॉगिन करें');
      navigate('/login');
      return;
    }

    try {
      const { data, error } = await supabase.rpc('toggle_blog_post_like', {
        post_uuid: post.id,
        user_uuid: user.id
      });

      if (error) throw error;

      const result = data as { liked: boolean; like_count: number };
      setIsLiked(result.liked);
      setPost(prev => prev ? { ...prev, like_count: result.like_count } : null);
      toast.success(result.liked ? 'पोस्ट लाइक की गई' : 'लाइक हटाया गया');
    } catch (error) {
      console.error('Error toggling like:', error);
      toast.error('लाइक करने में त्रुटि');
    }
  };

  const submitComment = async () => {
    if (!post || !user) {
      toast.error('कमेंट करने के लिए कृपया लॉगिन करें');
      navigate('/login');
      return;
    }

    if (!newComment.trim()) {
      toast.error('कृपया कमेंट लिखें');
      return;
    }

    setSubmittingComment(true);
    try {
      const { error } = await supabase
        .from('blog_comments')
        .insert({
          post_id: post.id,
          user_id: user.id,
          content: newComment.trim()
        });

      if (error) throw error;

      toast.success('आपका कमेंट सबमिट किया गया है और समीक्षा के लिए भेजा गया है');
      setNewComment("");
    } catch (error) {
      console.error('Error submitting comment:', error);
      toast.error('कमेंट सबमिट करने में त्रुटि');
    } finally {
      setSubmittingComment(false);
    }
  };

  const sharePost = async () => {
    try {
      await navigator.share({
        title: post?.title,
        text: post?.excerpt || post?.meta_description,
        url: window.location.href
      });
    } catch (error) {
      // Fallback to copying URL
      navigator.clipboard.writeText(window.location.href);
      toast.success('लिंक कॉपी किया गया');
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('hi-IN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-8">
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">लोड हो रहा है...</p>
          </div>
        </div>
      </Layout>
    );
  }

  if (!post) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-8">
          <div className="text-center py-12">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">पोस्ट नहीं मिली</h1>
            <Button asChild>
              <Link to="/blog">
                <ArrowLeft className="h-4 w-4 mr-2" />
                ब्लॉग पर वापस जाएं
              </Link>
            </Button>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <article className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Back Button */}
        <div className="mb-6">
          <Button variant="outline" asChild>
            <Link to="/blog">
              <ArrowLeft className="h-4 w-4 mr-2" />
              ब्लॉग पर वापस
            </Link>
          </Button>
        </div>

        {/* Post Header */}
        <header className="mb-8">
          {post.featured_image_url && (
            <div className="aspect-video mb-6 rounded-lg overflow-hidden">
              <img 
                src={post.featured_image_url} 
                alt={post.title}
                className="w-full h-full object-cover"
              />
            </div>
          )}
          
          <div className="space-y-4">
            {post.blog_categories && (
              <Badge variant="secondary">
                <Tag className="h-3 w-3 mr-1" />
                {post.blog_categories.name}
              </Badge>
            )}
            
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 leading-tight">
              {post.title}
            </h1>
            
            <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600">
              <div className="flex items-center gap-1">
                <Calendar className="h-4 w-4" />
                {formatDate(post.published_at)}
              </div>
              {post.profiles && (
                <div className="flex items-center gap-1">
                  <User className="h-4 w-4" />
                  {post.profiles.name}
                </div>
              )}
              <div className="flex items-center gap-4">
                <span className="flex items-center gap-1">
                  <Eye className="h-4 w-4" />
                  {post.view_count}
                </span>
                <span className="flex items-center gap-1">
                  <Heart className="h-4 w-4" />
                  {post.like_count}
                </span>
                <span className="flex items-center gap-1">
                  <MessageCircle className="h-4 w-4" />
                  {post.comment_count}
                </span>
              </div>
            </div>
          </div>
        </header>

        {/* Post Content */}
        <div className="blog-content mb-8">
          <div dangerouslySetInnerHTML={{ __html: post.content }} />
        </div>

        {/* Keywords */}
        {post.meta_keywords && (
          <div className="mb-8">
            <h3 className="text-lg font-semibold mb-3">संबंधित विषय:</h3>
            <div className="flex flex-wrap gap-2">
              {post.meta_keywords.split(',').map((keyword, index) => (
                <Badge key={index} variant="outline" className="text-xs">
                  {keyword.trim()}
                </Badge>
              ))}
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex items-center gap-4 mb-8">
          <Button
            onClick={toggleLike}
            variant={isLiked ? "default" : "outline"}
            className={isLiked ? "bg-red-500 hover:bg-red-600" : ""}
          >
            <Heart className="h-4 w-4 mr-2" fill={isLiked ? "currentColor" : "none"} />
            {isLiked ? "पसंद है" : "पसंद करें"}
          </Button>
          <Button onClick={sharePost} variant="outline">
            <Share2 className="h-4 w-4 mr-2" />
            शेयर करें
          </Button>
        </div>

        <Separator className="mb-8" />

        {/* Comments Section */}
        <section className="space-y-6">
          <h2 className="text-2xl font-bold text-gray-900">
            टिप्पणियां ({comments.length})
          </h2>

          {/* Comment Form */}
          <Card>
            <CardHeader>
              <h3 className="text-lg font-semibold">अपनी राय दें</h3>
            </CardHeader>
            <CardContent className="space-y-4">
              {user ? (
                <>
                  <Textarea
                    placeholder="अपनी टिप्पणी यहां लिखें..."
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    rows={4}
                  />
                  <div className="flex justify-between items-center">
                    <p className="text-sm text-gray-600">
                      आपकी टिप्पणी समीक्षा के बाद प्रकाशित की जाएगी
                    </p>
                    <Button 
                      onClick={submitComment} 
                      disabled={submittingComment || !newComment.trim()}
                    >
                      {submittingComment ? (
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      ) : (
                        <Send className="h-4 w-4 mr-2" />
                      )}
                      भेजें
                    </Button>
                  </div>
                </>
              ) : (
                <div className="text-center py-6">
                  <p className="text-gray-600 mb-4">टिप्पणी करने के लिए लॉगिन करें</p>
                  <div className="space-x-4">
                    <Button asChild>
                      <Link to="/login">लॉगिन</Link>
                    </Button>
                    <Button variant="outline" asChild>
                      <Link to="/register">रजिस्टर करें</Link>
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Comments List */}
          {comments.length > 0 ? (
            <div className="space-y-4">
              {comments.map((comment) => (
                <Card key={comment.id}>
                  <CardContent className="pt-4">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                          <User className="h-4 w-4 text-blue-600" />
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">
                            {comment.profiles?.name || 'उपयोगकर्ता'}
                          </p>
                          <p className="text-sm text-gray-500">
                            {formatDate(comment.created_at)}
                          </p>
                        </div>
                      </div>
                    </div>
                    <p className="text-gray-700 leading-relaxed">{comment.content}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <MessageCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">अभी तक कोई टिप्पणी नहीं है</p>
              <p className="text-sm text-gray-500">सबसे पहले टिप्पणी करने वाले बनें!</p>
            </div>
          )}
        </section>
      </article>
    </Layout>
  );
};

export default BlogPost;