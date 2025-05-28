import { ArrowRight } from "lucide-react"

const processSteps = [
  {
    number: "1",
    title: "Assess Current Culture",
    description:
      "Understand the existing culture and values that are already embedded in the organization's practices and behaviors to ensure alignment. This can be done through surveys, interviews, focus groups, and observation.",
    link: "Click here for more info",
  },
  {
    number: "2",
    title: "Define Digital Wellbeing Goals",
    description:
      "Establish clear objectives for digital wellness initiatives that align with organizational values and employee needs. Set measurable targets for reducing digital stress and improving work-life balance.",
    link: "Learn more about goals",
  },
  {
    number: "3",
    title: "Implement Wellness Programs",
    description:
      "Deploy comprehensive digital wellness programs including training sessions, mindfulness apps, and technology usage guidelines. Create supportive environments that promote healthy digital habits.",
    link: "Explore our programs",
  },
  {
    number: "4",
    title: "Monitor and Optimize",
    description:
      "Continuously track progress through analytics and feedback mechanisms. Adjust strategies based on data insights and employee responses to ensure maximum effectiveness and engagement.",
    link: "View monitoring tools",
  },
]

export default function ProcessCards() {
  return (
    <section className="bg-[#ffffff] py-16 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Title Section */}
        <div className="mb-16">
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-normal text-[#181d27] leading-tight mb-6">
            Our Digital Wellbeing Process
          </h2>
          <p className="text-xl text-[#535862] max-w-3xl leading-relaxed">
            We follow a comprehensive four-step approach to help organizations build sustainable digital wellness
            cultures that enhance productivity while protecting employee wellbeing.
          </p>
        </div>

        {/* Cards Grid - 4 Column Layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {processSteps.map((step, index) => (
            <div
              key={index}
              className="bg-[#2a3d60] rounded-lg p-6 text-white hover:transform hover:scale-105 transition-all duration-300 cursor-pointer"
            >
              {/* Number and Arrow */}
              <div className="flex items-center mb-4">
                <span className="text-4xl font-light mr-3">{step.number}</span>
                <ArrowRight className="w-6 h-6" />
              </div>

              {/* Title */}
              <h3 className="text-xl font-normal mb-4 leading-tight">{step.title}</h3>

              {/* Description */}
              <p className="text-sm leading-relaxed mb-6 opacity-90">{step.description}</p>

              {/* Link */}
              <button className="text-sm underline hover:no-underline transition-all duration-200 hover:opacity-80">
                {step.link}
              </button>
            </div>
          ))}
        </div>

        {/* Bottom Text */}
        <div>
          <p className="text-lg text-[#535862] max-w-4xl leading-relaxed">
            Each step in our process is designed to create lasting change in your organization's relationship with
            technology. Our evidence-based approach ensures that digital wellness becomes an integral part of your
            company culture, leading to improved employee satisfaction, reduced burnout, and enhanced overall
            performance.
          </p>
        </div>
      </div>
    </section>
  )
}
