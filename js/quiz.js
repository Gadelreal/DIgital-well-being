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
  const correctAnswersChapter1 = {
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

  const correctAnswersDigitalWellbeing = ["a", "e"]

  let userAnswersChapter1 = {}
  let quizCompletedChapter1 = false

  // Function to save quiz state to localStorage:
  function saveQuizState(quizId, state) {
    try {
      localStorage.setItem(`quiz_${quizId}`, JSON.stringify(state))
    } catch (e) {
      console.warn("Could not save quiz state to localStorage:", e)
    }
  }

  // Function to load quiz state from localStorage:
  function loadQuizState(quizId) {
    try {
      const saved = localStorage.getItem(`quiz_${quizId}`)
      return saved ? JSON.parse(saved) : null
    } catch (e) {
      console.warn("Could not load quiz state from localStorage:", e)
      return null
    }
  }

  // Function to restore the quiz visual state:
  function restoreQuizVisualState(savedState) {
    const wellbeingQuizForm = document.getElementById("wellbeing-quiz")
    if (!wellbeingQuizForm || !savedState) return

    const checkboxes = wellbeingQuizForm.querySelectorAll('input[type="checkbox"]')

    checkboxes.forEach((checkbox) => {
      const optionContainer = checkbox.closest(".quiz-option")
      const optionValue = checkbox.value
      const isCorrect = correctAnswersDigitalWellbeing.includes(optionValue)
      const wasChecked = savedState.userAnswers && savedState.userAnswers[optionValue]

      if (wasChecked) {
        checkbox.checked = true
      }

      // Remove any existing feedback classes
      optionContainer.classList.remove("correct-answer", "incorrect-answer", "missed-answer")

      if (savedState.completed) {
        if (wasChecked && isCorrect) {
          optionContainer.classList.add("correct-answer")
        } else if (wasChecked && !isCorrect) {
          optionContainer.classList.add("incorrect-answer")
        } else if (!wasChecked && isCorrect) {
          optionContainer.classList.add("missed-answer")
        }
      }
    })

    // Show feedback and disable submit button if quiz was completed
    const feedbackElement = document.getElementById("wellbeing-quiz-feedback")
    const submitButton = wellbeingQuizForm.querySelector(".quiz-submit-btn")

    if (feedbackElement) {
      feedbackElement.style.display = "block"
    }

    if (submitButton) {
      submitButton.disabled = true
      submitButton.textContent = "Submitted"
    }
  }

  // Handler for the Chapter 1 Well-being Quiz
  const wellbeingQuizForm = document.getElementById("wellbeing-quiz")
  if (wellbeingQuizForm) {
    const feedbackElement = document.getElementById("wellbeing-quiz-feedback")
    const submitButton = wellbeingQuizForm.querySelector(".quiz-submit-btn")

    wellbeingQuizForm.addEventListener("submit", (event) => {
      event.preventDefault()

      const form = event.target
      const submitBtn = form.querySelector(".quiz-submit-btn")
      const feedbackDiv = document.getElementById("wellbeing-quiz-feedback")

      // Get all checkboxes
      const checkboxes = form.querySelectorAll('input[type="checkbox"]')
      const correctAnswers = ["a", "e"] // Correct answers

      // Check answers and provide visual feedback
      checkboxes.forEach((checkbox) => {
        const option = checkbox.closest(".quiz-option")
        const value = checkbox.value
        const isChecked = checkbox.checked
        const isCorrect = correctAnswers.includes(value)

        // Remove previous feedback classes
        option.classList.remove("correct-answer", "incorrect-answer", "missed-answer")

        if (isChecked && isCorrect) {
          // Correct answer selected
          option.classList.add("correct-answer")
          announceToScreenReader(`${FEEDBACK_MESSAGES.CORRECT_ANSWER}: ${checkbox.nextElementSibling.textContent}`)
        } else if (isChecked && !isCorrect) {
          // Incorrect answer selected
          option.classList.add("incorrect-answer")
          announceToScreenReader(`${FEEDBACK_MESSAGES.INCORRECT_ANSWER}: ${checkbox.nextElementSibling.textContent}`)
        } else if (!isChecked && isCorrect) {
          // Correct answer not selected
          option.classList.add("missed-answer")
        }
      })

      // Show feedback section
      if (feedbackDiv) {
        feedbackDiv.style.display = "block"
        feedbackDiv.scrollIntoView({ behavior: "smooth", block: "nearest" })
      }

      // Update submit button
      submitBtn.textContent = FEEDBACK_MESSAGES.SUBMITTED
      submitBtn.disabled = true

      // Add reset button
      addResetButton(form)

      // Save completion state
      saveQuizCompletion()

      // Announce completion to screen readers
      announceToScreenReader("Quiz completed. Review your answers and feedback above.")
    })

    // Load and restore previous quiz state on page load
    const savedState = loadQuizState("wellbeing")
    if (savedState) {
      userAnswersChapter1 = savedState.userAnswers || {}
      quizCompletedChapter1 = savedState.completed || false
      restoreQuizVisualState(savedState)
    }
  }

  // Function to reset the wellbeing quiz
  function resetWellbeingQuiz(form) {
    // Clear all checkboxes
    const checkboxes = form.querySelectorAll('input[type="checkbox"]')
    checkboxes.forEach((checkbox) => {
      checkbox.checked = false
      const option = checkbox.closest(".quiz-option")
      option.classList.remove("correct-answer", "incorrect-answer", "missed-answer")
    })

    // Hide feedback
    const feedbackDiv = document.getElementById("wellbeing-quiz-feedback")
    if (feedbackDiv) {
      feedbackDiv.style.display = "none"
    }

    // Reset submit button
    const submitBtn = form.querySelector(".quiz-submit-btn:not(.quiz-reset-btn)")
    if (submitBtn) {
      submitBtn.textContent = "Submit"
      submitBtn.disabled = false
      submitBtn.style.backgroundColor = ""
      submitBtn.style.cursor = ""
    }

    // Remove reset button
    const resetBtn = form.querySelector(".quiz-reset-btn")
    if (resetBtn) {
      resetBtn.remove()
    }

    // Clear saved state
    clearQuizState("wellbeing")

    // Remove all visual feedback from options
    const quizOptions = form.querySelectorAll(".quiz-option")
    quizOptions.forEach((option) => {
      option.classList.remove("correct", "incorrect", "missed")
      const feedback = option.querySelector(".option-feedback")
      if (feedback) {
        feedback.remove()
      }
    })

    // Scroll back to quiz
    form.scrollIntoView({ behavior: "smooth", block: "start" })

    // Announce reset to screen readers
    announceToScreenReader("Quiz has been reset. You can now select your answers again.")
  }

  function saveQuizCompletion() {
    localStorage.setItem("wellbeing-quiz-completed", "true")
  }

  function clearQuizState(quizId) {
    localStorage.removeItem(`quiz_${quizId}`)
  }

  function announceToScreenReader(message) {
    // Create a temporary element for screen reader announcements
    const announcement = document.createElement("div")
    announcement.setAttribute("aria-live", "polite")
    announcement.setAttribute("aria-atomic", "true")
    announcement.className = "sr-only"
    announcement.textContent = message

    document.body.appendChild(announcement)

    // Remove after announcement
    setTimeout(() => {
      document.body.removeChild(announcement)
    }, 1000)
  }

  function addResetButton(quizId) {
    const form = document.getElementById(quizId)
    if (!form) return

    // Check if reset button already exists
    if (form.querySelector(".quiz-reset-btn")) return

    const resetBtn = document.createElement("button")
    resetBtn.type = "button"
    resetBtn.className = "quiz-reset-btn"
    resetBtn.innerHTML = '<i class="fas fa-redo" aria-hidden="true"></i> Reset Activity'
    resetBtn.style.cssText = `
      background-color: #6c757d;
      color: white;
      border: 2px solid #6c757d;
      padding: 12px 24px;
      font-size: 16px;
      font-weight: bold;
      border-radius: 5px;
      cursor: pointer;
      margin-left: 10px;
      transition: all 0.3s ease;
      display: inline-flex;
      align-items: center;
      gap: 8px;
    `

    resetBtn.addEventListener("mouseenter", () => {
      resetBtn.style.backgroundColor = "#5a6268"
      resetBtn.style.borderColor = "#5a6268"
    })

    resetBtn.addEventListener("mouseleave", () => {
      resetBtn.style.backgroundColor = "#6c757d"
      resetBtn.style.borderColor = "#6c757d"
    })

    resetBtn.addEventListener("click", () => {
      if (quizId === "wellbeing-quiz") {
        resetWellbeingQuiz(form)
      } else if (quizId === "metacognition-quiz") {
        resetMetacognitionQuiz(form)
      } else if (quizId === "reflection-quiz") {
        resetReflectionQuiz(form)
      } else if (quizId === "digital-habits-quiz") {
        resetDigitalHabitsQuiz(form)
      } else if (quizId === "values-quiz") {
        resetValuesQuiz(form)
      } else if (quizId === "goals-quiz") {
        resetGoalsQuiz(form)
      } else if (quizId === "practice-quiz") {
        resetPracticeQuiz(form)
      }
    })

    // Insert after submit button
    const submitBtn = form.querySelector('button[type="submit"]')
    if (submitBtn && submitBtn.parentNode) {
      submitBtn.parentNode.insertBefore(resetBtn, submitBtn.nextSibling)
    }
  }

  // Metacognition Quiz Functions
  function initializeMetacognitionQuiz() {
    const form = document.getElementById("metacognition-quiz")
    if (!form) return

    form.addEventListener("submit", (event) => {
      event.preventDefault()
      showMetacognitionQuizFeedback()
    })
  }

  function showMetacognitionQuizFeedback() {
    const form = document.getElementById("metacognition-quiz")
    const feedback = document.getElementById("metacognition-quiz-feedback")

    if (!form || !feedback) return

    feedback.style.display = "block"
    feedback.scrollIntoView({ behavior: "smooth", block: "nearest" })

    addResetButton("metacognition-quiz")

    const submitBtn = form.querySelector('button[type="submit"]')
    if (submitBtn) {
      submitBtn.disabled = true
      submitBtn.textContent = "Submitted"
      submitBtn.style.backgroundColor = "#6c757d"
      submitBtn.style.cursor = "not-allowed"
    }
  }

  function resetMetacognitionQuiz(form) {
    if (!form) return

    form.reset()

    const feedback = document.getElementById("metacognition-quiz-feedback")
    if (feedback) {
      feedback.style.display = "none"
    }

    const submitBtn = form.querySelector(".quiz-submit-btn:not(.quiz-reset-btn)")
    if (submitBtn) {
      submitBtn.disabled = false
      submitBtn.textContent = "Submit"
      submitBtn.style.backgroundColor = ""
      submitBtn.style.cursor = ""
    }

    const resetBtn = form.querySelector(".quiz-reset-btn")
    if (resetBtn) {
      resetBtn.remove()
    }

    form.scrollIntoView({ behavior: "smooth", block: "start" })
  }

  // Reflection Quiz Functions
  function initializeReflectionQuiz() {
    const form = document.getElementById("reflection-quiz")
    if (!form) return

    form.addEventListener("submit", (event) => {
      event.preventDefault()
      showReflectionQuizFeedback()
    })
  }

  function showReflectionQuizFeedback() {
    const form = document.getElementById("reflection-quiz")
    const feedback = document.getElementById("reflection-quiz-feedback")

    if (!form || !feedback) return

    feedback.style.display = "block"
    feedback.scrollIntoView({ behavior: "smooth", block: "nearest" })

    addResetButton("reflection-quiz")

    const submitBtn = form.querySelector('button[type="submit"]')
    if (submitBtn) {
      submitBtn.disabled = true
      submitBtn.textContent = "Submitted"
      submitBtn.style.backgroundColor = "#6c757d"
      submitBtn.style.cursor = "not-allowed"
    }
  }

  function resetReflectionQuiz(form) {
    if (!form) return

    form.reset()

    const feedback = document.getElementById("reflection-quiz-feedback")
    if (feedback) {
      feedback.style.display = "none"
    }

    const submitBtn = form.querySelector(".quiz-submit-btn:not(.quiz-reset-btn)")
    if (submitBtn) {
      submitBtn.disabled = false
      submitBtn.textContent = "Submit"
      submitBtn.style.backgroundColor = ""
      submitBtn.style.cursor = ""
    }

    const resetBtn = form.querySelector(".quiz-reset-btn")
    if (resetBtn) {
      resetBtn.remove()
    }

    form.scrollIntoView({ behavior: "smooth", block: "start" })
  }

  // Digital Habits Quiz Functions
  function initializeDigitalHabitsQuiz() {
    const form = document.getElementById("digital-habits-quiz")
    if (!form) return

    form.addEventListener("submit", (event) => {
      event.preventDefault()
      showDigitalHabitsQuizFeedback()
    })
  }

  function showDigitalHabitsQuizFeedback() {
    const form = document.getElementById("digital-habits-quiz")
    const feedback = document.getElementById("digital-habits-quiz-feedback")

    if (!form || !feedback) return

    feedback.style.display = "block"
    feedback.scrollIntoView({ behavior: "smooth", block: "nearest" })

    addResetButton("digital-habits-quiz")

    const submitBtn = form.querySelector('button[type="submit"]')
    if (submitBtn) {
      submitBtn.disabled = true
      submitBtn.textContent = "Submitted"
      submitBtn.style.backgroundColor = "#6c757d"
      submitBtn.style.cursor = "not-allowed"
    }
  }

  function resetDigitalHabitsQuiz(form) {
    if (!form) return

    form.reset()

    const feedback = document.getElementById("digital-habits-quiz-feedback")
    if (feedback) {
      feedback.style.display = "none"
    }

    const submitBtn = form.querySelector(".quiz-submit-btn:not(.quiz-reset-btn)")
    if (submitBtn) {
      submitBtn.disabled = false
      submitBtn.textContent = "Submit"
      submitBtn.style.backgroundColor = ""
      submitBtn.style.cursor = ""
    }

    const resetBtn = form.querySelector(".quiz-reset-btn")
    if (resetBtn) {
      resetBtn.remove()
    }

    form.scrollIntoView({ behavior: "smooth", block: "start" })
  }

  // Values Quiz Functions
  function initializeValuesQuiz() {
    const form = document.getElementById("values-quiz")
    if (!form) return

    form.addEventListener("submit", (event) => {
      event.preventDefault()
      showValuesQuizFeedback()
    })
  }

  function showValuesQuizFeedback() {
    const form = document.getElementById("values-quiz")
    const feedback = document.getElementById("values-quiz-feedback")

    if (!form || !feedback) return

    feedback.style.display = "block"
    feedback.scrollIntoView({ behavior: "smooth", block: "nearest" })

    addResetButton("values-quiz")

    const submitBtn = form.querySelector('button[type="submit"]')
    if (submitBtn) {
      submitBtn.disabled = true
      submitBtn.textContent = "Submitted"
      submitBtn.style.backgroundColor = "#6c757d"
      submitBtn.style.cursor = "not-allowed"
    }
  }

  function resetValuesQuiz(form) {
    if (!form) return

    form.reset()

    const feedback = document.getElementById("values-quiz-feedback")
    if (feedback) {
      feedback.style.display = "none"
    }

    const submitBtn = form.querySelector(".quiz-submit-btn:not(.quiz-reset-btn)")
    if (submitBtn) {
      submitBtn.disabled = false
      submitBtn.textContent = "Submit"
      submitBtn.style.backgroundColor = ""
      submitBtn.style.cursor = ""
    }

    const resetBtn = form.querySelector(".quiz-reset-btn")
    if (resetBtn) {
      resetBtn.remove()
    }

    form.scrollIntoView({ behavior: "smooth", block: "start" })
  }

  // Goals Quiz Functions
  function initializeGoalsQuiz() {
    const form = document.getElementById("goals-quiz")
    if (!form) return

    form.addEventListener("submit", (event) => {
      event.preventDefault()
      showGoalsQuizFeedback()
    })
  }

  function showGoalsQuizFeedback() {
    const form = document.getElementById("goals-quiz")
    const feedback = document.getElementById("goals-quiz-feedback")

    if (!form || !feedback) return

    feedback.style.display = "block"
    feedback.scrollIntoView({ behavior: "smooth", block: "nearest" })

    addResetButton("goals-quiz")

    const submitBtn = form.querySelector('button[type="submit"]')
    if (submitBtn) {
      submitBtn.disabled = true
      submitBtn.textContent = "Submitted"
      submitBtn.style.backgroundColor = "#6c757d"
      submitBtn.style.cursor = "not-allowed"
    }
  }

  function resetGoalsQuiz(form) {
    if (!form) return

    form.reset()

    const feedback = document.getElementById("goals-quiz-feedback")
    if (feedback) {
      feedback.style.display = "none"
    }

    const submitBtn = form.querySelector(".quiz-submit-btn:not(.quiz-reset-btn)")
    if (submitBtn) {
      submitBtn.disabled = false
      submitBtn.textContent = "Submit"
      submitBtn.style.backgroundColor = ""
      submitBtn.style.cursor = ""
    }

    const resetBtn = form.querySelector(".quiz-reset-btn")
    if (resetBtn) {
      resetBtn.remove()
    }

    form.scrollIntoView({ behavior: "smooth", block: "start" })
  }

  // Practice Quiz Functions
  function initializePracticeQuiz() {
    const form = document.getElementById("practice-quiz")
    if (!form) return

    form.addEventListener("submit", (event) => {
      event.preventDefault()
      showPracticeQuizFeedback()
    })
  }

  function showPracticeQuizFeedback() {
    const form = document.getElementById("practice-quiz")
    const feedback = document.getElementById("practice-quiz-feedback")

    if (!form || !feedback) return

    feedback.style.display = "block"
    feedback.scrollIntoView({ behavior: "smooth", block: "nearest" })

    addResetButton("practice-quiz")

    const submitBtn = form.querySelector('button[type="submit"]')
    if (submitBtn) {
      submitBtn.disabled = true
      submitBtn.textContent = "Submitted"
      submitBtn.style.backgroundColor = "#6c757d"
      submitBtn.style.cursor = "not-allowed"
    }
  }

  function resetPracticeQuiz(form) {
    if (!form) return

    form.reset()

    const feedback = document.getElementById("practice-quiz-feedback")
    if (feedback) {
      feedback.style.display = "none"
    }

    const submitBtn = form.querySelector(".quiz-submit-btn:not(.quiz-reset-btn)")
    if (submitBtn) {
      submitBtn.disabled = false
      submitBtn.textContent = "Submit"
      submitBtn.style.backgroundColor = ""
      submitBtn.style.cursor = ""
    }

    const resetBtn = form.querySelector(".quiz-reset-btn")
    if (resetBtn) {
      resetBtn.remove()
    }

    form.scrollIntoView({ behavior: "smooth", block: "start" })
  }

  // Initialize all quiz functionality
  const initializeWellbeingQuiz = () => {
    const form = document.getElementById("wellbeing-quiz")
    if (!form) return

    form.addEventListener("submit", (event) => {
      event.preventDefault()
      const submitBtn = form.querySelector(".quiz-submit-btn")
      const feedbackDiv = document.getElementById("wellbeing-quiz-feedback")

      const checkboxes = form.querySelectorAll('input[type="checkbox"]')
      const correctAnswers = ["a", "e"]

      checkboxes.forEach((checkbox) => {
        const option = checkbox.closest(".quiz-option")
        const value = checkbox.value
        const isChecked = checkbox.checked
        const isCorrect = correctAnswers.includes(value)

        option.classList.remove("correct-answer", "incorrect-answer", "missed-answer")

        if (isChecked && isCorrect) {
          option.classList.add("correct-answer")
          announceToScreenReader(`${FEEDBACK_MESSAGES.CORRECT_ANSWER}: ${checkbox.nextElementSibling.textContent}`)
        } else if (isChecked && !isCorrect) {
          option.classList.add("incorrect-answer")
          announceToScreenReader(`${FEEDBACK_MESSAGES.INCORRECT_ANSWER}: ${checkbox.nextElementSibling.textContent}`)
        } else if (!isChecked && isCorrect) {
          option.classList.add("missed-answer")
        }
      })

      if (feedbackDiv) {
        feedbackDiv.style.display = "block"
        feedbackDiv.scrollIntoView({ behavior: "smooth", block: "nearest" })
      }

      submitBtn.textContent = FEEDBACK_MESSAGES.SUBMITTED
      submitBtn.disabled = true

      addResetButton(form)

      saveQuizCompletion()

      announceToScreenReader("Quiz completed. Review your answers and feedback above.")
    })

    const savedState = loadQuizState("wellbeing")
    if (savedState) {
      userAnswersChapter1 = savedState.userAnswers || {}
      quizCompletedChapter1 = savedState.completed || false
      restoreQuizVisualState(savedState)
    }
  }

  initializeWellbeingQuiz()
  initializeMetacognitionQuiz()
  initializeReflectionQuiz()
  initializeDigitalHabitsQuiz()
  initializeValuesQuiz()
  initializeGoalsQuiz()
  initializePracticeQuiz()

  // Export functions for use in other scripts
  window.QuizManager = {
    initializeWellbeingQuiz,
    resetWellbeingQuiz,
    initializeMetacognitionQuiz,
    initializeReflectionQuiz,
    initializeDigitalHabitsQuiz,
    initializeValuesQuiz,
    initializeGoalsQuiz,
    initializePracticeQuiz,
  }
})
