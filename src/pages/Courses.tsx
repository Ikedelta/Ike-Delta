import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Clock, Users, Star, Play, BookOpen } from "lucide-react";

const Courses = () => {
  const courses = [
    { id: 1, title: "Complete UI/UX Design Masterclass", instructor: "Sarah Johnson", duration: "12 hours", students: 2340, rating: 4.9, price: 89, originalPrice: 149, image: "https://images.unsplash.com/photo-1626785774573-4b799315345d?w=600&h=400&fit=crop", level: "Beginner", lessons: 48 },
    { id: 2, title: "Advanced Figma for Professionals", instructor: "Michael Chen", duration: "8 hours", students: 1890, rating: 4.8, price: 0, image: "https://images.unsplash.com/photo-1559028012-481c04fa702d?w=600&h=400&fit=crop", level: "Advanced", lessons: 32 },
    { id: 3, title: "Brand Identity Design Complete Guide", instructor: "Emma Williams", duration: "10 hours", students: 1560, rating: 4.9, price: 69, image: "https://images.unsplash.com/photo-1561070791-2526d30994b5?w=600&h=400&fit=crop", level: "Intermediate", lessons: 36 },
    { id: 4, title: "Motion Design Fundamentals", instructor: "David Park", duration: "6 hours", students: 980, rating: 4.7, price: 49, image: "https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=600&h=400&fit=crop", level: "Beginner", lessons: 24 },
    { id: 5, title: "Web Development Bootcamp", instructor: "Alex Turner", duration: "20 hours", students: 3200, rating: 4.9, price: 129, originalPrice: 199, image: "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=600&h=400&fit=crop", level: "Beginner", lessons: 80 },
    { id: 6, title: "Photography Masterclass", instructor: "Lisa Brown", duration: "8 hours", students: 1450, rating: 4.8, price: 59, image: "https://images.unsplash.com/photo-1542038784456-1ea8e935640e?w=600&h=400&fit=crop", level: "Intermediate", lessons: 32 },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pt-24 pb-16">
        <div className="container mx-auto px-4">
          {/* Header */}
          <div className="text-center mb-16">
            <span className="text-primary font-semibold mb-4 block text-sm uppercase tracking-wider">Learn</span>
            <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-6">
              All Courses
            </h1>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Level up your skills with expert-led courses and tutorials
            </p>
          </div>

          {/* Courses Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {courses.map((course) => (
              <div key={course.id} className="group bg-card rounded-2xl border border-border overflow-hidden card-hover">
                <div className="relative aspect-video overflow-hidden">
                  <img src={course.image} alt={course.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                  <div className="absolute inset-0 flex items-center justify-center bg-background/40 opacity-0 group-hover:opacity-100 transition-all duration-300">
                    <div className="w-16 h-16 rounded-full bg-primary flex items-center justify-center glow-sm group-hover:scale-110 transition-transform cursor-pointer">
                      <Play className="w-6 h-6 text-primary-foreground ml-1" fill="currentColor" />
                    </div>
                  </div>
                  <div className="absolute top-4 left-4 flex gap-2">
                    <Badge className={`border-0 ${course.level === 'Beginner' ? 'bg-success text-success-foreground' : course.level === 'Advanced' ? 'bg-accent text-accent-foreground' : 'bg-primary text-primary-foreground'}`}>
                      {course.level}
                    </Badge>
                    {course.price === 0 && <Badge className="bg-success text-success-foreground border-0">Free</Badge>}
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="font-display font-semibold text-lg text-foreground mb-3 group-hover:text-primary transition-colors line-clamp-2">{course.title}</h3>
                  <p className="text-muted-foreground text-sm mb-4">by {course.instructor}</p>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground mb-5">
                    <div className="flex items-center gap-1.5"><Clock className="w-4 h-4" />{course.duration}</div>
                    <div className="flex items-center gap-1.5"><BookOpen className="w-4 h-4" />{course.lessons} lessons</div>
                    <div className="flex items-center gap-1.5"><Users className="w-4 h-4" />{course.students.toLocaleString()}</div>
                  </div>
                  <div className="flex items-center justify-between pt-4 border-t border-border">
                    <div className="flex items-center gap-1.5">
                      <Star className="w-4 h-4 fill-warning text-warning" />
                      <span className="font-medium text-foreground">{course.rating}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      {course.originalPrice && <span className="text-muted-foreground line-through text-sm">${course.originalPrice}</span>}
                      <span className="font-display font-bold text-xl">{course.price === 0 ? "Free" : `$${course.price}`}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Load More */}
          <div className="text-center mt-12">
            <Button variant="outline" size="lg" className="border-border hover:border-primary/50">
              Load More Courses
            </Button>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Courses;