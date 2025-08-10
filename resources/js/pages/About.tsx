import Header from "@/components/custom/Header";
import Footer from "@/components/custom/Footer";
import { Building2, Users, Award, Target } from "lucide-react";
import PageHero from "@/components/custom/PageHero";

const About = () => {
  return (
    <div className="min-h-screen">
      <Header />
      
      {/* Hero Section */}
      <PageHero title="About Silk Corp" subtitle="Leading the industry in premium corporate housing solutions with over a decade of excellence." />

      {/* Our Story */}
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold text-foreground mb-6">Our Story</h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                Founded in 2012, Silk Corp has grown from a small boutique operation to one of the most trusted names in corporate housing. We understand that business travelers and relocating professionals need more than just a place to stay—they need a home away from home.
              </p>
              <p className="text-muted-foreground leading-relaxed">
                Our commitment to excellence, attention to detail, and personalized service has made us the preferred choice for Fortune 500 companies and discerning individuals alike.
              </p>
            </div>
            <div className="bg-gradient-to-br from-primary/10 to-accent/10 p-8 rounded-lg">
              <div className="grid grid-cols-2 gap-6">
                <div className="text-center">
                  <div className="text-3xl font-bold text-primary mb-2">500+</div>
                  <div className="text-sm text-muted-foreground">Properties</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-primary mb-2">50+</div>
                  <div className="text-sm text-muted-foreground">Cities</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-primary mb-2">10K+</div>
                  <div className="text-sm text-muted-foreground">Happy Guests</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-primary mb-2">98%</div>
                  <div className="text-sm text-muted-foreground">Satisfaction</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Our Values</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center p-6">
              <Building2 className="h-12 w-12 text-primary mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">Quality</h3>
              <p className="text-muted-foreground">Premium properties in prime locations</p>
            </div>
            <div className="text-center p-6">
              <Users className="h-12 w-12 text-primary mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">Service</h3>
              <p className="text-muted-foreground">24/7 support and personalized care</p>
            </div>
            <div className="text-center p-6">
              <Award className="h-12 w-12 text-primary mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">Excellence</h3>
              <p className="text-muted-foreground">Industry-leading standards</p>
            </div>
            <div className="text-center p-6">
              <Target className="h-12 w-12 text-primary mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">Innovation</h3>
              <p className="text-muted-foreground">Modern solutions for modern needs</p>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default About;