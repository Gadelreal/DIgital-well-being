import { Star } from "lucide-react"

export default function TestimonialSection() {
  return (
    <div className="bg-[#ffffff] py-16 px-4">
      <div className="max-w-4xl mx-auto text-center">
        {/* Testimonial Quote */}
        <h2 className="text-3xl md:text-4xl lg:text-5xl font-normal text-[#181d27] leading-tight mb-12 max-w-5xl mx-auto">
          Love the simplicity of the service and the prompt customer support. We can't imagine working without it.
        </h2>

        {/* Profile Image */}
        <div className="mb-6">
          <div className="w-20 h-20 rounded-full bg-[#6941c6] flex items-center justify-center mx-auto">
            <span className="text-white text-2xl font-semibold">CK</span>
          </div>
        </div>

        {/* Name and Title */}
        <div className="mb-6">
          <h3 className="text-xl font-semibold text-[#181d27] mb-1">Caitlyn King</h3>
          <p className="text-[#535862] text-base">Head of Design, Layers</p>
        </div>

        {/* Star Rating */}
        <div className="flex justify-center gap-1 mb-8">
          {[...Array(5)].map((_, i) => (
            <Star key={i} className="w-5 h-5 fill-[#fec84b] text-[#fec84b]" />
          ))}
        </div>

        {/* Pagination Dots */}
        <div className="flex justify-center gap-2">
          <div className="w-2 h-2 rounded-full bg-[#6941c6]"></div>
          <div className="w-2 h-2 rounded-full bg-[#e9eaeb]"></div>
          <div className="w-2 h-2 rounded-full bg-[#e9eaeb]"></div>
          <div className="w-2 h-2 rounded-full bg-[#e9eaeb]"></div>
          <div className="w-2 h-2 rounded-full bg-[#e9eaeb]"></div>
        </div>
      </div>
    </div>
  )
}
