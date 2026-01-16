import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Play, Clock, Users, Star, ArrowRight } from "lucide-react";

const CoursesSection = () => {
  const courses = [
    {
      id: 1,
      title: "Complete UI/UX Design Masterclass",
      instructor: "Sarah Johnson",
      duration: "24 hours",
      students: 3420,
      rating: 4.9,
      price: 99,
      originalPrice: 199,
      image: "https://images.unsplash.com/photo-1626785774573-4b799315345d?w=600&h=400&fit=crop",
      level: "Beginner",
      lessons: 48,
    },
    {
      id: 2,
      title: "Advanced Figma Techniques",
      instructor: "Mike Chen",
      duration: "16 hours",
      students: 1890,
      rating: 4.8,
      price: 79,
      image: "https://images.unsplash.com/photo-1581291518857-4e27b48ff24e?w=600&h=400&fit=crop",
      level: "Intermediate",
      lessons: 32,
    },
    {
      id: 3,
      title: "Design Systems from Scratch",
      instructor: "Emily Davis",
      duration: "20 hours",
      students: 2150,
      rating: 4.9,
      price: 0,
      image: "https://images.unsplash.com/photo-1558655146-9f40138edfeb?w=600&h=400&fit=crop",
      level: "Advanced",
      lessons: 40,
    },
  ];

  return (
    <section className="py-20 lg:py-32 bg-background">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-12">
          <div>
            <span className="text-primary font-medium mb-4 block">Learn & Grow</span>
            <h2 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold text-foreground">
              Featured Courses
            </h2>
          </div>
          <Button variant="outline" className="self-start md:self-auto">
            Browse All Courses
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </div>

        {/* Grid */}
        <div className="grid lg:grid-cols-3 gap-6 lg:gap-8">
          {courses.map((course) => (
            <div
              key={course.id}
              className="group bg-card rounded-2xl border border-border overflow-hidden card-hover"
            >
              {/* Image */}
              <div className="relative aspect-video overflow-hidden">
                <img
                  src={course.image}
                  alt={course.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                
                {/* Play Button */}
                <div className="absolute inset-0 flex items-center justify-center bg-foreground/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div className="w-16 h-16 rounded-full bg-primary flex items-center justify-center shadow-glow">
                    <Play className="w-7 h-7 text-primary-foreground ml-1" />
                  </div>
                </div>

                {/* Badges */}
                <div className="absolute top-4 left-4 flex gap-2">
                  <Badge variant="secondary">{course.level}</Badge>
                  {course.price === 0 && (
                    <Badge className="bg-success text-success-foreground">Free</Badge>
                  )}
                </div>
              </div>

              {/* Content */}
              <div className="p-6">
                <h3 className="font-display font-semibold text-xl text-foreground mb-2 group-hover:text-primary transition-colors line-clamp-2">
                  {course.title}
                </h3>
                
                <p className="text-muted-foreground text-sm mb-4">
                  by {course.instructor}
                </p>

                {/* Stats */}
                <div className="flex items-center gap-4 mb-4 text-sm text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    <span>{course.duration}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Play className="w-4 h-4" />
                    <span>{course.lessons} lessons</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Users className="w-4 h-4" />
                    <span>{course.students.toLocaleString()}</span>
                  </div>
                </div>

                {/* Rating & Price */}
                <div className="flex items-center justify-between pt-4 border-t border-border">
                  <div className="flex items-center gap-1">
                    <Star className="w-5 h-5 fill-warning text-warning" />
                    <span className="font-semibold">{course.rating}</span>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    {course.originalPrice && (
                      <span className="text-muted-foreground line-through text-sm">
                        ${course.originalPrice}
                      </span>
                    )}
                    <span className="font-display font-bold text-xl text-foreground">
                      {course.price === 0 ? "Free" : `$${course.price}`}
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

export default CoursesSection;
