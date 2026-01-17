import { Star, Quote } from "lucide-react";

const TestimonialsSection = () => {
  const testimonials = [
    {
      id: 1,
      name: "Kofi Mensah",
      role: "UI Designer at TechGhana",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face",
      content: "CreativeHub has completely transformed my workflow. The quality of assets here is unmatched, and I've saved countless hours on my projects.",
      rating: 5,
    },
    {
      id: 2,
      name: "Ama Owusu",
      role: "Freelance Designer",
      avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop&crop=face",
      content: "As a freelancer, having access to premium templates and UI kits at such great prices has helped me deliver better work to my clients faster.",
      rating: 5,
    },
    {
      id: 3,
      name: "Kwame Asante",
      role: "Creative Director",
      avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face",
      content: "The courses on CreativeHub are exceptional. I've upskilled my entire team using the design masterclasses available here.",
      rating: 5,
    },
  ];

  return (
    <section className="py-24 lg:py-32 bg-card/50 relative">
      {/* Background Glow */}
      <div className="absolute top-1/2 right-0 w-[500px] h-[500px] bg-accent/5 rounded-full blur-[200px]" />
      
      <div className="container mx-auto px-4 relative z-10">
        {/* Header */}
        <div className="text-center mb-16">
          <span className="text-primary font-semibold mb-4 block text-sm uppercase tracking-wider">Testimonials</span>
          <h2 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-6">
            Loved by Creators
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Join thousands of designers and developers who trust CreativeHub for their creative needs
          </p>
        </div>

        {/* Grid */}
        <div className="grid md:grid-cols-3 gap-6 lg:gap-8">
          {testimonials.map((testimonial, index) => (
            <div
              key={testimonial.id}
              className="group bg-card rounded-2xl border border-border p-8 card-hover relative overflow-hidden"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              {/* Gradient Overlay on Hover */}
              <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-accent/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              
              {/* Quote Icon */}
              <div className="absolute top-6 right-6">
                <Quote className="w-10 h-10 text-primary/20 group-hover:text-primary/40 transition-colors" />
              </div>

              {/* Rating */}
              <div className="flex items-center gap-1 mb-6 relative z-10">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 fill-warning text-warning" />
                ))}
              </div>

              {/* Content */}
              <p className="text-foreground text-lg mb-8 leading-relaxed relative z-10">
                "{testimonial.content}"
              </p>

              {/* Author */}
              <div className="flex items-center gap-4 relative z-10">
                <div className="relative">
                  <img
                    src={testimonial.avatar}
                    alt={testimonial.name}
                    className="w-14 h-14 rounded-full object-cover ring-2 ring-primary/30 group-hover:ring-primary/60 transition-all"
                  />
                  <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-success rounded-full border-2 border-card" />
                </div>
                <div>
                  <h4 className="font-display font-semibold text-foreground">
                    {testimonial.name}
                  </h4>
                  <p className="text-muted-foreground text-sm">
                    {testimonial.role}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;