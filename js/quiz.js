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

  const userAnswersChapter1 = {}
  const quizCompletedChapter1 = false

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
    wellbeingQuizForm.addEventListener("submit", (event) => {
      event.preventDefault()
      showWellbeingQuizFeedback(wellbeingQuizForm, correctAnswersDigitalWellbeing)
    })
  }

  function showWellbeingQuizFeedback(form, correctAnswers) {
    const checkboxes = form.querySelectorAll('input[type="checkbox"]')
    const feedbackDiv = document.getElementById("wellbeing-quiz-feedback")
    const submitBtn = form.querySelector(".quiz-submit-btn")

    checkboxes.forEach((checkbox) => {
      const option = checkbox.closest(".quiz-option")
      const value = checkbox.value
      const isChecked = checkbox.checked
      const isCorrect = correctAnswers.includes(value)

      // Limpiar feedback anterior
      option.classList.remove("correct-answer", "incorrect-answer", "missed-answer")
      const existingFeedback = option.querySelector(".option-feedback")
      if (existingFeedback) {
        existingFeedback.remove()
      }

      // Crear nuevo span para el feedback
      const feedbackSpan = document.createElement("span")
      feedbackSpan.className = "option-feedback"

      if (isChecked && isCorrect) {
        option.classList.add("correct-answer")
        feedbackSpan.innerHTML = '<i class="fas fa-check" aria-hidden="true"></i> (Correct)'
        option.appendChild(feedbackSpan)
      } else if (isChecked && !isCorrect) {
        option.classList.add("incorrect-answer")
        feedbackSpan.innerHTML = '<i class="fas fa-times" aria-hidden="true"></i> (Incorrect)'
        option.appendChild(feedbackSpan)
      } else if (!isChecked && isCorrect) {
        option.classList.add("missed-answer")
        feedbackSpan.innerHTML = '<i class="fas fa-info-circle" aria-hidden="true"></i> (Correct)'
        option.appendChild(feedbackSpan)
      }
    })

    if (feedbackDiv) {
      feedbackDiv.style.display = "block"
      feedbackDiv.scrollIntoView({ behavior: "smooth", block: "nearest" })
    }

    if (submitBtn) {
      submitBtn.disabled = true
      submitBtn.textContent = "Submitted"
    }

    addResetButton(form)
  }

  function addResetButton(form) {
    if (form.querySelector(".quiz-reset-btn")) return

    const submitBtn = form.querySelector(".quiz-submit-btn")
    const resetBtn = document.createElement("button")
    resetBtn.type = "button"
    resetBtn.className = "quiz-reset-btn quiz-submit-btn"
    resetBtn.innerHTML = '<i class="fas fa-redo" aria-hidden="true"></i> Reset Activity'
    resetBtn.style.marginLeft = "1rem"
    resetBtn.style.backgroundColor = "#6c757d"

    resetBtn.addEventListener("click", () => {
      resetWellbeingQuiz(form)
    })

    if (submitBtn && submitBtn.parentNode) {
      submitBtn.parentNode.insertBefore(resetBtn, submitBtn.nextSibling)
    }
  }

  function resetWellbeingQuiz(form) {
    const checkboxes = form.querySelectorAll('input[type="checkbox"]')
    const feedbackDiv = document.getElementById("wellbeing-quiz-feedback")
    const submitBtn = form.querySelector(".quiz-submit-btn:not(.quiz-reset-btn)")
    const resetBtn = form.querySelector(".quiz-reset-btn")

    checkboxes.forEach((checkbox) => {
      checkbox.checked = false
      const option = checkbox.closest(".quiz-option")
      option.classList.remove("correct-answer", "incorrect-answer", "missed-answer")
      const existingFeedback = option.querySelector(".option-feedback")
      if (existingFeedback) {
        existingFeedback.remove()
      }
    })

    if (feedbackDiv) {
      feedbackDiv.style.display = "none"
    }

    if (submitBtn) {
      submitBtn.disabled = false
      submitBtn.textContent = "Submit"
    }

    if (resetBtn) {
      resetBtn.remove()
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
  initializeMetacognitionQuiz()
  initializeReflectionQuiz()
  initializeDigitalHabitsQuiz()
  initializeValuesQuiz()
  initializeGoalsQuiz()
  initializePracticeQuiz()

  // Export functions for use in other scripts
  window.QuizManager = {
    initializeMetacognitionQuiz,
    initializeReflectionQuiz,
    initializeDigitalHabitsQuiz,
    initializeValuesQuiz,
    initializeGoalsQuiz,
    initializePracticeQuiz,
  }
})
