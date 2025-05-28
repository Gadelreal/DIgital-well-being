"use client"

import { useState } from "react"

const glossaryTerms = [
  {
    term: "Accountability Buddy",
    definition: "A supportive partner who helps track progress and encourages consistency in digital well-being goals.",
    letter: "A",
  },
  {
    term: "Attention Management",
    definition:
      "The practice of consciously directing focus in a digital environment to enhance productivity and cognitive health.",
    letter: "A",
  },
  {
    term: "Autonomy (Self-Determination Theory)",
    definition: "The ability to make choices about digital engagement that align with personal values and goals.",
    letter: "A",
  },
  {
    term: "Brain Cognition",
    definition:
      "The way the brain processes information, impacted by digital habits such as screen time and multitasking.",
    letter: "B",
  },
  {
    term: "Behavioral Science",
    definition: "The study of how people form digital habits and how technology influences decision-making.",
    letter: "B",
  },
  {
    term: "Character Strengths",
    definition:
      "Personal strengths (e.g., curiosity, self-regulation) that can be leveraged to cultivate healthy digital habits.",
    letter: "C",
  },
  {
    term: "Cognitive Load",
    definition:
      "The mental effort required to process information, which can be impacted by excessive screen time or multitasking.",
    letter: "C",
  },
  {
    term: "Core Values",
    definition: "Fundamental beliefs that guide digital habits and decision-making.",
    letter: "C",
  },
  {
    term: "Digital Detox",
    definition: "A period of time spent without digital devices to reset habits and improve well-being.",
    letter: "D",
  },
  {
    term: "Digital Flourishing",
    definition:
      "Thriving in a digital environment by balancing technology use with personal and professional well-being.",
    letter: "D",
  },
  {
    term: "Digital Goals",
    definition:
      "Personalized objectives for improving one's digital habits, often using the SMART (Specific, Measurable, Achievable, Relevant, Time-bound) framework.",
    letter: "D",
  },
  {
    term: "Digital Habit Audit",
    definition: "A self-assessment to track technology use and identify areas for improvement.",
    letter: "D",
  },
  {
    term: "Digital Minimalism",
    definition: "A philosophy advocating for intentional and purposeful use of technology to enhance well-being.",
    letter: "D",
  },
  {
    term: "Empathy and Technology",
    definition:
      "The relationship between digital interactions and emotional intelligence, including how technology can impact social connections.",
    letter: "E",
  },
  {
    term: "Energy Management",
    definition: "Strategies to prevent digital fatigue and optimize energy levels in a tech-heavy world.",
    letter: "E",
  },
  {
    term: "Focus & Productivity",
    definition:
      "The ability to maintain attention and effectiveness in work and life, often challenged by digital distractions.",
    letter: "F",
  },
  {
    term: "Flourishing (Well-being Theory)",
    definition:
      "The state of thriving in multiple aspects of life, including physical, mental, emotional, and digital well-being.",
    letter: "F",
  },
  {
    term: "Habit Loop",
    definition:
      "A framework for understanding habit formation, consisting of cue, routine, and reward, applicable to digital behaviors.",
    letter: "H",
  },
  {
    term: "Mindfulness in Technology Use",
    definition: "Practicing present-moment awareness to create intentional and balanced digital interactions.",
    letter: "M",
  },
  {
    term: "Motivation (Self-Determination Theory)",
    definition:
      "Internal and external factors that influence engagement with technology, including autonomy, competence, and relatedness.",
    letter: "M",
  },
  {
    term: "Notification Management",
    definition: "Strategies to reduce interruptions and increase focus, such as disabling non-essential alerts.",
    letter: "N",
  },
  {
    term: "Prefrontal Cortex",
    definition:
      "The part of the brain responsible for decision-making and impulse control, which is affected by digital engagement.",
    letter: "P",
  },
  {
    term: "Psychological Safety and Technology",
    definition: "The impact of digital environments on emotional well-being and security.",
    letter: "P",
  },
  {
    term: "Reflection Practice",
    definition: "Periodic self-check-ins to assess digital habits and their alignment with personal values.",
    letter: "R",
  },
  {
    term: "Screen Time Awareness",
    definition: "Conscious tracking of time spent on digital devices to maintain a balanced lifestyle.",
    letter: "S",
  },
  {
    term: "Self-Regulation",
    definition: "The ability to control impulses and make mindful choices in digital interactions.",
    letter: "S",
  },
  {
    term: "Social Media Hygiene",
    definition:
      "Practices for maintaining a healthy relationship with social platforms, including curating content and setting boundaries.",
    letter: "S",
  },
  {
    term: "Tech-Life Balance",
    definition: "The intentional effort to harmonize technology use with overall well-being.",
    letter: "T",
  },
  {
    term: "Triggers in Digital Use",
    definition:
      "Environmental or psychological cues that prompt certain digital habits, such as checking the phone out of boredom.",
    letter: "T",
  },
  {
    term: "Two-Edge Effect of Technology",
    definition: "The concept that digital tools can both enhance and hinder well-being, depending on usage patterns.",
    letter: "T",
  },
  {
    term: "Willpower and Digital Use",
    definition: "The ability to resist distractions and build positive technology habits.",
    letter: "W",
  },
]

export default function GlossarySection() {
  const [selectedLetter, setSelectedLetter] = useState<string>("All")

  // Get unique letters from the glossary terms
  const availableLetters = Array.from(new Set(glossaryTerms.map((term) => term.letter))).sort()

  // Filter terms based on selected letter
  const filteredTerms =
    selectedLetter === "All" ? glossaryTerms : glossaryTerms.filter((term) => term.letter === selectedLetter)

  return (
    <section className="bg-[#f5f5f5] py-16 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Title Section */}
        <div className="mb-16">
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-normal text-[#181d27] leading-tight mb-6">
            Glossary of Digital Well-being Concepts
          </h2>
          <p className="text-xl text-[#535862] max-w-4xl leading-relaxed mb-6">
            Throughout this course, you will encounter a variety of terms related to digital well-being. To support your
            learning, we have compiled a Glossary of Digital Well-being Concepts.
          </p>
          <p className="text-lg text-[#535862] max-w-4xl leading-relaxed">
            This glossary includes key definitions that will appear throughout the course, and it is available for you
            to consult at any time if you have questions or need clarification. We encourage you to refer back to it
            whenever you need to deepen your understanding or refresh a concept.
          </p>
        </div>

        {/* Letter Filter Selector */}
        <div className="mb-12">
          <div className="flex items-center gap-4">
            <label htmlFor="letter-filter" className="text-lg font-medium text-[#181d27]">
              Filter by letter:
            </label>
            <select
              id="letter-filter"
              value={selectedLetter}
              onChange={(e) => setSelectedLetter(e.target.value)}
              className="px-4 py-2 border border-[#e9eaeb] rounded-lg bg-white text-[#535862] font-medium focus:outline-none focus:ring-2 focus:ring-[#6941c6] focus:border-[#6941c6] transition-all duration-200"
            >
              <option value="All">All terms ({glossaryTerms.length})</option>
              {availableLetters.map((letter) => {
                const count = glossaryTerms.filter((term) => term.letter === letter).length
                return (
                  <option key={letter} value={letter}>
                    {letter} ({count} terms)
                  </option>
                )
              })}
            </select>
          </div>
        </div>

        {/* Terms Grid - 4 Column Layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {filteredTerms.map((item, index) => (
            <div
              key={index}
              className="bg-white rounded-lg p-6 shadow-sm border border-[#e9eaeb] hover:shadow-md transition-all duration-300"
            >
              {/* Letter Badge - Top Position */}
              <div className="mb-4">
                <span className="inline-flex items-center justify-center w-8 h-8 bg-[#6941c6] text-white text-sm font-medium rounded-full">
                  {item.letter}
                </span>
              </div>

              {/* Term Title */}
              <h3 className="text-lg font-semibold text-[#181d27] mb-3 leading-tight">{item.term}</h3>

              {/* Definition */}
              <p className="text-[#535862] leading-relaxed text-sm">{item.definition}</p>
            </div>
          ))}
        </div>

        {/* Results Count */}
        <div className="mt-8 text-center">
          <p className="text-[#535862]">
            Showing {filteredTerms.length} of {glossaryTerms.length} terms
            {selectedLetter !== "All" && ` starting with "${selectedLetter}"`}
          </p>
        </div>
      </div>
    </section>
  )
}
