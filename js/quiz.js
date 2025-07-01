document.addEventListener("DOMContentLoaded", () => {
  // Mejorar el efecto hover en las opciones
  const quizOptions = document.querySelectorAll(".quiz-options li, .quiz-option")
  quizOptions.forEach((option) => {
    option.addEventListener("mouseenter", () => {
      if (!option.style.pointerEvents || option.style.pointerEvents !== "none") {
        option.style.transform = "translateY(-2px)"
        option.style.boxShadow = "0 4px 8px rgba(0, 0, 0, 0.1)"
        option.style.transition = "all 0.2s ease"
      }
    })

    option.addEventListener("mouseleave", () => {
      option.style.transform = "translateY(0)"
      option.style.boxShadow = "none"
    })
  })

  // Initialize all quizzes on the page
  initializeQuizzes()
})

function initializeQuizzes() {
  // Get all quiz forms
  const quizForms = document.querySelectorAll('form[id$="-quiz"]')

  quizForms.forEach((form) => {
    form.addEventListener("submit", handleQuizSubmit)
  })
}

function handleQuizSubmit(event) {
  event.preventDefault()

  const form = event.target
  const formId = form.id
  const feedbackId = formId + "-feedback"
  const feedbackElement = document.getElementById(feedbackId)

  if (!feedbackElement) {
    console.error("Feedback element not found for quiz:", formId)
    return
  }

  // Handle different quiz types
  if (formId === "wellbeing-quiz") {
    handleWellbeingQuiz(form, feedbackElement)
  }
  // Add more quiz handlers here as needed
}

function handleWellbeingQuiz(form, feedbackElement) {
  const correctAnswers = ["a", "e"] // Correct answers for the wellbeing quiz
  const formData = new FormData(form)
  const selectedAnswers = formData.getAll("q1")

  // Clear previous feedback styling
  const options = form.querySelectorAll(".quiz-option")
  options.forEach((option) => {
    option.classList.remove("correct-answer", "incorrect-answer", "missed-answer")
    // Remove any existing feedback elements
    const existingFeedback = option.querySelector(".option-feedback")
    if (existingFeedback) {
      existingFeedback.remove()
    }
  })

  // Check answers and provide visual feedback
  options.forEach((option) => {
    const input = option.querySelector("input")
    const value = input.value
    const isSelected = selectedAnswers.includes(value)
    const isCorrect = correctAnswers.includes(value)

    if (isSelected && isCorrect) {
      // User selected a correct answer
      option.classList.add("correct-answer")
      addOptionFeedback(option, "✓", "correct")
    } else if (isSelected && !isCorrect) {
      // User selected an incorrect answer
      option.classList.add("incorrect-answer")
      addOptionFeedback(option, "✗", "incorrect")
    } else if (!isSelected && isCorrect) {
      // User missed a correct answer
      option.classList.add("missed-answer")
      addOptionFeedback(option, "(Correct)", "missed")
    }
  })

  // Show the feedback section
  feedbackElement.style.display = "block"
  feedbackElement.scrollIntoView({ behavior: "smooth", block: "nearest" })

  // Disable the submit button to prevent resubmission
  const submitButton = form.querySelector(".quiz-submit-btn")
  if (submitButton) {
    submitButton.disabled = true
    submitButton.textContent = "Submitted"
  }

  // Announce to screen readers
  const announcement = document.createElement("div")
  announcement.setAttribute("aria-live", "polite")
  announcement.setAttribute("aria-atomic", "true")
  announcement.className = "sr-only"
  announcement.textContent = "Quiz submitted. Feedback is now available below the quiz."
  form.appendChild(announcement)

  // Remove the announcement after a short delay
  setTimeout(() => {
    if (announcement.parentNode) {
      announcement.parentNode.removeChild(announcement)
    }
  }, 3000)
}

function addOptionFeedback(option, text, type) {
  const feedback = document.createElement("span")
  feedback.className = "option-feedback"
  feedback.textContent = text

  // Add appropriate styling based on type
  if (type === "correct") {
    feedback.style.color = "#155724"
  } else if (type === "incorrect") {
    feedback.style.color = "#721c24"
  } else if (type === "missed") {
    feedback.style.color = "#856404"
  }

  option.appendChild(feedback)
}

// Export functions for potential use in other scripts
if (typeof module !== "undefined" && module.exports) {
  module.exports = {
    initializeQuizzes,
    handleQuizSubmit,
    handleWellbeingQuiz,
  }
}
