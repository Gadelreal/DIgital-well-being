"use client"

import { ChevronLeft, ChevronRight, Star } from "lucide-react"
import { useState } from "react"

const testimonials = [
  {
    id: 1,
    quote: "We've been using Untitled to kick start every new project and can't imagine working without it.",
    name: "Lana Steiner",
    company: "Layers",
    role: "Designer",
    agency: "Web Design Agency",
    image: "/images/geometric-shapes.png",
  },
  {
    id: 2,
    quote: "Love the simplicity of the service and the prompt customer support. We can't imagine working without it.",
    name: "Caitlyn King",
    company: "Layers",
    role: "Head of Design",
    agency: "Digital Agency",
    image: "/images/testimonial-woman.png",
  },
  {
    id: 3,
    quote:
      "The platform has transformed how we approach client projects. It's become an essential part of our workflow.",
    name: "Sarah Chen",
    company: "Creative Studio",
    role: "Creative Director",
    agency: "Brand Strategy",
    image: "/placeholder.svg?height=600&width=480&query=confident woman creative director",
  },
]

export default function TestimonialHero() {
  const [currentIndex, setCurrentIndex] = useState(0)

  const nextTestimonial = () => {
    setCurrentIndex((prev) => (prev + 1) % testimonials.length)
  }

  const prevTestimonial = () => {
    setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length)
  }

  const currentTestimonial = testimonials[currentIndex]

  return (
    <div className="bg-[#f5f5f5] py-16 px-4 relative overflow-hidden">
      <div className="max-w-7xl mx-auto relative">
        {/* Background Image - Positioned absolutely to allow overlap */}
        <div className="absolute top-0 right-0 w-2/3 h-full">
          <img
            src={currentTestimonial.image || "/placeholder.svg"}
            alt={currentTestimonial.name}
            className="w-full h-full object-cover transition-all duration-500"
          />
        </div>

        {/* Content Container */}
        <div className="relative z-10 flex items-center min-h-[600px]">
          {/* Left Content - Overlapping with image */}
          <div className="w-2/3 space-y-8 pr-8">
            <h2 className="text-4xl lg:text-5xl xl:text-6xl font-normal text-[#181d27] leading-tight transition-all duration-500">
              {currentTestimonial.quote}
            </h2>

            <div className="space-y-4">
              <div className="transition-all duration-500">
                <h3 className="text-xl font-semibold text-[#181d27]">{currentTestimonial.name}</h3>
                <p className="text-[#535862]">{currentTestimonial.company}</p>
              </div>

              {/* Navigation Arrows */}
              <div className="flex gap-4">
                <button
                  onClick={prevTestimonial}
                  className="w-12 h-12 rounded-full border border-[#e9eaeb] bg-white flex items-center justify-center hover:bg-[#e9eaeb] transition-colors"
                >
                  <ChevronLeft className="w-5 h-5 text-[#535862]" />
                </button>
                <button
                  onClick={nextTestimonial}
                  className="w-12 h-12 rounded-full border border-[#e9eaeb] bg-white flex items-center justify-center hover:bg-[#e9eaeb] transition-colors"
                >
                  <ChevronRight className="w-5 h-5 text-[#535862]" />
                </button>
              </div>

              {/* Carousel Indicators */}
              <div className="flex gap-2 pt-4">
                {testimonials.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentIndex(index)}
                    className={`w-2 h-2 rounded-full transition-colors ${
                      index === currentIndex ? "bg-[#6941c6]" : "bg-[#e9eaeb]"
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Overlay Card - Positioned absolutely over the image */}
        <div className="absolute bottom-8 right-8 bg-white/90 backdrop-blur-sm rounded-lg p-6 transition-all duration-500 max-w-sm">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-semibold text-[#181d27]">{currentTestimonial.name}</h4>
              <p className="text-sm text-[#535862]">
                {currentTestimonial.role}, {currentTestimonial.company}
              </p>
              <p className="text-sm text-[#535862]">{currentTestimonial.agency}</p>
            </div>
            <div className="flex gap-1 ml-4">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-4 h-4 fill-[#fec84b] text-[#fec84b]" />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
