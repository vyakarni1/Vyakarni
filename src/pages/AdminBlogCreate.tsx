import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowLeft, Save, Eye } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import AdminLayout from "@/components/AdminLayout";
import { useAuth } from "@/components/AuthProvider";

interface BlogCategory {
  id: string;
  name: string;
}

const AdminBlogCreate = () => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [excerpt, setExcerpt] = useState("");
  const [status, setStatus] = useState("draft");
  const [categoryId, setCategoryId] = useState("");
  const [tags, setTags] = useState("");
  const [metaTitle, setMetaTitle] = useState("");
  const [metaDescription, setMetaDescription] = useState("");
  const [categories, setCategories] = useState<BlogCategory[]>([]);
  const [saving, setSaving] = useState(false);
  const navigate = useNavigate();
  const { user } = useAuth();

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const { data, error } = await supabase
        .from('blog_categories')
        .select('*')
        .order('name');

      if (error) throw error;
      setCategories(data || []);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim();
  };

  const handleSave = async (publishStatus: string = status) => {
    if (!title.trim() || !content.trim()) {
      toast.error('शीर्षक और सामग्री आवश्यक हैं');
      return;
    }

    if (!user?.id) {
      toast.error('उपयोगकर्ता लॉगिन नहीं है');
      return;
    }

    setSaving(true);
    try {
      const slug = generateSlug(title);
      const published_at = publishStatus === 'published' ? new Date().toISOString() : null;

      const { data, error } = await supabase
        .from('blog_posts')
        .insert({
          title: title.trim(),
          slug,
          content: content.trim(),
          excerpt: excerpt.trim() || null,
          status: publishStatus,
          author_id: user.id,
          category_id: categoryId || null,
          meta_title: metaTitle.trim() || null,
          meta_description: metaDescription.trim() || null,
          published_at
        })
        .select()
        .single();

      if (error) throw error;

      // Handle tags if provided
      if (tags.trim()) {
        const tagList = tags.split(',').map(tag => tag.trim()).filter(tag => tag);
        for (const tagName of tagList) {
          // Create tag if it doesn't exist
          const { data: existingTag } = await supabase
            .from('blog_tags')
            .select('id')
            .eq('name', tagName)
            .single();

          let tagId = existingTag?.id;
          if (!tagId) {
            const tagSlug = tagName.toLowerCase().replace(/[^a-z0-9\s-]/g, '').replace(/\s+/g, '-');
            const { data: newTag } = await supabase
              .from('blog_tags')
              .insert({ name: tagName, slug: tagSlug })
              .select('id')
              .single();
            tagId = newTag?.id;
          }

          // Link tag to post
          if (tagId) {
            await supabase
              .from('blog_post_tags')
              .insert({
                post_id: data.id,
                tag_id: tagId
              });
          }
        }
      }

      toast.success(`पोस्ट ${publishStatus === 'published' ? 'प्रकाशित' : 'सेव'} की गई`);
      navigate('/admin/blog');
    } catch (error) {
      console.error('Error saving post:', error);
      toast.error('पोस्ट सेव करने में त्रुटि');
    } finally {
      setSaving(false);
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4">
          <Button variant="outline" onClick={() => navigate('/admin/blog')}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            वापस
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">नई ब्लॉग पोस्ट</h1>
            <p className="text-gray-600 mt-1">एक नई ब्लॉग पोस्ट बनाएं</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>पोस्ट विवरण</CardTitle>
                <CardDescription>अपनी पोस्ट की मुख्य सामग्री भरें</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="title">शीर्षक *</Label>
                  <Input
                    id="title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="पोस्ट का शीर्षक दर्ज करें"
                  />
                </div>

                <div>
                  <Label htmlFor="excerpt">सार</Label>
                  <Textarea
                    id="excerpt"
                    value={excerpt}
                    onChange={(e) => setExcerpt(e.target.value)}
                    placeholder="पोस्ट का संक्षिप्त विवरण"
                    rows={3}
                  />
                </div>

                <div>
                  <Label htmlFor="content">सामग्री *</Label>
                  <Textarea
                    id="content"
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    placeholder="पोस्ट की मुख्य सामग्री लिखें"
                    rows={15}
                    className="min-h-96"
                  />
                </div>
              </CardContent>
            </Card>

            {/* SEO Settings */}
            <Card>
              <CardHeader>
                <CardTitle>SEO सेटिंग्स</CardTitle>
                <CardDescription>खोज इंजन के लिए अनुकूलित करें</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="metaTitle">मेटा शीर्षक</Label>
                  <Input
                    id="metaTitle"
                    value={metaTitle}
                    onChange={(e) => setMetaTitle(e.target.value)}
                    placeholder="SEO के लिए मेटा शीर्षक"
                  />
                </div>

                <div>
                  <Label htmlFor="metaDescription">मेटा विवरण</Label>
                  <Textarea
                    id="metaDescription"
                    value={metaDescription}
                    onChange={(e) => setMetaDescription(e.target.value)}
                    placeholder="SEO के लिए मेटा विवरण"
                    rows={3}
                  />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Publish Settings */}
            <Card>
              <CardHeader>
                <CardTitle>प्रकाशन सेटिंग्स</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="status">स्थिति</Label>
                  <Select value={status} onValueChange={setStatus}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="draft">ड्राफ्ट</SelectItem>
                      <SelectItem value="published">प्रकाशित</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="category">श्रेणी</Label>
                  <Select value={categoryId} onValueChange={setCategoryId}>
                    <SelectTrigger>
                      <SelectValue placeholder="श्रेणी चुनें" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((category) => (
                        <SelectItem key={category.id} value={category.id}>
                          {category.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="tags">टैग्स</Label>
                  <Input
                    id="tags"
                    value={tags}
                    onChange={(e) => setTags(e.target.value)}
                    placeholder="टैग्स (कॉमा से अलग करें)"
                  />
                  <p className="text-sm text-gray-500 mt-1">
                    टैग्स को कॉमा से अलग करें
                  </p>
                </div>

                <div className="flex flex-col gap-2">
                  <Button 
                    onClick={() => handleSave('draft')}
                    disabled={saving}
                    variant="outline"
                    className="w-full"
                  >
                    <Save className="h-4 w-4 mr-2" />
                    {saving ? 'सेव हो रहा है...' : 'ड्राफ्ट सेव करें'}
                  </Button>
                  <Button 
                    onClick={() => handleSave('published')}
                    disabled={saving}
                    className="w-full"
                  >
                    <Eye className="h-4 w-4 mr-2" />
                    {saving ? 'प्रकाशित हो रहा है...' : 'प्रकाशित करें'}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminBlogCreate;