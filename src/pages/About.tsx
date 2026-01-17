import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { Users, Download, Star, Globe } from "lucide-react";

const About = () => {
  const stats = [
    { icon: Users, value: "12,000+", label: "Active Creators" },
    { icon: Download, value: "500K+", label: "Total Downloads" },
    { icon: Star, value: "4.9", label: "Average Rating" },
    { icon: Globe, value: "50+", label: "Countries" },
  ];

  const team = [
    { name: "Kwame Asante", role: "Founder & CEO", image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&h=200&fit=crop&crop=face" },
    { name: "Ama Owusu", role: "Head of Design", image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&h=200&fit=crop&crop=face" },
    { name: "Kofi Mensah", role: "Lead Developer", image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop&crop=face" },
    { name: "Akosua Boateng", role: "Community Manager", image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200&h=200&fit=crop&crop=face" },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pt-24 pb-16">
        <div className="container mx-auto px-4">
          {/* Hero */}
          <div className="text-center mb-20">
            <span className="text-primary font-semibold mb-4 block text-sm uppercase tracking-wider">About Us</span>
            <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-6">
              Empowering African Creators
            </h1>
            <p className="text-muted-foreground text-lg max-w-3xl mx-auto leading-relaxed">
              CreativeHub is the premier digital marketplace built specifically for African designers and creators.
              We believe in providing world-class tools and resources that enable our community to create, share, and thrive.
            </p>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-20">
            {stats.map((stat) => (
              <div key={stat.label} className="bg-card rounded-2xl border border-border p-8 text-center card-hover">
                <div className="w-14 h-14 rounded-2xl bg-gradient-primary flex items-center justify-center mx-auto mb-4 glow-sm">
                  <stat.icon className="w-7 h-7 text-primary-foreground" />
                </div>
                <div className="font-display font-bold text-3xl text-foreground mb-2">{stat.value}</div>
                <div className="text-muted-foreground text-sm">{stat.label}</div>
              </div>
            ))}
          </div>

          {/* Mission */}
          <div className="glass-strong rounded-3xl p-8 lg:p-16 mb-20">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="font-display text-3xl lg:text-4xl font-bold text-foreground mb-6">Our Mission</h2>
                <p className="text-muted-foreground text-lg leading-relaxed mb-6">
                  We're on a mission to democratize access to premium design resources for creators across Africa and beyond.
                  By providing affordable, high-quality assets and educational content, we're helping thousands of designers
                  build their skills and grow their businesses.
                </p>
                <p className="text-muted-foreground text-lg leading-relaxed">
                  Founded in Ghana in 2023, CreativeHub has quickly grown to become the go-to destination for digital creators
                  seeking professional-grade templates, UI kits, graphics, and courses.
                </p>
              </div>
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-accent/10 rounded-3xl blur-2xl" />
                <div className="relative glass rounded-3xl p-8 text-center">
                  <div className="font-display text-6xl font-bold text-gradient mb-4">2023</div>
                  <div className="text-muted-foreground text-lg">Founded in Accra, Ghana</div>
                </div>
              </div>
            </div>
          </div>

          {/* Team */}
          <div className="text-center mb-12">
            <h2 className="font-display text-3xl lg:text-4xl font-bold text-foreground mb-4">Meet Our Team</h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              The passionate people behind CreativeHub
            </p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {team.map((member) => (
              <div key={member.name} className="bg-card rounded-2xl border border-border p-6 text-center card-hover">
                <img
                  src={member.image}
                  alt={member.name}
                  className="w-24 h-24 rounded-full mx-auto mb-4 object-cover ring-4 ring-primary/20"
                />
                <h3 className="font-display font-semibold text-lg text-foreground">{member.name}</h3>
                <p className="text-muted-foreground text-sm">{member.role}</p>
              </div>
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default About;