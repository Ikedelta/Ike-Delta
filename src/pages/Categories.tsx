import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { Palette, Image, Type, Layout, Box, Layers, FileCode, Video, Wand2, Camera, Music, FileText } from "lucide-react";

const Categories = () => {
  const categories = [
    { icon: Palette, name: "UI Kits", count: "2,340", description: "Complete design systems and UI components", gradient: "from-violet-500 to-purple-600" },
    { icon: Image, name: "Graphics", count: "5,120", description: "Illustrations, backgrounds, and visual assets", gradient: "from-pink-500 to-rose-600" },
    { icon: Type, name: "Fonts", count: "890", description: "Premium typography and typefaces", gradient: "from-amber-500 to-orange-600" },
    { icon: Layout, name: "Templates", count: "1,560", description: "Website and app templates", gradient: "from-emerald-500 to-teal-600" },
    { icon: Box, name: "3D Assets", count: "720", description: "3D models, icons, and renders", gradient: "from-blue-500 to-cyan-600" },
    { icon: Layers, name: "Mockups", count: "1,890", description: "Device and product mockups", gradient: "from-indigo-500 to-violet-600" },
    { icon: FileCode, name: "Code", count: "340", description: "Code snippets and components", gradient: "from-slate-400 to-zinc-500" },
    { icon: Video, name: "Courses", count: "156", description: "Video tutorials and masterclasses", gradient: "from-red-500 to-pink-600" },
    { icon: Wand2, name: "Effects", count: "430", description: "Photo effects and actions", gradient: "from-purple-500 to-fuchsia-600" },
    { icon: Camera, name: "Photos", count: "8,200", description: "Stock photos and imagery", gradient: "from-sky-500 to-blue-600" },
    { icon: Music, name: "Audio", count: "560", description: "Sound effects and music", gradient: "from-green-500 to-emerald-600" },
    { icon: FileText, name: "Documents", count: "890", description: "Presentations and documents", gradient: "from-orange-500 to-red-600" },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pt-24 pb-16">
        <div className="container mx-auto px-4">
          {/* Header */}
          <div className="text-center mb-16">
            <span className="text-primary font-semibold mb-4 block text-sm uppercase tracking-wider">Browse</span>
            <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-6">
              All Categories
            </h1>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Explore our complete collection of digital assets organized by category
            </p>
          </div>

          {/* Categories Grid */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {categories.map((category, index) => (
              <div
                key={category.name}
                className="group relative bg-card rounded-2xl p-8 border border-border card-hover cursor-pointer overflow-hidden"
              >
                <div className={`absolute inset-0 bg-gradient-to-br ${category.gradient} opacity-0 group-hover:opacity-10 transition-opacity duration-500`} />
                
                <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${category.gradient} flex items-center justify-center mb-6 shadow-strong group-hover:scale-110 group-hover:shadow-glow transition-all duration-500`}>
                  <category.icon className="w-8 h-8 text-white" />
                </div>

                <h3 className="font-display font-bold text-xl text-foreground mb-2 group-hover:text-primary transition-colors duration-300">
                  {category.name}
                </h3>
                <p className="text-muted-foreground text-sm mb-4">{category.description}</p>
                <p className="text-primary font-semibold">{category.count} items</p>
              </div>
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Categories;