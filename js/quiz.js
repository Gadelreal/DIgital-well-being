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

  // Constants for feedback messages in English
  const FEEDBACK_MESSAGES = {
    CORRECT: "Correct",
    INCORRECT: "Incorrect",
    CORRECT_ANSWER: "Correct answer",
    INCORRECT_ANSWER: "Incorrect answer. The correct answer is",
    SUBMITTED: "Submitted",
    RESET: "Reset Activity",
  }

  // Configuración del quiz
  const correctAnswersDigitalWellbeing = ["a", "e"]

  // Initialize quiz functionality
  initializeWellbeingQuiz()

  function initializeWellbeingQuiz() {
    const form = document.getElementById("wellbeing-quiz")
    if (!form) return

    form.addEventListener("submit", (e) => {
      e.preventDefault()
      showWellbeingQuizFeedback()
    })
  }

  function showWellbeingQuizFeedback() {
    const form = document.getElementById("wellbeing-quiz")
    const feedback = document.getElementById("wellbeing-quiz-feedback")
    const submitBtn = form.querySelector(".quiz-submit-btn")

    // Get all checkboxes
    const checkboxes = form.querySelectorAll('input[type="checkbox"]')
    const selectedValues = []

    checkboxes.forEach((checkbox) => {
      if (checkbox.checked) {
        selectedValues.push(checkbox.value)
      }
    })

    // Clear any existing feedback first
    checkboxes.forEach((checkbox) => {
      const option = checkbox.closest(".quiz-option")
      const existingFeedback = option.querySelector(".option-feedback")
      if (existingFeedback) {
        existingFeedback.remove()
      }
      // Remove existing classes
      option.classList.remove("correct-answer", "incorrect-answer", "missed-answer")
    })

    // Show feedback for each option
    checkboxes.forEach((checkbox) => {
      const option = checkbox.closest(".quiz-option")
      const value = checkbox.value
      const isCorrect = correctAnswersDigitalWellbeing.includes(value)
      const isSelected = checkbox.checked

      // Create feedback span
      const feedbackSpan = document.createElement("span")
      feedbackSpan.className = "option-feedback"

      if (isSelected && isCorrect) {
        // Selected and correct
        option.classList.add("correct-answer")
        feedbackSpan.innerHTML = '<i class="fas fa-check" aria-hidden="true"></i> (Correct)'
      } else if (isSelected && !isCorrect) {
        // Selected but incorrect
        option.classList.add("incorrect-answer")
        feedbackSpan.innerHTML = '<i class="fas fa-times" aria-hidden="true"></i> (Incorrect)'
      } else if (!isSelected && isCorrect) {
        // Not selected but correct
        option.classList.add("missed-answer")
        feedbackSpan.innerHTML = '<i class="fas fa-exclamation-triangle" aria-hidden="true"></i> (Correct)'
      }

      // Add feedback span to option if there's feedback to show
      if (feedbackSpan.innerHTML) {
        option.appendChild(feedbackSpan)
      }
    })

    // Disable form elements
    checkboxes.forEach((checkbox) => {
      checkbox.disabled = true
    })
    submitBtn.disabled = true

    // Show main feedback
    feedback.style.display = "block"

    // Add reset button
    addResetButton()

    // Scroll to feedback
    feedback.scrollIntoView({ behavior: "smooth", block: "nearest" })
  }

  function addResetButton() {
    const form = document.getElementById("wellbeing-quiz")
    const submitBtn = form.querySelector(".quiz-submit-btn")

    // Check if reset button already exists
    if (form.querySelector(".quiz-reset-btn")) {
      return
    }

    const resetBtn = document.createElement("button")
    resetBtn.type = "button"
    resetBtn.className = "quiz-reset-btn"
    resetBtn.innerHTML = '<i class="fas fa-redo" aria-hidden="true"></i> Reset Activity'

    // Style the reset button
    resetBtn.style.cssText = `
        background-color: #6c757d;
        color: white;
        border: none;
        border-radius: 4px;
        padding: 0.75rem 1.5rem;
        font-size: 1rem;
        font-weight: 600;
        cursor: pointer;
        transition: background-color 0.3s, opacity 0.3s;
        margin-left: 1rem;
        display: inline-flex;
        align-items: center;
        gap: 0.5rem;
    `

    resetBtn.addEventListener("click", resetWellbeingQuiz)
    resetBtn.addEventListener("mouseover", function () {
      this.style.backgroundColor = "#5a6268"
    })
    resetBtn.addEventListener("mouseout", function () {
      this.style.backgroundColor = "#6c757d"
    })

    // Insert after submit button
    submitBtn.parentNode.insertBefore(resetBtn, submitBtn.nextSibling)
  }

  function resetWellbeingQuiz() {
    const form = document.getElementById("wellbeing-quiz")
    const feedback = document.getElementById("wellbeing-quiz-feedback")
    const submitBtn = form.querySelector(".quiz-submit-btn")
    const resetBtn = form.querySelector(".quiz-reset-btn")

    // Reset form
    form.reset()

    // Re-enable form elements
    const checkboxes = form.querySelectorAll('input[type="checkbox"]')
    checkboxes.forEach((checkbox) => {
      checkbox.disabled = false
    })
    submitBtn.disabled = false

    // Remove visual feedback from options
    checkboxes.forEach((checkbox) => {
      const option = checkbox.closest(".quiz-option")
      const existingFeedback = option.querySelector(".option-feedback")
      if (existingFeedback) {
        existingFeedback.remove()
      }
      option.classList.remove("correct-answer", "incorrect-answer", "missed-answer")
    })

    // Hide main feedback
    feedback.style.display = "none"

    // Remove reset button
    if (resetBtn) {
      resetBtn.remove()
    }

    // Scroll back to form
    form.scrollIntoView({ behavior: "smooth", block: "nearest" })
  }

  // Funcionalidad para otros quizzes (si existen)
  const quizQuestions = document.querySelectorAll(".quiz-question")

  if (quizQuestions.length > 0) {
    // Configuración para otros tipos de quiz
    const correctAnswersGeneral = {
      1: "C",
      2: "C",
      3: "C",
      4: "B",
      5: "B",
      6: "B",
      7: "B",
      8: "B",
      9: "C",
      10: "B",
    }

    const userAnswersGeneral = {}

    quizQuestions.forEach((question, index) => {
      const questionNumber = index + 1
      const options = question.querySelectorAll(".quiz-options li")

      options.forEach((option, optionIndex) => {
        const optionLetter = String.fromCharCode(65 + optionIndex)
        option.setAttribute("role", "button")
        option.setAttribute("tabindex", "0")
        option.setAttribute("aria-label", `Option ${optionLetter}: ${option.textContent}`)
        option.setAttribute("data-question", questionNumber)
        option.setAttribute("data-answer", optionLetter)

        option.addEventListener("click", () =>
          handleAnswerSelection(questionNumber, optionLetter, option, correctAnswersGeneral, userAnswersGeneral),
        )
        option.addEventListener("keydown", (e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault()
            handleAnswerSelection(questionNumber, optionLetter, option, correctAnswersGeneral, userAnswersGeneral)
          }
        })
      })
    })
  }

  function handleAnswerSelection(questionNumber, selectedAnswer, selectedElement, correctAnswers, userAnswers) {
    if (userAnswers[questionNumber]) return

    userAnswers[questionNumber] = selectedAnswer
    const questionElement = selectedElement.closest(".quiz-question")
    const allOptions = questionElement.querySelectorAll(".quiz-options li")

    allOptions.forEach((option) => {
      option.style.pointerEvents = "none"
      option.setAttribute("aria-disabled", "true")
    })

    const isCorrect = selectedAnswer === correctAnswers[questionNumber]
    const feedbackElement = document.createElement("div")
    feedbackElement.className = `quiz-feedback ${isCorrect ? "correct" : "incorrect"}`
    feedbackElement.style.cssText = `
      margin-top: 0.5rem; padding: 0.5rem; border-radius: 4px; font-weight: 500;
      background-color: ${isCorrect ? "#d4edda" : "#f8d7da"};
      border: 1px solid ${isCorrect ? "#c3e6cb" : "#f5c6cb"};
      color: ${isCorrect ? "#155724" : "#721c24"};
    `

    if (isCorrect) {
      selectedElement.style.backgroundColor = "#d4edda"
      selectedElement.style.borderColor = "#c3e6cb"
      selectedElement.style.color = "#155724"
      selectedElement.innerHTML +=
        ' <i class="fas fa-check" style="color: #28a745; margin-left: 0.5rem;" aria-hidden="true"></i>'
      feedbackElement.innerHTML = '<i class="fas fa-check-circle" aria-hidden="true"></i> Correct! Excellent work.'
    } else {
      selectedElement.style.backgroundColor = "#f8d7da"
      selectedElement.style.borderColor = "#f5c6cb"
      selectedElement.style.color = "#721c24"
      selectedElement.innerHTML +=
        ' <i class="fas fa-times" style="color: #dc3545; margin-left: 0.5rem;" aria-hidden="true"></i>'

      const correctOption = Array.from(allOptions).find(
        (option) => option.getAttribute("data-answer") === correctAnswers[questionNumber],
      )
      if (correctOption) {
        correctOption.style.backgroundColor = "#d1ecf1"
        correctOption.style.borderColor = "#bee5eb"
        correctOption.style.color = "#0c5460"
        correctOption.innerHTML +=
          ' <i class="fas fa-check" style="color: #17a2b8; margin-left: 0.5rem;" aria-hidden="true"></i>'
      }
      feedbackElement.innerHTML = `<i class="fas fa-times-circle" aria-hidden="true"></i> Incorrect. The correct answer is: ${correctAnswers[questionNumber]}`
    }
    questionElement.appendChild(feedbackElement)
  }
})
</merged_code>
