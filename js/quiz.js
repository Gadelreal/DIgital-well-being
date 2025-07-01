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
  // Digital Well-being Quiz
  const wellbeingQuiz = document.getElementById("wellbeing-quiz")
  if (wellbeingQuiz) {
    wellbeingQuiz.addEventListener("submit", (e) => {
      e.preventDefault()
      handleWellbeingQuizSubmit()
    })
  }
}

function handleWellbeingQuizSubmit() {
  const form = document.getElementById("wellbeing-quiz")
  const feedback = document.getElementById("wellbeing-quiz-feedback")
  const submitBtn = form.querySelector(".quiz-submit-btn")

  // Get all checked answers
  const checkedAnswers = Array.from(form.querySelectorAll('input[type="checkbox"]:checked')).map((input) => input.value)

  // Correct answers for the digital well-being quiz
  const correctAnswers = ["a", "e"]

  // Disable all inputs and submit button
  const allInputs = form.querySelectorAll('input[type="checkbox"]')
  allInputs.forEach((input) => {
    input.disabled = true
  })
  submitBtn.disabled = true

  // Clear any existing feedback classes
  const allOptions = form.querySelectorAll(".quiz-option")
  allOptions.forEach((option) => {
    option.classList.remove("correct-answer", "incorrect-answer", "missed-answer")
  })

  // Process each option
  allOptions.forEach((option) => {
    const input = option.querySelector('input[type="checkbox"]')
    const value = input.value
    const isChecked = input.checked
    const isCorrect = correctAnswers.includes(value)

    if (isChecked && isCorrect) {
      // User selected correct answer
      option.classList.add("correct-answer")
    } else if (isChecked && !isCorrect) {
      // User selected incorrect answer
      option.classList.add("incorrect-answer")
    } else if (!isChecked && isCorrect) {
      // User missed correct answer
      option.classList.add("missed-answer")
    }
  })

  // Show feedback
  feedback.style.display = "block"
  feedback.scrollIntoView({ behavior: "smooth", block: "nearest" })

  // Add Try Again button
  if (!submitBtn.nextElementSibling || !submitBtn.nextElementSibling.classList.contains("quiz-reset-btn")) {
    const resetBtn = document.createElement("button")
    resetBtn.type = "button"
    resetBtn.className = "quiz-submit-btn quiz-reset-btn"
    resetBtn.textContent = "Try Again"
    resetBtn.style.marginLeft = "1rem"
    resetBtn.addEventListener("click", () => {
      resetWellbeingQuiz()
    })
    submitBtn.parentNode.insertBefore(resetBtn, submitBtn.nextSibling)
  }

  // Announce to screen readers
  const announcement = document.createElement("div")
  announcement.className = "sr-only"
  announcement.setAttribute("aria-live", "polite")
  announcement.textContent = "Quiz completed. Results are now displayed below."
  form.appendChild(announcement)

  setTimeout(() => {
    if (announcement.parentNode) {
      announcement.parentNode.removeChild(announcement)
    }
  }, 1000)
}

function resetWellbeingQuiz() {
  const form = document.getElementById("wellbeing-quiz")
  const feedback = document.getElementById("wellbeing-quiz-feedback")
  const submitBtn = form.querySelector(".quiz-submit-btn")
  const resetBtn = form.querySelector(".quiz-reset-btn")

  // Reset form
  form.reset()

  // Enable all inputs and submit button
  const allInputs = form.querySelectorAll('input[type="checkbox"]')
  allInputs.forEach((input) => {
    input.disabled = false
  })
  submitBtn.disabled = false

  // Remove feedback classes
  const allOptions = form.querySelectorAll(".quiz-option")
  allOptions.forEach((option) => {
    option.classList.remove("correct-answer", "incorrect-answer", "missed-answer")
  })

  // Hide feedback
  feedback.style.display = "none"

  // Remove reset button
  if (resetBtn) {
    resetBtn.remove()
  }

  // Scroll back to quiz
  form.scrollIntoView({ behavior: "smooth", block: "start" })

  // Announce to screen readers
  const announcement = document.createElement("div")
  announcement.className = "sr-only"
  announcement.setAttribute("aria-live", "polite")
  announcement.textContent = "Quiz has been reset. You can now try again."
  form.appendChild(announcement)

  setTimeout(() => {
    if (announcement.parentNode) {
      announcement.parentNode.removeChild(announcement)
    }
  }, 1000)
}
