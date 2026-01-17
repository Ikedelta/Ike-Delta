import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { Badge } from "@/components/ui/badge";
import { Calendar, User, ArrowRight } from "lucide-react";

const Blog = () => {
  const posts = [
    {
      id: 1,
      title: "10 UI Design Trends to Watch in 2024",
      excerpt: "Discover the latest design trends that are shaping the digital landscape this year.",
      image: "https://images.unsplash.com/photo-1561070791-2526d30994b5?w=600&h=400&fit=crop",
      category: "Design Trends",
      author: "Sarah Johnson",
      date: "Dec 15, 2024",
      featured: true,
    },
    {
      id: 2,
      title: "How to Build a Successful Design Portfolio",
      excerpt: "Tips and strategies for creating a portfolio that gets you hired.",
      image: "https://images.unsplash.com/photo-1586717791821-3f44a563fa4c?w=600&h=400&fit=crop",
      category: "Career",
      author: "Michael Chen",
      date: "Dec 12, 2024",
      featured: false,
    },
    {
      id: 3,
      title: "Mastering Figma: Advanced Tips and Tricks",
      excerpt: "Take your Figma skills to the next level with these pro techniques.",
      image: "https://images.unsplash.com/photo-1559028012-481c04fa702d?w=600&h=400&fit=crop",
      category: "Tutorials",
      author: "Emma Williams",
      date: "Dec 10, 2024",
      featured: false,
    },
    {
      id: 4,
      title: "The Psychology of Color in UI Design",
      excerpt: "Understanding how colors influence user behavior and emotions.",
      image: "https://images.unsplash.com/photo-1558591710-4b4a1ae0f04d?w=600&h=400&fit=crop",
      category: "Design Theory",
      author: "David Park",
      date: "Dec 8, 2024",
      featured: false,
    },
    {
      id: 5,
      title: "Creating Accessible Designs for Everyone",
      excerpt: "A comprehensive guide to making your designs inclusive.",
      image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=600&h=400&fit=crop",
      category: "Accessibility",
      author: "Lisa Brown",
      date: "Dec 5, 2024",
      featured: false,
    },
    {
      id: 6,
      title: "Freelancing as a Designer in Ghana",
      excerpt: "Insights and tips for building a successful freelance career in Africa.",
      image: "https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?w=600&h=400&fit=crop",
      category: "Business",
      author: "Kofi Mensah",
      date: "Dec 3, 2024",
      featured: false,
    },
  ];

  const featuredPost = posts.find(p => p.featured);
  const regularPosts = posts.filter(p => !p.featured);

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pt-24 pb-16">
        <div className="container mx-auto px-4">
          {/* Header */}
          <div className="text-center mb-16">
            <span className="text-primary font-semibold mb-4 block text-sm uppercase tracking-wider">Blog</span>
            <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-6">
              Design Insights & Tips
            </h1>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Stay updated with the latest design trends, tutorials, and industry news
            </p>
          </div>

          {/* Featured Post */}
          {featuredPost && (
            <div className="mb-16">
              <div className="group bg-card rounded-3xl border border-border overflow-hidden card-hover">
                <div className="grid lg:grid-cols-2">
                  <div className="aspect-[4/3] lg:aspect-auto overflow-hidden">
                    <img src={featuredPost.image} alt={featuredPost.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                  </div>
                  <div className="p-8 lg:p-12 flex flex-col justify-center">
                    <Badge className="w-fit mb-4 bg-primary/10 text-primary border-primary/20">{featuredPost.category}</Badge>
                    <h2 className="font-display text-2xl lg:text-3xl font-bold text-foreground mb-4 group-hover:text-primary transition-colors">
                      {featuredPost.title}
                    </h2>
                    <p className="text-muted-foreground text-lg mb-6">{featuredPost.excerpt}</p>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground mb-6">
                      <div className="flex items-center gap-2"><User className="w-4 h-4" />{featuredPost.author}</div>
                      <div className="flex items-center gap-2"><Calendar className="w-4 h-4" />{featuredPost.date}</div>
                    </div>
                    <a href="#" className="inline-flex items-center gap-2 text-primary font-semibold hover:gap-3 transition-all">
                      Read More <ArrowRight className="w-4 h-4" />
                    </a>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Blog Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {regularPosts.map((post) => (
              <div key={post.id} className="group bg-card rounded-2xl border border-border overflow-hidden card-hover">
                <div className="aspect-[16/10] overflow-hidden">
                  <img src={post.image} alt={post.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                </div>
                <div className="p-6">
                  <Badge className="mb-4 bg-muted text-muted-foreground border-0">{post.category}</Badge>
                  <h3 className="font-display font-semibold text-lg text-foreground mb-3 group-hover:text-primary transition-colors line-clamp-2">
                    {post.title}
                  </h3>
                  <p className="text-muted-foreground text-sm mb-4 line-clamp-2">{post.excerpt}</p>
                  <div className="flex items-center gap-4 text-xs text-muted-foreground">
                    <div className="flex items-center gap-1"><User className="w-3 h-3" />{post.author}</div>
                    <div className="flex items-center gap-1"><Calendar className="w-3 h-3" />{post.date}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Blog;