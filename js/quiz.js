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

  // Initialize the wellbeing quiz
  initializeWellbeingQuiz()
})

function initializeWellbeingQuiz() {
  const form = document.getElementById("wellbeing-quiz")
  const feedbackDiv = document.getElementById("wellbeing-quiz-feedback")

  if (!form || !feedbackDiv) {
    console.error("Quiz elements not found")
    return
  }

  // Correct answers for the wellbeing quiz
  const correctAnswers = ["a", "e"]

  form.addEventListener("submit", (e) => {
    e.preventDefault()

    // Get all checked values
    const checkedInputs = form.querySelectorAll('input[type="checkbox"]:checked')
    const selectedAnswers = Array.from(checkedInputs).map((input) => input.value)

    // Clear any existing feedback classes and content
    const options = form.querySelectorAll(".quiz-option")
    options.forEach((option) => {
      option.classList.remove("correct-answer", "incorrect-answer", "missed-answer")
      const existingFeedback = option.querySelector(".option-feedback")
      if (existingFeedback) {
        existingFeedback.remove()
      }
    })

    // Process each option
    options.forEach((option) => {
      const input = option.querySelector('input[type="checkbox"]')
      const value = input.value
      const isSelected = selectedAnswers.includes(value)
      const isCorrect = correctAnswers.includes(value)

      let feedbackText = ""
      let feedbackClass = ""

      if (isSelected && isCorrect) {
        // Correct selection
        option.classList.add("correct-answer")
        feedbackText = "✓"
        feedbackClass = "correct-answer"
      } else if (isSelected && !isCorrect) {
        // Incorrect selection
        option.classList.add("incorrect-answer")
        feedbackText = "✗"
        feedbackClass = "incorrect-answer"
      } else if (!isSelected && isCorrect) {
        // Missed correct answer
        option.classList.add("missed-answer")
        feedbackText = "(Correct)"
        feedbackClass = "missed-answer"
      }

      // Add visual feedback to the option
      if (feedbackText) {
        const feedbackSpan = document.createElement("span")
        feedbackSpan.className = `option-feedback ${feedbackClass}`
        feedbackSpan.textContent = feedbackText
        option.appendChild(feedbackSpan)
      }

      // Disable the input
      input.disabled = true
    })

    // Show general feedback
    feedbackDiv.style.display = "block"
    feedbackDiv.scrollIntoView({ behavior: "smooth", block: "nearest" })

    // Disable and update submit button
    const submitButton = form.querySelector(".quiz-submit-btn")
    if (submitButton) {
      submitButton.disabled = true
      submitButton.textContent = "Submitted"
    }

    // Add Try Again button if it doesn't exist
    if (!form.querySelector(".quiz-reset-btn")) {
      const resetBtn = document.createElement("button")
      resetBtn.type = "button"
      resetBtn.className = "quiz-submit-btn quiz-reset-btn"
      resetBtn.textContent = "Try Again"
      resetBtn.style.marginLeft = "1rem"

      resetBtn.addEventListener("click", () => {
        // Reset form
        form.reset()

        // Clear feedback classes and content
        options.forEach((option) => {
          option.classList.remove("correct-answer", "incorrect-answer", "missed-answer")
          const existingFeedback = option.querySelector(".option-feedback")
          if (existingFeedback) {
            existingFeedback.remove()
          }
          // Re-enable inputs
          const input = option.querySelector('input[type="checkbox"]')
          if (input) {
            input.disabled = false
          }
        })

        // Re-enable and reset submit button
        if (submitButton) {
          submitButton.disabled = false
          submitButton.textContent = "Submit"
        }

        // Hide feedback
        feedbackDiv.style.display = "none"

        // Remove reset button
        resetBtn.remove()

        // Scroll back to quiz
        form.scrollIntoView({ behavior: "smooth", block: "start" })
      })

      submitButton.parentNode.appendChild(resetBtn)
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
  })
}
