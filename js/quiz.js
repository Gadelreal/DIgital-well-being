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
    CORRECT: "✓ Correct",
    INCORRECT: "✗ Incorrect",
    CORRECT_ANSWER: "Correct answer",
    INCORRECT_ANSWER: "Incorrect answer. The correct answer is",
    SUBMITTED: "Submitted",
    RESET: "Try Again",
  }

  // Quiz constants
  const CORRECT_ANSWERS = ["a", "e"]

  // Configuración del quiz - respuestas correctas
  const correctAnswersDigitalWellbeing = ["a", "e"]

  // Handler for the Chapter 1 Well-being Quiz
  const wellbeingQuizForm = document.getElementById("wellbeing-quiz")
  const feedbackDiv = document.getElementById("wellbeing-quiz-feedback")

  if (!wellbeingQuizForm || !feedbackDiv) {
    console.error("Quiz elements not found")
    return
  }

  if (wellbeingQuizForm) {
    wellbeingQuizForm.addEventListener("submit", (event) => {
      event.preventDefault()
      clearExistingFeedback()
      showOptionFeedback(correctAnswersDigitalWellbeing)
      showGeneralFeedback()
      disableQuizForm()
      addResetButton()
    })
  }

  function clearExistingFeedback() {
    // Remove all existing feedback elements
    const existingFeedback = wellbeingQuizForm.querySelectorAll(".option-feedback")
    existingFeedback.forEach((feedback) => feedback.remove())

    // Reset option classes
    const options = wellbeingQuizForm.querySelectorAll(".quiz-option")
    options.forEach((option) => {
      option.classList.remove("correct-answer", "incorrect-answer", "missed-answer")
    })

    // Hide general feedback
    feedbackDiv.style.display = "none"
  }

  function showOptionFeedback(correctAnswers) {
    const allOptions = wellbeingQuizForm.querySelectorAll(".quiz-option")

    allOptions.forEach((option) => {
      const input = option.querySelector("input")
      const value = input.value
      const isSelected = input.checked
      const isCorrect = correctAnswers.includes(value)

      let feedbackClass, feedbackText

      if (isSelected && isCorrect) {
        feedbackClass = "correct-answer"
        feedbackText = FEEDBACK_MESSAGES.CORRECT
      } else if (isSelected && !isCorrect) {
        feedbackClass = "incorrect-answer"
        feedbackText = FEEDBACK_MESSAGES.INCORRECT
      } else if (!isSelected && isCorrect) {
        feedbackClass = "missed-answer"
        feedbackText = FEEDBACK_MESSAGES.CORRECT_ANSWER
      }

      if (feedbackClass && feedbackText) {
        option.classList.add(feedbackClass)

        const feedbackSpan = document.createElement("span")
        feedbackSpan.className = "option-feedback"
        feedbackSpan.textContent = feedbackText
        option.appendChild(feedbackSpan)
      }
    })
  }

  function showGeneralFeedback() {
    feedbackDiv.style.display = "block"
    feedbackDiv.scrollIntoView({ behavior: "smooth", block: "nearest" })
  }

  function disableQuizForm() {
    const inputs = wellbeingQuizForm.querySelectorAll('input, button[type="submit"]')
    inputs.forEach((input) => (input.disabled = true))
  }

  function enableQuizForm() {
    const inputs = wellbeingQuizForm.querySelectorAll('input, button[type="submit"]')
    inputs.forEach((input) => (input.disabled = false))
  }

  function addResetButton() {
    // Check if reset button already exists
    if (wellbeingQuizForm.querySelector(".quiz-reset-btn")) return

    const resetButton = document.createElement("button")
    resetButton.type = "button"
    resetButton.className = "quiz-reset-btn"
    resetButton.textContent = FEEDBACK_MESSAGES.RESET
    resetButton.style.marginLeft = "10px"

    resetButton.addEventListener("click", resetQuiz)

    const submitButton = wellbeingQuizForm.querySelector(".quiz-submit-btn")
    submitButton.parentNode.insertBefore(resetButton, submitButton.nextSibling)
  }

  function resetQuiz() {
    // Clear all selections
    const checkboxes = wellbeingQuizForm.querySelectorAll('input[type="checkbox"]')
    checkboxes.forEach((checkbox) => (checkbox.checked = false))

    // Clear feedback
    clearExistingFeedback()

    // Re-enable form
    enableQuizForm()

    // Remove reset button
    const resetButton = wellbeingQuizForm.querySelector(".quiz-reset-btn")
    if (resetButton) {
      resetButton.remove()
    }

    // Scroll back to quiz
    wellbeingQuizForm.scrollIntoView({ behavior: "smooth", block: "start" })
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
