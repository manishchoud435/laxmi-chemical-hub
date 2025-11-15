import { CheckCircle2, Award, Users, TrendingUp, Shield } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

const features = [
  {
    icon: Shield,
    title: "Quality Assurance",
    description: "Premium quality chemicals from trusted sources"
  },
  {
    icon: TrendingUp,
    title: "Competitive Pricing",
    description: "Best prices in the market without compromising quality"
  },
  {
    icon: Users,
    title: "Expert Team",
    description: "Highly competent professionals ready to serve"
  },
  {
    icon: Award,
    title: "Since 2006",
    description: "Over 18 years of industry experience"
  }
];

const About = () => {
  return (
    <section id="about" className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Column - Text Content */}
          <div>
            <div className="inline-block mb-4">
              <span className="bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-semibold">
                About Us
              </span>
            </div>
            
            <h2 className="text-3xl md:text-4xl font-bold mb-6 text-foreground">
              About Laxmi Chemicals
            </h2>
            
            <div className="prose prose-lg max-w-none mb-8">
              <p className="text-muted-foreground leading-relaxed mb-4">
                Established in <strong className="text-foreground">2006</strong>, we are recognized 
                <strong className="text-foreground"> Distributors and Stockists in Karnataka</strong> for 
                quality chemicals. Our team is highly competent and ready to meet challenges and provide 
                best solutions to our customers.
              </p>
              
              <p className="text-muted-foreground leading-relaxed">
                We are capable of meeting all the basic chemical requirements across various industries. 
                Our commitment lies in maintaining <strong className="text-foreground">strong business ethics</strong>, 
                delivering high-quality chemicals at the most competitive prices.
              </p>
            </div>

            {/* Key Points */}
            <div className="space-y-3 mb-8">
              {[
                "Recognized distributor in Karnataka",
                "Serving diverse industries since 2006",
                "Comprehensive chemical solutions",
                "Strong business ethics and reliability"
              ].map((point) => (
                <div key={point} className="flex items-start gap-3">
                  <CheckCircle2 className="h-6 w-6 text-primary flex-shrink-0 mt-0.5" />
                  <span className="text-foreground font-medium">{point}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Right Column - Feature Cards */}
          <div className="grid sm:grid-cols-2 gap-6">
            {features.map((feature) => (
              <Card
                key={feature.title}
                className="border-border/50 hover:shadow-lg hover:border-primary/50 transition-all duration-300 group"
              >
                <CardContent className="p-6">
                  <div className="mb-4 inline-flex p-3 rounded-lg bg-primary/10 group-hover:bg-primary/20 transition-colors">
                    <feature.icon className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="text-lg font-bold mb-2 text-foreground">
                    {feature.title}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {feature.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
