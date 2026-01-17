import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Heart, Star, Search, SlidersHorizontal, Grid3X3, List, ShoppingCart } from "lucide-react";

const Explore = () => {
  const products = [
    { id: 1, title: "Minimal Dashboard UI Kit", author: "DesignCraft", price: 49, originalPrice: 79, rating: 4.9, reviews: 234, category: "UI Kit", image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=600&h=400&fit=crop", featured: true },
    { id: 2, title: "Geometric Pattern Pack", author: "PatternLab", price: 0, rating: 4.7, reviews: 89, category: "Graphics", image: "https://images.unsplash.com/photo-1558591710-4b4a1ae0f04d?w=600&h=400&fit=crop", featured: false },
    { id: 3, title: "Brand Identity Mockup Set", author: "MockupMaster", price: 29, rating: 4.8, reviews: 156, category: "Mockup", image: "https://images.unsplash.com/photo-1586717791821-3f44a563fa4c?w=600&h=400&fit=crop", featured: false },
    { id: 4, title: "Icon Collection Pro", author: "IconWorks", price: 39, originalPrice: 59, rating: 4.9, reviews: 412, category: "Icons", image: "https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?w=600&h=400&fit=crop", featured: true },
    { id: 5, title: "Mobile App Template", author: "AppStudio", price: 69, rating: 4.8, reviews: 98, category: "Template", image: "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=600&h=400&fit=crop", featured: false },
    { id: 6, title: "Social Media Pack", author: "SocialKit", price: 25, rating: 4.6, reviews: 267, category: "Graphics", image: "https://images.unsplash.com/photo-1611162616305-c69b3fa7fbe0?w=600&h=400&fit=crop", featured: false },
    { id: 7, title: "Website Templates Bundle", author: "WebPro", price: 99, rating: 4.9, reviews: 189, category: "Template", image: "https://images.unsplash.com/photo-1467232004584-a241de8bcf5d?w=600&h=400&fit=crop", featured: true },
    { id: 8, title: "3D Icon Pack", author: "3DLabs", price: 45, rating: 4.7, reviews: 134, category: "3D Assets", image: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=600&h=400&fit=crop", featured: false },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pt-24 pb-16">
        <div className="container mx-auto px-4">
          {/* Header */}
          <div className="mb-12">
            <h1 className="font-display text-4xl md:text-5xl font-bold text-foreground mb-4">
              Explore All Products
            </h1>
            <p className="text-muted-foreground text-lg max-w-2xl">
              Discover thousands of premium digital assets to elevate your creative projects
            </p>
          </div>

          {/* Filters */}
          <div className="flex flex-col lg:flex-row gap-4 mb-10">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <Input placeholder="Search products..." className="pl-12 h-12 bg-card border-border" />
            </div>
            <div className="flex gap-3">
              <Button variant="outline" className="border-border">
                <SlidersHorizontal className="w-4 h-4 mr-2" />
                Filters
              </Button>
              <Button variant="outline" size="icon" className="border-border">
                <Grid3X3 className="w-4 h-4" />
              </Button>
              <Button variant="outline" size="icon" className="border-border">
                <List className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {/* Products Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {products.map((product) => (
              <div key={product.id} className="group bg-card rounded-2xl border border-border overflow-hidden card-hover">
                <div className="relative aspect-[4/3] overflow-hidden">
                  <img src={product.image} alt={product.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                  <div className="absolute inset-0 bg-gradient-to-t from-background via-background/20 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500" />
                  <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-all duration-300">
                    <button className="w-10 h-10 rounded-xl glass flex items-center justify-center hover:bg-accent/20 hover:text-accent transition-colors">
                      <Heart className="w-5 h-5" />
                    </button>
                  </div>
                  <div className="absolute top-4 left-4 flex gap-2">
                    {product.price === 0 && <Badge className="bg-success text-success-foreground border-0">Free</Badge>}
                    {product.featured && <Badge className="bg-gradient-primary text-primary-foreground border-0">Featured</Badge>}
                    {product.originalPrice && <Badge className="bg-accent text-accent-foreground border-0">Sale</Badge>}
                  </div>
                  <div className="absolute bottom-4 left-4 right-4 opacity-0 group-hover:opacity-100 transition-all duration-300">
                    <Button variant="glass" className="w-full glass hover:bg-primary/20">
                      <ShoppingCart className="w-4 h-4 mr-2" />
                      {product.price === 0 ? "Download Free" : "Add to Cart"}
                    </Button>
                  </div>
                </div>
                <div className="p-5">
                  <Badge variant="secondary" className="text-xs mb-3 bg-muted text-muted-foreground">{product.category}</Badge>
                  <h3 className="font-display font-semibold text-foreground mb-2 group-hover:text-primary transition-colors line-clamp-1">{product.title}</h3>
                  <p className="text-muted-foreground text-sm mb-3">by {product.author}</p>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4 fill-warning text-warning" />
                      <span className="font-medium text-sm">{product.rating}</span>
                      <span className="text-muted-foreground text-sm">({product.reviews})</span>
                    </div>
                    <div className="flex items-center gap-2">
                      {product.originalPrice && <span className="text-muted-foreground line-through text-sm">${product.originalPrice}</span>}
                      <span className="font-display font-bold text-lg">{product.price === 0 ? "Free" : `$${product.price}`}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Load More */}
          <div className="text-center mt-12">
            <Button variant="outline" size="lg" className="border-border hover:border-primary/50">
              Load More Products
            </Button>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Explore;