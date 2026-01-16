import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Heart, Download, Star, ArrowRight } from "lucide-react";

const FeaturedProducts = () => {
  const products = [
    {
      id: 1,
      title: "Minimal Dashboard UI Kit",
      author: "DesignCraft",
      price: 49,
      originalPrice: 79,
      rating: 4.9,
      reviews: 234,
      downloads: 1250,
      category: "UI Kit",
      image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=600&h=400&fit=crop",
      featured: true,
    },
    {
      id: 2,
      title: "Geometric Pattern Pack",
      author: "PatternLab",
      price: 0,
      rating: 4.7,
      reviews: 89,
      downloads: 5420,
      category: "Graphics",
      image: "https://images.unsplash.com/photo-1558591710-4b4a1ae0f04d?w=600&h=400&fit=crop",
      featured: false,
    },
    {
      id: 3,
      title: "Brand Identity Mockup Set",
      author: "MockupMaster",
      price: 29,
      rating: 4.8,
      reviews: 156,
      downloads: 890,
      category: "Mockup",
      image: "https://images.unsplash.com/photo-1586717791821-3f44a563fa4c?w=600&h=400&fit=crop",
      featured: false,
    },
    {
      id: 4,
      title: "Icon Collection Pro",
      author: "IconWorks",
      price: 39,
      originalPrice: 59,
      rating: 4.9,
      reviews: 412,
      downloads: 3200,
      category: "Icons",
      image: "https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?w=600&h=400&fit=crop",
      featured: true,
    },
    {
      id: 5,
      title: "Mobile App Template",
      author: "AppStudio",
      price: 69,
      rating: 4.8,
      reviews: 98,
      downloads: 560,
      category: "Template",
      image: "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=600&h=400&fit=crop",
      featured: false,
    },
    {
      id: 6,
      title: "Social Media Pack",
      author: "SocialKit",
      price: 25,
      rating: 4.6,
      reviews: 267,
      downloads: 2100,
      category: "Graphics",
      image: "https://images.unsplash.com/photo-1611162616305-c69b3fa7fbe0?w=600&h=400&fit=crop",
      featured: false,
    },
  ];

  return (
    <section className="py-20 lg:py-32 bg-secondary/30">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-12">
          <div>
            <span className="text-primary font-medium mb-4 block">Featured</span>
            <h2 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold text-foreground">
              Trending Products
            </h2>
          </div>
          <Button variant="outline" className="self-start md:self-auto">
            View All Products
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </div>

        {/* Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {products.map((product) => (
            <div
              key={product.id}
              className="group bg-card rounded-2xl border border-border overflow-hidden card-hover"
            >
              {/* Image */}
              <div className="relative aspect-[4/3] overflow-hidden">
                <img
                  src={product.image}
                  alt={product.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                
                {/* Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-foreground/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                
                {/* Actions */}
                <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <button className="w-10 h-10 rounded-xl bg-card/90 backdrop-blur-sm flex items-center justify-center hover:bg-card transition-colors">
                    <Heart className="w-5 h-5 text-foreground" />
                  </button>
                </div>

                {/* Badges */}
                <div className="absolute top-4 left-4 flex gap-2">
                  {product.price === 0 && (
                    <Badge className="bg-success text-success-foreground">Free</Badge>
                  )}
                  {product.featured && (
                    <Badge className="bg-gradient-primary text-primary-foreground">Featured</Badge>
                  )}
                  {product.originalPrice && (
                    <Badge variant="secondary" className="bg-accent text-accent-foreground">Sale</Badge>
                  )}
                </div>

                {/* Quick Add */}
                <div className="absolute bottom-4 left-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <Button variant="glass" className="w-full bg-card/90 text-foreground">
                    <Download className="w-4 h-4 mr-2" />
                    {product.price === 0 ? "Download Free" : "Add to Cart"}
                  </Button>
                </div>
              </div>

              {/* Content */}
              <div className="p-5">
                <div className="flex items-center gap-2 mb-2">
                  <Badge variant="secondary" className="text-xs">
                    {product.category}
                  </Badge>
                </div>
                
                <h3 className="font-display font-semibold text-lg text-foreground mb-1 group-hover:text-primary transition-colors line-clamp-1">
                  {product.title}
                </h3>
                
                <p className="text-muted-foreground text-sm mb-3">
                  by {product.author}
                </p>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1">
                    <Star className="w-4 h-4 fill-warning text-warning" />
                    <span className="font-medium text-sm">{product.rating}</span>
                    <span className="text-muted-foreground text-sm">({product.reviews})</span>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    {product.originalPrice && (
                      <span className="text-muted-foreground line-through text-sm">
                        ${product.originalPrice}
                      </span>
                    )}
                    <span className="font-display font-bold text-lg text-foreground">
                      {product.price === 0 ? "Free" : `$${product.price}`}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturedProducts;
