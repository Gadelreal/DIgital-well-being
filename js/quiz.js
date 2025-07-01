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

  // Feedback messages
  const FEEDBACK_MESSAGES = {
    correct: {
      a: "Correct! Digital well-being is indeed about daily practices and habits.",
      e: "Correct! How we feel about our online time is a key aspect of digital well-being.",
    },
    incorrect: {
      b: "Incorrect. Digital well-being isn't about completely avoiding social media.",
      c: "Incorrect. Technology isn't the enemy - it's about how we use it.",
      d: "Incorrect. Guilt isn't helpful - awareness and intention are.",
      f: "Incorrect. Digital well-being is an ongoing practice, not a destination.",
    },
    missed: {
      a: "You missed this one. Digital well-being is about cultivating daily practices.",
      e: "You missed this one. Our feelings about online time are central to digital well-being.",
    },
  }

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

    // Disable all inputs
    const allInputs = form.querySelectorAll('input[type="checkbox"]')
    allInputs.forEach((input) => {
      input.disabled = true
    })

    // Disable submit button
    const submitBtn = form.querySelector(".quiz-submit-btn")
    if (submitBtn) {
      submitBtn.disabled = true
    }

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
        feedbackText = FEEDBACK_MESSAGES.correct[value] || "Correct!"
        feedbackClass = "correct-answer"
      } else if (isSelected && !isCorrect) {
        // Incorrect selection
        option.classList.add("incorrect-answer")
        feedbackText = FEEDBACK_MESSAGES.incorrect[value] || "Incorrect."
        feedbackClass = "incorrect-answer"
      } else if (!isSelected && isCorrect) {
        // Missed correct answer
        option.classList.add("missed-answer")
        feedbackText = FEEDBACK_MESSAGES.missed[value] || "You missed this correct answer."
        feedbackClass = "missed-answer"
      }

      // Add visual feedback to the option
      if (feedbackText) {
        const feedbackSpan = document.createElement("span")
        feedbackSpan.className = `option-feedback ${feedbackClass}`
        feedbackSpan.textContent = feedbackText
        option.appendChild(feedbackSpan)
      }
    })

    // Show general feedback
    feedbackDiv.style.display = "block"
    feedbackDiv.scrollIntoView({ behavior: "smooth", block: "nearest" })

    // Add Try Again button
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
        })

        // Re-enable inputs
        allInputs.forEach((input) => {
          input.disabled = false
        })

        // Re-enable submit button
        if (submitBtn) {
          submitBtn.disabled = false
        }

        // Hide feedback
        feedbackDiv.style.display = "none"

        // Remove reset button
        resetBtn.remove()
      })

      submitBtn.parentNode.appendChild(resetBtn)
    }
  })
}
