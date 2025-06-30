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

  function addResetButton(form) {
    // Check if reset button already exists
    if (form.querySelector(".quiz-reset-btn")) return

    const submitBtn = form.querySelector(".quiz-submit-btn")
    const resetBtn = document.createElement("button")
    resetBtn.type = "button"
    resetBtn.className = "quiz-reset-btn quiz-submit-btn"
    resetBtn.innerHTML = '<i class="fas fa-redo" aria-hidden="true"></i> Reset Activity'
    resetBtn.style.cssText = `
    margin-left: 1rem;
    background-color: #6c757d;
    border: 1px solid #6c757d;
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
      resetWellbeingQuiz(form)
    })

    // Insert the reset button after the submit button
    submitBtn.parentNode.insertBefore(resetBtn, submitBtn.nextSibling)
  }

  // Funcionalidad general para otros quizzes (si existen)
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
    const quizCompletedGeneral = false

    // Inicializar otros quizzes
    quizQuestions.forEach((question, index) => {
      const questionNumber = index + 1
      const options = question.querySelectorAll(".quiz-options li")

      options.forEach((option, optionIndex) => {
        const optionLetter = String.fromCharCode(65 + optionIndex) // A, B, C, D

        // Añadir atributos de accesibilidad
        option.setAttribute("role", "button")
        option.setAttribute("tabindex", "0")
        option.setAttribute("aria-label", `Option ${optionLetter}: ${option.textContent}`)
        option.setAttribute("data-question", questionNumber)
        option.setAttribute("data-answer", optionLetter)

        // Event listeners para click y teclado
        option.addEventListener("click", () => handleAnswerSelection(questionNumber, optionLetter, option))
        option.addEventListener("keydown", (e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault()
            handleAnswerSelection(questionNumber, optionLetter, option)
          }
        })
      })
    })

    function handleAnswerSelection(questionNumber, selectedAnswer, selectedElement) {
      // Prevenir cambios si ya se respondió esta pregunta
      if (userAnswersGeneral[questionNumber]) {
        return
      }

      // Guardar la respuesta del usuario
      userAnswersGeneral[questionNumber] = selectedAnswer

      // Obtener todas las opciones de esta pregunta
      const questionElement = selectedElement.closest(".quiz-question")
      const allOptions = questionElement.querySelectorAll(".quiz-options li")

      // Deshabilitar todas las opciones de esta pregunta
      allOptions.forEach((option) => {
        option.style.pointerEvents = "none"
        option.setAttribute("aria-disabled", "true")
      })

      // Verificar si la respuesta es correcta
      const isCorrect = selectedAnswer === correctAnswersGeneral[questionNumber]

      if (isCorrect) {
        // Respuesta correcta
        selectedElement.style.backgroundColor = "#d4edda"
        selectedElement.style.borderColor = "#c3e6cb"
        selectedElement.style.color = "#155724"
        selectedElement.innerHTML +=
          ' <i class="fas fa-check" style="color: #28a745; margin-left: 0.5rem;" aria-hidden="true"></i>'

        // Añadir mensaje de feedback
        const feedbackElement = document.createElement("div")
        feedbackElement.className = "quiz-feedback correct"
        feedbackElement.innerHTML = '<i class="fas fa-check-circle" aria-hidden="true"></i> Correct! Excellent work.'
        feedbackElement.style.cssText = `
          margin-top: 0.5rem;
          padding: 0.5rem;
          background-color: #d4edda;
          border: 1px solid #c3e6cb;
          border-radius: 4px;
          color: #155724;
          font-weight: 500;
        `
        questionElement.appendChild(feedbackElement)
      } else {
        // Respuesta incorrecta
        selectedElement.style.backgroundColor = "#f8d7da"
        selectedElement.style.borderColor = "#f5c6cb"
        selectedElement.style.color = "#721c24"
        selectedElement.innerHTML +=
          ' <i class="fas fa-times" style="color: #dc3545; margin-left: 0.5rem;" aria-hidden="true"></i>'

        // Mostrar la respuesta correcta
        const correctOption = Array.from(allOptions).find(
          (option) => option.getAttribute("data-answer") === correctAnswersGeneral[questionNumber],
        )

        if (correctOption) {
          correctOption.style.backgroundColor = "#d1ecf1"
          correctOption.style.borderColor = "#bee5eb"
          correctOption.style.color = "#0c5460"
          correctOption.innerHTML +=
            ' <i class="fas fa-check" style="color: #17a2b8; margin-left: 0.5rem;" aria-hidden="true"></i>'
        }

        // Añadir mensaje de feedback
        const feedbackElement = document.createElement("div")
        feedbackElement.className = "quiz-feedback incorrect"
        feedbackElement.innerHTML = `
          <i class="fas fa-times-circle" aria-hidden="true"></i> 
          Incorrect. The correct answer is: ${correctAnswersGeneral[questionNumber]}
        `
        feedbackElement.style.cssText = `
          margin-top: 0.5rem;
          padding: 0.5rem;
          background-color: #f8d7da;
          border: 1px solid #f5c6cb;
          border-radius: 4px;
          color: #721c24;
          font-weight: 500;
        `
        questionElement.appendChild(feedbackElement)
      }

      // Anunciar el resultado para lectores de pantalla
      const announcement = document.createElement("div")
      announcement.setAttribute("aria-live", "polite")
      announcement.className = "sr-only"
      announcement.textContent = isCorrect
        ? "Correct answer"
        : `Incorrect answer. The correct answer is ${correctAnswersGeneral[questionNumber]}`
      document.body.appendChild(announcement)

      // Eliminar el anuncio después de que se haya leído
      setTimeout(() => {
        if (document.body.contains(announcement)) {
          document.body.removeChild(announcement)
        }
      }, 3000)
    }
  }

  // Initialize other quizzes if they exist
  const otherQuizzes = document.querySelectorAll('[id$="-quiz"]:not(#wellbeing-quiz)')
  otherQuizzes.forEach((quiz) => {
    initializeGenericQuiz(quiz.id)
  })

  function initializeGenericQuiz(quizId) {
    const quiz = document.getElementById(quizId)
    if (!quiz) return

    const submitBtn = quiz.querySelector(".quiz-submit, .quiz-submit-btn")
    if (submitBtn) {
      submitBtn.addEventListener("click", (e) => {
        e.preventDefault()
        handleGenericQuizSubmit(quiz)
      })
    }
  }

  function handleGenericQuizSubmit(quiz) {
    const questions = quiz.querySelectorAll(".quiz-question, .survey-question")
    let allAnswered = true

    questions.forEach((question) => {
      const inputs = question.querySelectorAll('input[type="radio"], input[type="checkbox"]')
      const hasAnswer = Array.from(inputs).some((input) => input.checked)

      if (!hasAnswer) {
        allAnswered = false
        question.classList.add("unanswered")
      } else {
        question.classList.remove("unanswered")
      }
    })

    if (!allAnswered) {
      announceToScreenReader("Please answer all questions before submitting.")
      return
    }

    // Show results or feedback
    const resultDiv = quiz.querySelector(".quiz-result, .survey-result")
    if (resultDiv) {
      resultDiv.style.display = "block"
      resultDiv.scrollIntoView({ behavior: "smooth" })
    }

    announceToScreenReader("Quiz submitted successfully.")
  }

  // Additional quiz utilities
  function saveQuizProgress(quizId, answers) {
    try {
      const progress = {
        answers: answers,
        timestamp: new Date().toISOString(),
        completed: true,
      }
      localStorage.setItem(`quiz_${quizId}`, JSON.stringify(progress))
    } catch (error) {
      console.warn("Could not save quiz progress:", error)
    }
  }

  function loadQuizProgress(quizId) {
    try {
      const saved = localStorage.getItem(`quiz_${quizId}`)
      return saved ? JSON.parse(saved) : null
    } catch (error) {
      console.warn("Could not load quiz progress:", error)
      return null
    }
  }

  // Function to initialize the wellbeing quiz
  function initializeWellbeingQuiz() {
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
  }

  // Export functions for use in other scripts
  window.QuizManager = {
    initializeWellbeingQuiz,
    resetWellbeingQuiz,
    saveQuizProgress,
    loadQuizProgress,
  }
})
