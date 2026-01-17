import { Palette, Image, Type, Layout, Box, Layers, FileCode, Video } from "lucide-react";

const CategoriesSection = () => {
  const categories = [
    { icon: Palette, name: "UI Kits", count: "2,340", gradient: "from-violet-500 to-purple-600" },
    { icon: Image, name: "Graphics", count: "5,120", gradient: "from-pink-500 to-rose-600" },
    { icon: Type, name: "Fonts", count: "890", gradient: "from-amber-500 to-orange-600" },
    { icon: Layout, name: "Templates", count: "1,560", gradient: "from-emerald-500 to-teal-600" },
    { icon: Box, name: "3D Assets", count: "720", gradient: "from-blue-500 to-cyan-600" },
    { icon: Layers, name: "Mockups", count: "1,890", gradient: "from-indigo-500 to-violet-600" },
    { icon: FileCode, name: "Code", count: "340", gradient: "from-slate-400 to-zinc-500" },
    { icon: Video, name: "Courses", count: "156", gradient: "from-red-500 to-pink-600" },
  ];

  return (
    <section className="py-24 lg:py-32 bg-background relative">
      {/* Subtle Background Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-primary/5 rounded-full blur-[150px]" />
      
      <div className="container mx-auto px-4 relative z-10">
        {/* Header */}
        <div className="text-center mb-16">
          <span className="text-primary font-semibold mb-4 block text-sm uppercase tracking-wider">Categories</span>
          <h2 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-6">
            Browse by Category
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Find exactly what you need from our curated collection of premium digital assets
          </p>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 lg:gap-6">
          {categories.map((category, index) => (
            <div
              key={category.name}
              className="group relative bg-card rounded-2xl p-6 lg:p-8 border border-border card-hover cursor-pointer overflow-hidden"
              style={{ animationDelay: `${index * 0.05}s` }}
            >
              {/* Gradient Overlay on Hover */}
              <div className={`absolute inset-0 bg-gradient-to-br ${category.gradient} opacity-0 group-hover:opacity-10 transition-opacity duration-500`} />
              
              {/* Icon */}
              <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${category.gradient} flex items-center justify-center mb-5 shadow-strong group-hover:scale-110 group-hover:shadow-glow transition-all duration-500`}>
                <category.icon className="w-7 h-7 text-white" />
              </div>

              {/* Content */}
              <h3 className="font-display font-semibold text-lg text-foreground mb-2 group-hover:text-primary transition-colors duration-300">
                {category.name}
              </h3>
              <p className="text-muted-foreground text-sm">
                {category.count} items
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CategoriesSection;