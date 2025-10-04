
"use client"

import * as React from "react"
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel"

export function TestimonialsSection() {
  const testimonials = [
    {
      quote: "CampusConnect has revolutionized how we manage attendance. It's saved us countless hours.",
      name: "Dr. Alan Turing",
      role: "Head of Computer Science",
      avatar: "https://placehold.co/40x40.png",
      aiHint: "male portrait",
      initials: "AT"
    },
    {
      quote: "As a student, it's so easy to keep track of my classes and grades. Everything is in one place!",
      name: "Alice Johnson",
      role: "Computer Science Student",
      avatar: "https://placehold.co/40x40.png",
      aiHint: "female portrait",
      initials: "AJ"
    },
    {
      quote: "The admin dashboard gives us a complete overview of the entire institution at a glance. It's incredibly powerful.",
      name: "Admin User",
      role: "University Administrator",
      avatar: "https://placehold.co/40x40.png",
      aiHint: "person portrait",
      initials: "AU"
    },
    {
      quote: "The AI-powered analytics help us identify at-risk students before it's too late. A game-changer for student success.",
      name: "Prof. Marie Curie",
      role: "Dean of Academic Affairs",
      avatar: "https://placehold.co/40x40.png",
      aiHint: "female scientist",
      initials: "MC"
    },
    {
        quote: "The integration with our existing SIS was seamless. The support team was fantastic.",
        name: "John von Neumann",
        role: "IT Director",
        avatar: "https://placehold.co/40x40.png",
        aiHint: "male professional",
        initials: "JVN"
    },
    {
        quote: "I love the mobile app. It's so convenient to check my schedule and get notifications on the go.",
        name: "Grace Hopper",
        role: "Engineering Student",
        avatar: "https://placehold.co/40x40.png",
        aiHint: "female student",
        initials: "GH"
    }
  ];

  return (
    <section className="w-full py-12 md:py-24 lg:py-32 bg-muted">
      <div className="container px-4 md:px-6">
        <div className="flex flex-col items-center justify-center space-y-4 text-center mb-12">
          <div className="inline-block rounded-lg bg-secondary px-3 py-1 text-sm">
            Testimonials
          </div>
          <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">
            What Our Users Say
          </h2>
          <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
            Hear from educators and students who have transformed their campus experience.
          </p>
        </div>
        <Carousel
          opts={{
            align: "start",
            loop: true,
          }}
          className="w-full max-w-6xl mx-auto"
        >
          <CarouselContent>
            {testimonials.map((testimonial, index) => (
              <CarouselItem key={index} className="md:basis-1/2 lg:basis-1/3">
                <div className="p-8 h-full">
                  <blockquote className="text-lg font-semibold leading-snug lg:text-xl lg:leading-normal">
                    “{testimonial.quote}”
                  </blockquote>
                  <div className="mt-6 flex items-center gap-4">
                    <Avatar>
                      <AvatarImage src={testimonial.avatar} data-ai-hint={testimonial.aiHint} />
                      <AvatarFallback>{testimonial.initials}</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-semibold text-primary">{testimonial.name}</p>
                      <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                    </div>
                  </div>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
        </Carousel>
      </div>
    </section>
  );
}
