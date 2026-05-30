import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { Users, Download, Star, Globe, Heart, Target, Sparkles, Award } from "lucide-react";
import avatarKwame from "@/assets/avatar-kwame.jpg";
import avatarAma from "@/assets/avatar-ama.jpg";
import avatarKofi from "@/assets/avatar-kofi.jpg";
import avatarAkosua from "@/assets/avatar-akosua.jpg";

const About = () => {
  const stats = [
    { icon: Users, value: "12,000+", label: "Active Creators" },
    { icon: Download, value: "500K+", label: "Total Downloads" },
    { icon: Star, value: "4.9", label: "Average Rating" },
    { icon: Globe, value: "50+", label: "Countries" },
  ];

  const values = [
    { icon: Heart, title: "Community First", description: "Built by creators, for creators across Africa." },
    { icon: Target, title: "Quality Driven", description: "Every asset reviewed for premium standards." },
    { icon: Sparkles, title: "Always Evolving", description: "New products and features added weekly." },
    { icon: Award, title: "Trusted Worldwide", description: "Recognized by thousands of brands globally." },
  ];

  const team = [
    { name: "Kwame Asante", role: "Founder & CEO", image: avatarKwame },
    { name: "Ama Owusu", role: "Head of Design", image: avatarAma },
    { name: "Kofi Mensah", role: "Lead Developer", image: avatarKofi },
    { name: "Akosua Boateng", role: "Community Manager", image: avatarAkosua },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pt-20 sm:pt-24 pb-16">
        <div className="container mx-auto px-4">
          {/* Hero */}
          <div className="text-center mb-12 sm:mb-20">
            <span className="text-primary font-semibold mb-3 sm:mb-4 block text-xs sm:text-sm uppercase tracking-wider">About Us</span>
            <h1 className="font-display text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-4 sm:mb-6">
              Empowering African Creators
            </h1>
            <p className="text-muted-foreground text-base sm:text-lg max-w-3xl mx-auto leading-relaxed px-2">
              CreativeHub is the premier digital marketplace built specifically for African designers and creators.
              We believe in providing world-class tools and resources that enable our community to create, share, and thrive.
            </p>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-6 mb-12 sm:mb-20">
            {stats.map((stat) => (
              <div key={stat.label} className="bg-card rounded-2xl border border-border p-4 sm:p-8 text-center card-hover">
                <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-gradient-primary flex items-center justify-center mx-auto mb-3 sm:mb-4 glow-sm">
                  <stat.icon className="w-6 h-6 sm:w-7 sm:h-7 text-primary-foreground" />
                </div>
                <div className="font-display font-bold text-xl sm:text-3xl text-foreground mb-1 sm:mb-2">{stat.value}</div>
                <div className="text-muted-foreground text-xs sm:text-sm">{stat.label}</div>
              </div>
            ))}
          </div>

          {/* Mission */}
          <div className="glass-strong rounded-3xl p-6 sm:p-8 lg:p-16 mb-12 sm:mb-20">
            <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
              <div>
                <h2 className="font-display text-2xl sm:text-3xl lg:text-4xl font-bold text-foreground mb-4 sm:mb-6">Our Mission</h2>
                <p className="text-muted-foreground text-base sm:text-lg leading-relaxed mb-4 sm:mb-6">
                  We're on a mission to democratize access to premium design resources for creators across Africa and beyond.
                  By providing affordable, high-quality assets and educational content, we're helping thousands of designers
                  build their skills and grow their businesses.
                </p>
                <p className="text-muted-foreground text-base sm:text-lg leading-relaxed">
                  Founded in Ghana in 2023, CreativeHub has quickly grown to become the go-to destination for digital creators
                  seeking professional-grade templates, UI kits, graphics, and courses.
                </p>
              </div>
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-accent/10 rounded-3xl blur-2xl" />
                <div className="relative glass rounded-3xl p-6 sm:p-8 text-center">
                  <div className="font-display text-5xl sm:text-6xl font-bold text-gradient mb-3 sm:mb-4">2023</div>
                  <div className="text-muted-foreground text-base sm:text-lg">Founded in Accra, Ghana</div>
                </div>
              </div>
            </div>
          </div>

          {/* Values */}
          <div className="text-center mb-8 sm:mb-12">
            <h2 className="font-display text-2xl sm:text-3xl lg:text-4xl font-bold text-foreground mb-3 sm:mb-4">What We Stand For</h2>
            <p className="text-muted-foreground text-base sm:text-lg max-w-2xl mx-auto px-2">
              The values that guide everything we do
            </p>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6 mb-12 sm:mb-20">
            {values.map((v) => (
              <div key={v.title} className="bg-card rounded-2xl border border-border p-4 sm:p-6 card-hover">
                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-3 sm:mb-4">
                  <v.icon className="w-5 h-5 sm:w-6 sm:h-6 text-primary" />
                </div>
                <h3 className="font-display font-semibold text-base sm:text-lg text-foreground mb-1 sm:mb-2">{v.title}</h3>
                <p className="text-muted-foreground text-xs sm:text-sm leading-relaxed">{v.description}</p>
              </div>
            ))}
          </div>

          {/* Team */}
          <div className="text-center mb-8 sm:mb-12">
            <h2 className="font-display text-2xl sm:text-3xl lg:text-4xl font-bold text-foreground mb-3 sm:mb-4">Meet Our Team</h2>
            <p className="text-muted-foreground text-base sm:text-lg max-w-2xl mx-auto px-2">
              The passionate people behind CreativeHub
            </p>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
            {team.map((member) => (
              <div key={member.name} className="bg-card rounded-2xl border border-border p-4 sm:p-6 text-center card-hover">
                <img
                  src={member.image}
                  alt={member.name}
                  loading="lazy"
                  className="w-20 h-20 sm:w-24 sm:h-24 rounded-full mx-auto mb-3 sm:mb-4 object-cover ring-4 ring-primary/20"
                />
                <h3 className="font-display font-semibold text-sm sm:text-lg text-foreground">{member.name}</h3>
                <p className="text-muted-foreground text-xs sm:text-sm">{member.role}</p>
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
