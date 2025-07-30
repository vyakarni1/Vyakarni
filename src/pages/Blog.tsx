import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Layout from "@/components/Layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, Eye, Heart, MessageCircle, Calendar, User, Tag } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  featured_image_url: string | null;
  view_count: number;
  like_count: number;
  comment_count: number;
  published_at: string;
  meta_keywords: string | null;
  blog_categories?: {
    name: string;
    slug: string;
  } | null;
  profiles?: {
    name: string;
  } | null;
}

interface BlogCategory {
  id: string;
  name: string;
  slug: string;
}

const Blog = () => {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [categories, setCategories] = useState<BlogCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [currentPage, setCurrentPage] = useState(1);
  const postsPerPage = 9;

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      // Fetch published posts
      const { data: postsData, error: postsError } = await supabase
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
        .eq('status', 'published')
        .order('published_at', { ascending: false });

      if (postsError) throw postsError;

      // Fetch categories
      const { data: categoriesData, error: categoriesError } = await supabase
        .from('blog_categories')
        .select('*')
        .order('name');

      if (categoriesError) throw categoriesError;

      setPosts(postsData as unknown as BlogPost[] || []);
      setCategories(categoriesData || []);
    } catch (error) {
      console.error('Error fetching data:', error);
      toast.error('डेटा लोड करने में त्रुटि');
    } finally {
      setLoading(false);
    }
  };

  const filteredPosts = posts.filter(post => {
    const matchesSearch = post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (post.excerpt && post.excerpt.toLowerCase().includes(searchTerm.toLowerCase())) ||
                         (post.meta_keywords && post.meta_keywords.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesCategory = selectedCategory === 'all' || 
                           (post.blog_categories && post.blog_categories.slug === selectedCategory);
    return matchesSearch && matchesCategory;
  });

  // Pagination
  const totalPages = Math.ceil(filteredPosts.length / postsPerPage);
  const startIndex = (currentPage - 1) * postsPerPage;
  const paginatedPosts = filteredPosts.slice(startIndex, startIndex + postsPerPage);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('hi-IN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            व्याकरणी ब्लॉग
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            हिंदी व्याकरण, भाषा सुधार, लेखन कला एवं अन्य अनेकानेक विषयों पर नवीनतम विवरण तथा रोचक सूचनायें प्राप्त करें
          </p>
        </div>

        {/* Search and Filter */}
        <div className="bg-white rounded-lg shadow-sm border p-6 mb-8">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <Input
                placeholder="ब्लॉग पोस्ट खोजें..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 h-12"
              />
            </div>
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="w-full md:w-64 h-12">
                <SelectValue placeholder="कैटेगरी चुनें" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">सभी कैटेगरी</SelectItem>
                {categories.map((category) => (
                  <SelectItem key={category.id} value={category.slug}>
                    {category.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          {filteredPosts.length > 0 && (
            <p className="text-sm text-gray-600 mt-4">
              {filteredPosts.length} पोस्ट मिली
            </p>
          )}
        </div>

        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">लोड हो रहा है...</p>
          </div>
        ) : filteredPosts.length === 0 ? (
          <div className="text-center py-12">
            <div className="max-w-md mx-auto">
              <div className="text-6xl mb-4">📝</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">कोई पोस्ट नहीं मिली</h3>
              <p className="text-gray-600 mb-6">
                {searchTerm || selectedCategory !== 'all' 
                  ? 'कृपया अपना खोज शब्द या फिल्टर परिवर्तित कर पुनः प्रयास करें।'
                  : 'अभी तक कोई ब्लॉग पोस्ट प्रकाशित नहीं की गयी है।'
                }
              </p>
              {(searchTerm || selectedCategory !== 'all') && (
                <Button 
                  onClick={() => {
                    setSearchTerm("");
                    setSelectedCategory("all");
                    setCurrentPage(1);
                  }}
                  variant="outline"
                >
                  सभी पोस्ट दिखायें
                </Button>
              )}
            </div>
          </div>
        ) : (
          <>
            {/* Blog Posts Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              {paginatedPosts.map((post) => (
                <Card key={post.id} className="hover:shadow-lg transition-shadow duration-300 overflow-hidden">
                  {post.featured_image_url && (
                    <div className="aspect-video overflow-hidden">
                      <img 
                        src={post.featured_image_url} 
                        alt={post.title}
                        className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                  )}
                  <CardHeader className="pb-3">
                    <div className="flex items-center gap-2 mb-2">
                      {post.blog_categories && (
                        <Badge variant="secondary" className="text-xs">
                          <Tag className="h-3 w-3 mr-1" />
                          {post.blog_categories.name}
                        </Badge>
                      )}
                    </div>
                    <CardTitle className="text-xl hover:text-blue-600 transition-colors">
                      <Link to={`/blog/${post.slug}`}>
                        {post.title}
                      </Link>
                    </CardTitle>
                    {post.excerpt && (
                      <CardDescription className="text-sm">
                        {post.excerpt}
                      </CardDescription>
                    )}
                  </CardHeader>
                  <CardContent className="pt-0">
                    <div className="flex items-center justify-between text-sm text-gray-600 mb-4">
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
                    <div className="flex items-center justify-between">
                      <div className="flex items-center text-sm text-gray-500">
                        <Calendar className="h-4 w-4 mr-1" />
                        {formatDate(post.published_at)}
                      </div>
                      <Button asChild size="sm" variant="outline">
                        <Link to={`/blog/${post.slug}`}>
                          पढ़ें
                        </Link>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center items-center gap-2">
                <Button
                  variant="outline"
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                >
                  पिछला
                </Button>
                <div className="flex items-center gap-1">
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                    <Button
                      key={page}
                      variant={currentPage === page ? "default" : "outline"}
                      size="sm"
                      onClick={() => setCurrentPage(page)}
                      className="w-10 h-10"
                    >
                      {page}
                    </Button>
                  ))}
                </div>
                <Button
                  variant="outline"
                  disabled={currentPage === totalPages}
                  onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                >
                  अगला
                </Button>
              </div>
            )}
          </>
        )}
      </div>
    </Layout>
  );
};

export default Blog;