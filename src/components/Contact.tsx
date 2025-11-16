import { MapPin, Phone, Mail, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

const contactInfo = [
  {
    icon: MapPin,
    title: "Address",
    content: "#B-4, Hebbal Industrial Area, Mysore-570016",
    link: "https://maps.app.goo.gl/emAWUCsEAtEyh33y7"
  },
  {
    icon: Phone,
    title: "WhatsApp",
    content: "+91 9886174335",
    link: "https://wa.me/919886174335"
  },
  {
    icon: Mail,
    title: "Email",
    content: "laxmichem7@gmail.com",
    link: "https://mail.google.com/mail/?view=cm&fs=1&to=laxmichem7@gmail.com&su=Inquiry%20about%20Chemical%20Products"
  }
];

const Contact = () => {
  return (
    <section id="contact" className="py-20 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <div className="inline-block mb-4">
            <span className="bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-semibold">
              Get in Touch
            </span>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-foreground">
            Contact Us
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Have questions or need a quote? We're here to help with your chemical requirements.
          </p>
        </div>

        <div className="max-w-5xl mx-auto">
          <div className="grid md:grid-cols-3 gap-6 mb-12">
            {contactInfo.map((info) => (
              <Card
                key={info.title}
                className="border-border/50 hover:shadow-lg hover:border-primary/50 transition-all duration-300 group"
              >
                <CardContent className="p-6 text-center">
                  <div className="mb-4 inline-flex p-4 rounded-full bg-primary/10 group-hover:bg-primary/20 transition-colors">
                    <info.icon className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="text-lg font-bold mb-2 text-foreground">
                    {info.title}
                  </h3>
                  <a
                    href={info.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-muted-foreground hover:text-primary transition-colors inline-block"
                  >
                    {info.content}
                  </a>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* CTA Card */}
          <Card className="border-2 border-primary/20 bg-gradient-to-br from-primary/5 to-secondary/5">
            <CardContent className="p-8 md:p-12 text-center">
              <h3 className="text-2xl md:text-3xl font-bold mb-4 text-foreground">
                Ready to Order?
              </h3>
              <p className="text-muted-foreground mb-8 max-w-2xl mx-auto">
                Contact us today for competitive pricing, product availability, and expert consultation 
                on your chemical requirements.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <a href="https://wa.me/919886174335" target="_blank" rel="noopener noreferrer">
                  <Button size="lg" className="gap-2 w-full sm:w-auto">
                    <Phone className="h-5 w-5" />
                    WhatsApp Now
                  </Button>
                </a>
                <a href="https://mail.google.com/mail/?view=cm&fs=1&to=laxmichem7@gmail.com&su=Inquiry%20about%20Chemical%20Products" target="_blank" rel="noopener noreferrer">
                  <Button size="lg" variant="outline" className="gap-2 w-full sm:w-auto">
                    <Send className="h-5 w-5" />
                    Send Email
                  </Button>
                </a>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default Contact;
