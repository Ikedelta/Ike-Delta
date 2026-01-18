import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { 
  ArrowLeft, 
  Upload, 
  Image, 
  DollarSign,
  Tag,
  FileText,
  Save,
  Loader2,
  X
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";

interface Category {
  id: string;
  name: string;
  slug: string;
}

const CreateProduct = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [formData, setFormData] = useState({
    title: "",
    slug: "",
    short_description: "",
    description: "",
    category_id: "",
    price: "",
    is_free: false,
    file_type: "",
    file_size: "",
  });

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    const { data, error } = await supabase
      .from("categories")
      .select("id, name, slug")
      .order("name");

    if (!error && data) {
      setCategories(data);
    }
  };

  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");
  };

  const handleTitleChange = (title: string) => {
    setFormData({
      ...formData,
      title,
      slug: generateSlug(title),
    });
  };

  const handleSubmit = async (status: 'draft' | 'pending') => {
    if (!formData.title) {
      toast({
        title: "Title Required",
        description: "Please enter a product title.",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      const { error } = await supabase.from("products").insert({
        seller_id: user?.id,
        title: formData.title,
        slug: formData.slug || generateSlug(formData.title),
        short_description: formData.short_description,
        description: formData.description,
        category_id: formData.category_id || null,
        price: formData.is_free ? 0 : parseFloat(formData.price) || 0,
        is_free: formData.is_free,
        file_type: formData.file_type,
        file_size: formData.file_size,
        status,
      });

      if (error) throw error;

      toast({
        title: status === 'draft' ? "Draft Saved" : "Product Submitted",
        description: status === 'draft' 
          ? "Your product has been saved as a draft."
          : "Your product has been submitted for review.",
      });
      navigate("/dashboard/products");
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to create product.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 lg:p-8 pb-24 lg:pb-8">
      {/* Header */}
      <div className="flex items-center gap-4 mb-8">
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={() => navigate("/dashboard/products")}
          className="text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <div>
          <h1 className="font-display text-3xl font-bold text-foreground">Create Product</h1>
          <p className="text-muted-foreground">Add a new digital product to sell</p>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Main Form */}
        <div className="lg:col-span-2 space-y-6">
          {/* Basic Info */}
          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle className="font-display text-lg flex items-center gap-2">
                <FileText className="w-5 h-5 text-primary" />
                Basic Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium text-foreground mb-2 block">Product Title *</label>
                <Input
                  value={formData.title}
                  onChange={(e) => handleTitleChange(e.target.value)}
                  placeholder="e.g., Modern Dashboard UI Kit"
                  className="bg-muted border-border"
                />
              </div>

              <div>
                <label className="text-sm font-medium text-foreground mb-2 block">URL Slug</label>
                <Input
                  value={formData.slug}
                  onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                  placeholder="modern-dashboard-ui-kit"
                  className="bg-muted border-border"
                />
              </div>

              <div>
                <label className="text-sm font-medium text-foreground mb-2 block">Short Description</label>
                <Input
                  value={formData.short_description}
                  onChange={(e) => setFormData({ ...formData, short_description: e.target.value })}
                  placeholder="A brief description for previews"
                  className="bg-muted border-border"
                />
              </div>

              <div>
                <label className="text-sm font-medium text-foreground mb-2 block">Full Description</label>
                <Textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Describe your product in detail..."
                  className="bg-muted border-border min-h-[150px]"
                />
              </div>
            </CardContent>
          </Card>

          {/* Media */}
          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle className="font-display text-lg flex items-center gap-2">
                <Image className="w-5 h-5 text-primary" />
                Media
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="border-2 border-dashed border-border rounded-xl p-8 text-center hover:border-primary/50 transition-colors cursor-pointer">
                <Upload className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-foreground font-medium mb-1">Drop files here or click to upload</p>
                <p className="text-sm text-muted-foreground">PNG, JPG, GIF up to 10MB</p>
              </div>
            </CardContent>
          </Card>

          {/* Files */}
          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle className="font-display text-lg flex items-center gap-2">
                <Upload className="w-5 h-5 text-primary" />
                Product Files
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="border-2 border-dashed border-border rounded-xl p-8 text-center hover:border-primary/50 transition-colors cursor-pointer">
                <Upload className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-foreground font-medium mb-1">Upload your product files</p>
                <p className="text-sm text-muted-foreground">ZIP, RAR, PSD, AI, etc. up to 500MB</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-foreground mb-2 block">File Type</label>
                  <Input
                    value={formData.file_type}
                    onChange={(e) => setFormData({ ...formData, file_type: e.target.value })}
                    placeholder="e.g., PSD, Figma, ZIP"
                    className="bg-muted border-border"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-foreground mb-2 block">File Size</label>
                  <Input
                    value={formData.file_size}
                    onChange={(e) => setFormData({ ...formData, file_size: e.target.value })}
                    placeholder="e.g., 25MB"
                    className="bg-muted border-border"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Category & Pricing */}
          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle className="font-display text-lg flex items-center gap-2">
                <Tag className="w-5 h-5 text-primary" />
                Category & Pricing
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium text-foreground mb-2 block">Category</label>
                <Select 
                  value={formData.category_id} 
                  onValueChange={(value) => setFormData({ ...formData, category_id: value })}
                >
                  <SelectTrigger className="bg-muted border-border">
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent className="bg-card border-border">
                    {categories.map((cat) => (
                      <SelectItem key={cat.id} value={cat.id}>{cat.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center justify-between py-3 border-b border-border">
                <div>
                  <p className="font-medium text-foreground">Free Product</p>
                  <p className="text-sm text-muted-foreground">Make this product free</p>
                </div>
                <Switch
                  checked={formData.is_free}
                  onCheckedChange={(checked) => setFormData({ ...formData, is_free: checked })}
                />
              </div>

              {!formData.is_free && (
                <div>
                  <label className="text-sm font-medium text-foreground mb-2 block">Price (GHS)</label>
                  <div className="relative">
                    <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                    <Input
                      type="number"
                      value={formData.price}
                      onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                      placeholder="0.00"
                      className="pl-10 bg-muted border-border"
                    />
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Actions */}
          <Card className="bg-card border-border">
            <CardContent className="p-4 space-y-3">
              <Button 
                variant="hero" 
                className="w-full glow-sm"
                onClick={() => handleSubmit('pending')}
                disabled={loading}
              >
                {loading ? (
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                ) : (
                  <Save className="w-4 h-4 mr-2" />
                )}
                Submit for Review
              </Button>
              <Button 
                variant="outline" 
                className="w-full border-border"
                onClick={() => handleSubmit('draft')}
                disabled={loading}
              >
                Save as Draft
              </Button>
              <Button 
                variant="ghost" 
                className="w-full"
                onClick={() => navigate("/dashboard/products")}
              >
                Cancel
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default CreateProduct;
