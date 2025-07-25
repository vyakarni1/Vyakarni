import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Search, Eye, Edit, Trash2, BarChart } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import AdminLayout from "@/components/AdminLayout";

interface BlogPost {
  id: string;
  title: string;
  slug: string;
  status: string;
  view_count: number;
  like_count: number;
  comment_count: number;
  created_at: string;
  published_at: string | null;
  author_id: string;
  category_id: string | null;
  blog_categories?: {
    name: string;
  } | null;
}

const AdminBlog = () => {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      const { data, error } = await supabase
        .from('blog_posts')
        .select(`
          *,
          blog_categories (
            name
          )
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setPosts(data || []);
    } catch (error) {
      console.error('Error fetching posts:', error);
      toast.error('ब्लॉग पोस्ट लोड करने में त्रुटि');
    } finally {
      setLoading(false);
    }
  };

  const handleDeletePost = async (postId: string) => {
    if (!confirm('क्या आप वाकई इस पोस्ट को डिलीट करना चाहते हैं?')) return;

    try {
      const { error } = await supabase
        .from('blog_posts')
        .delete()
        .eq('id', postId);

      if (error) throw error;
      toast.success('पोस्ट सफलतापूर्वक डिलीट की गई');
      fetchPosts();
    } catch (error) {
      console.error('Error deleting post:', error);
      toast.error('पोस्ट डिलीट करने में त्रुटि');
    }
  };

  const togglePostStatus = async (postId: string, currentStatus: string) => {
    const newStatus = currentStatus === 'published' ? 'draft' : 'published';
    const published_at = newStatus === 'published' ? new Date().toISOString() : null;

    try {
      const { error } = await supabase
        .from('blog_posts')
        .update({ 
          status: newStatus,
          published_at
        })
        .eq('id', postId);

      if (error) throw error;
      toast.success(`पोस्ट ${newStatus === 'published' ? 'प्रकाशित' : 'ड्राफ्ट में'} की गई`);
      fetchPosts();
    } catch (error) {
      console.error('Error updating post status:', error);
      toast.error('पोस्ट स्टेटस अपडेट करने में त्रुटि');
    }
  };

  const filteredPosts = posts.filter(post => {
    const matchesSearch = post.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || post.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'published':
        return <Badge className="bg-green-100 text-green-800">प्रकाशित</Badge>;
      case 'draft':
        return <Badge className="bg-yellow-100 text-yellow-800">ड्राफ्ट</Badge>;
      case 'archived':
        return <Badge className="bg-gray-100 text-gray-800">संग्रहीत</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">ब्लॉग प्रबंधन</h1>
            <p className="text-gray-600 mt-1">अपने ब्लॉग पोस्ट का प्रबंधन करें</p>
          </div>
          <Button asChild>
            <Link to="/admin/blog/create">
              <Plus className="h-4 w-4 mr-2" />
              नई पोस्ट
            </Link>
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">कुल पोस्ट</p>
                  <p className="text-2xl font-bold">{posts.length}</p>
                </div>
                <BarChart className="h-8 w-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">प्रकाशित</p>
                  <p className="text-2xl font-bold">{posts.filter(p => p.status === 'published').length}</p>
                </div>
                <Eye className="h-8 w-8 text-green-600" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">ड्राफ्ट</p>
                  <p className="text-2xl font-bold">{posts.filter(p => p.status === 'draft').length}</p>
                </div>
                <Edit className="h-8 w-8 text-yellow-600" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">कुल व्यू</p>
                  <p className="text-2xl font-bold">{posts.reduce((sum, p) => sum + p.view_count, 0)}</p>
                </div>
                <BarChart className="h-8 w-8 text-purple-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card>
          <CardContent className="p-4">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="पोस्ट खोजें..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-full md:w-48">
                  <SelectValue placeholder="स्टेटस फिल्टर" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">सभी स्टेटस</SelectItem>
                  <SelectItem value="published">प्रकाशित</SelectItem>
                  <SelectItem value="draft">ड्राफ्ट</SelectItem>
                  <SelectItem value="archived">संग्रहीत</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Posts List */}
        <Card>
          <CardHeader>
            <CardTitle>ब्लॉग पोस्ट ({filteredPosts.length})</CardTitle>
            <CardDescription>
              आपकी सभी ब्लॉग पोस्ट यहाँ दिखाई गई हैं
            </CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                <p className="mt-2 text-gray-600">लोड हो रहा है...</p>
              </div>
            ) : filteredPosts.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-gray-600">कोई पोस्ट नहीं मिली</p>
              </div>
            ) : (
              <div className="space-y-4">
                {filteredPosts.map((post) => (
                  <div key={post.id} className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h3 className="font-semibold text-lg">{post.title}</h3>
                          {getStatusBadge(post.status)}
                        </div>
                        <div className="flex items-center gap-4 text-sm text-gray-600 mb-2">
                          <span>👁️ {post.view_count} व्यू</span>
                          <span>❤️ {post.like_count} लाइक</span>
                          <span>💬 {post.comment_count} कमेंट</span>
                          {post.blog_categories && (
                            <span>📁 {post.blog_categories.name}</span>
                          )}
                        </div>
                        <p className="text-sm text-gray-500">
                          {post.status === 'published' && post.published_at
                            ? `प्रकाशित: ${new Date(post.published_at).toLocaleDateString('hi-IN')}`
                            : `बनाया गया: ${new Date(post.created_at).toLocaleDateString('hi-IN')}`
                          }
                        </p>
                      </div>
                      <div className="flex items-center gap-2 ml-4">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => togglePostStatus(post.id, post.status)}
                        >
                          {post.status === 'published' ? 'अप्रकाशित करें' : 'प्रकाशित करें'}
                        </Button>
                        <Button variant="outline" size="sm" asChild>
                          <Link to={`/admin/blog/edit/${post.id}`}>
                            <Edit className="h-4 w-4" />
                          </Link>
                        </Button>
                        <Button variant="outline" size="sm" asChild>
                          <Link to={`/blog/${post.slug}`} target="_blank">
                            <Eye className="h-4 w-4" />
                          </Link>
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDeletePost(post.id)}
                          className="text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
};

export default AdminBlog;