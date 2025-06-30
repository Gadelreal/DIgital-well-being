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
  function saveQuizState(userAnswers, completed) {
    const quizState = {
      userAnswers: { ...userAnswers },
      completed: completed,
      timestamp: new Date().toISOString(),
    }
    localStorage.setItem("wellbeing-quiz-state", JSON.stringify(quizState))
  }

  // Function to load quiz state from localStorage:
  function loadQuizState() {
    const savedState = localStorage.getItem("wellbeing-quiz-state")
    if (savedState) {
      try {
        return JSON.parse(savedState)
      } catch (e) {
        console.error("Error parsing saved quiz state:", e)
        return null
      }
    }
    return null
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

      // Get all checkboxes
      const checkboxes = wellbeingQuizForm.querySelectorAll('input[type="checkbox"]')

      // Track user answers for localStorage
      const currentAnswers = {}
      checkboxes.forEach((checkbox) => {
        if (checkbox.checked) {
          currentAnswers[checkbox.value] = true
        }
      })

      // Check each option and provide visual feedback
      checkboxes.forEach((checkbox) => {
        const optionContainer = checkbox.closest(".quiz-option")
        const optionValue = checkbox.value
        const isCorrect = correctAnswersDigitalWellbeing.includes(optionValue)
        const isChecked = checkbox.checked

        // Remove any existing feedback classes
        optionContainer.classList.remove("correct-answer", "incorrect-answer", "missed-answer")

        if (isChecked && isCorrect) {
          // User selected correct answer
          optionContainer.classList.add("correct-answer")
        } else if (isChecked && !isCorrect) {
          // User selected incorrect answer
          optionContainer.classList.add("incorrect-answer")
        } else if (!isChecked && isCorrect) {
          // User missed a correct answer
          optionContainer.classList.add("missed-answer")
        }
      })

      // Mark quiz as completed and save to localStorage
      quizCompletedChapter1 = true
      userAnswersChapter1 = { ...currentAnswers }
      saveQuizState(userAnswersChapter1, quizCompletedChapter1)

      // Show the feedback
      if (feedbackElement) {
        feedbackElement.style.display = "block"
        feedbackElement.scrollIntoView({ behavior: "smooth", block: "nearest" })
      }

      // Disable the button to prevent re-submission
      if (submitButton) {
        submitButton.disabled = true
        submitButton.textContent = "Submitted"
      }
    })

    // Load and restore previous quiz state on page load
    const savedState = loadQuizState()
    if (savedState) {
      userAnswersChapter1 = savedState.userAnswers || {}
      quizCompletedChapter1 = savedState.completed || false
      restoreQuizVisualState(savedState)
    }
  }

  // Function to reset the wellbeing quiz
  function resetWellbeingQuiz() {
    const wellbeingQuizForm = document.getElementById("wellbeing-quiz")
    if (!wellbeingQuizForm) return

    // Clear localStorage
    localStorage.removeItem("wellbeing-quiz-state")

    // Reset form
    const checkboxes = wellbeingQuizForm.querySelectorAll('input[type="checkbox"]')
    checkboxes.forEach((checkbox) => {
      checkbox.checked = false
      const optionContainer = checkbox.closest(".quiz-option")
      optionContainer.classList.remove("correct-answer", "incorrect-answer", "missed-answer")
    })

    // Hide feedback and enable submit button
    const feedbackElement = document.getElementById("wellbeing-quiz-feedback")
    const submitButton = wellbeingQuizForm.querySelector(".quiz-submit-btn")

    if (feedbackElement) {
      feedbackElement.style.display = "none"
    }

    if (submitButton) {
      submitButton.disabled = false
      submitButton.textContent = "Submit"
    }

    // Reset global state
    quizCompletedChapter1 = false
    userAnswersChapter1 = {}
  }

  // Add reset button for wellbeing quiz
  const wellbeingQuizContainer = document.querySelector(".quiz-activity-container")
  if (wellbeingQuizContainer) {
    const resetButtonContainer = document.createElement("div")
    resetButtonContainer.style.cssText = `
      text-align: center;
      margin-top: 1rem;
      margin-bottom: 1rem;
      padding-top: 1rem;
    `

    const resetButton = document.createElement("button")
    resetButton.className = "quiz-submit-btn"
    resetButton.innerHTML = '<i class="fas fa-redo" aria-hidden="true"></i> Reset Activity'
    resetButton.style.cssText = `
      background-color: #6c757d;
      margin-left: 10px;
    `

    resetButton.addEventListener("click", resetWellbeingQuiz)

    resetButtonContainer.appendChild(resetButton)
    wellbeingQuizContainer.appendChild(resetButtonContainer)
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
})
