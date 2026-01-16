import { Palette, Image, Type, Layout, Box, Layers, FileCode, Video } from "lucide-react";

const CategoriesSection = () => {
  const categories = [
    { icon: Palette, name: "UI Kits", count: "2,340", color: "from-violet-500 to-purple-600" },
    { icon: Image, name: "Graphics", count: "5,120", color: "from-pink-500 to-rose-600" },
    { icon: Type, name: "Fonts", count: "890", color: "from-amber-500 to-orange-600" },
    { icon: Layout, name: "Templates", count: "1,560", color: "from-emerald-500 to-teal-600" },
    { icon: Box, name: "3D Assets", count: "720", color: "from-blue-500 to-cyan-600" },
    { icon: Layers, name: "Mockups", count: "1,890", color: "from-indigo-500 to-violet-600" },
    { icon: FileCode, name: "Code", count: "340", color: "from-slate-500 to-zinc-600" },
    { icon: Video, name: "Courses", count: "156", color: "from-red-500 to-pink-600" },
  ];

  return (
    <section className="py-20 lg:py-32 bg-background">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-16">
          <span className="text-primary font-medium mb-4 block">Categories</span>
          <h2 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-4">
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
              {/* Background Gradient on Hover */}
              <div className={`absolute inset-0 bg-gradient-to-br ${category.color} opacity-0 group-hover:opacity-5 transition-opacity duration-300`} />
              
              {/* Icon */}
              <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${category.color} flex items-center justify-center mb-4 shadow-medium group-hover:scale-110 transition-transform duration-300`}>
                <category.icon className="w-7 h-7 text-white" />
              </div>

              {/* Content */}
              <h3 className="font-display font-semibold text-lg text-foreground mb-1 group-hover:text-primary transition-colors">
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
