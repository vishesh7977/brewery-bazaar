
import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight, Mail, Phone, MapPin } from "lucide-react";

export default function AboutUs() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-secondary">
        <div className="container mx-auto px-4 py-16 md:py-24">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">About Brewery</h1>
            <p className="text-lg md:text-xl text-muted-foreground mb-0">
              Premium streetwear inspired by Mumbai's vibrant culture
            </p>
          </div>
        </div>
      </section>

      {/* Our Story */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold mb-6">Our Story</h2>
              <p className="text-muted-foreground mb-4">
                Brewery was born in 2020 from a passion for authentic streetwear that reflects 
                the dynamic energy of Mumbai. What started as a small collection of graphic tees 
                has grown into a comprehensive streetwear brand that celebrates urban culture.
              </p>
              <p className="text-muted-foreground mb-4">
                Our founders, a group of fashion enthusiasts and street culture advocates, noticed 
                a gap in the market for affordable yet high-quality streetwear that resonates with 
                the youth of India.
              </p>
              <p className="text-muted-foreground mb-6">
                Today, Brewery stands at the intersection of comfort, style, and cultural expression, 
                offering premium streetwear that doesn't break the bank.
              </p>
              <Button asChild>
                <Link to="/products">
                  Explore Our Collection <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
            <div className="rounded-lg overflow-hidden">
              <img 
                src="https://images.unsplash.com/photo-1581090700227-1e37b190418e?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80" 
                alt="Brewery team" 
                className="w-full h-auto object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Our Values */}
      <section className="py-16 bg-secondary">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-12 text-center">Our Values</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-background p-8 rounded-lg card-shadow">
              <h3 className="text-xl font-bold mb-4">Quality</h3>
              <p className="text-muted-foreground">
                We source only the finest materials and work with skilled craftspeople to ensure 
                our products meet the highest standards of quality and durability.
              </p>
            </div>
            <div className="bg-background p-8 rounded-lg card-shadow">
              <h3 className="text-xl font-bold mb-4">Authenticity</h3>
              <p className="text-muted-foreground">
                Every design tells a story that's rooted in real urban experiences and cultural 
                narratives, bringing authenticity to every piece we create.
              </p>
            </div>
            <div className="bg-background p-8 rounded-lg card-shadow">
              <h3 className="text-xl font-bold mb-4">Accessibility</h3>
              <p className="text-muted-foreground">
                We believe great style should be accessible to all, which is why we offer premium 
                quality at prices that don't exclude the very audience we design for.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Information */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-12 text-center">Get In Touch</h2>
          <div className="max-w-3xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
              <div className="p-6">
                <Mail className="mx-auto h-8 w-8 mb-4 text-primary" />
                <h3 className="text-lg font-medium mb-2">Email Us</h3>
                <a href="mailto:contact@brewery.com" className="text-primary hover:underline">
                  contact@brewery.com
                </a>
              </div>
              <div className="p-6">
                <Phone className="mx-auto h-8 w-8 mb-4 text-primary" />
                <h3 className="text-lg font-medium mb-2">Call Us</h3>
                <a href="tel:+919876543210" className="text-primary hover:underline">
                  +91 98765 43210
                </a>
              </div>
              <div className="p-6">
                <MapPin className="mx-auto h-8 w-8 mb-4 text-primary" />
                <h3 className="text-lg font-medium mb-2">Visit Us</h3>
                <p className="text-muted-foreground">
                  42 Fashion Street, Mumbai, India - 400001
                </p>
              </div>
            </div>
            <div className="mt-12 text-center">
              <Button asChild size="lg">
                <Link to="/contact">
                  Contact Us
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
