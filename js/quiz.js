document.addEventListener("DOMContentLoaded", () => {
  // Initialize all quizzes on the page
  initializeQuizzes()

  // Load saved answers if they exist
  loadSavedAnswers()
})

function initializeQuizzes() {
  // Digital Well-being Quiz (Chapter 2)
  const wellbeingQuiz = document.getElementById("wellbeing-quiz")
  if (wellbeingQuiz) {
    wellbeingQuiz.addEventListener("submit", handleQuizSubmit)
  }

  // Final Quiz (Chapter 5)
  const finalQuiz = document.getElementById("final-quiz")
  if (finalQuiz) {
    finalQuiz.addEventListener("submit", (e) => {
      e.preventDefault()
      handleFinalQuizSubmit()
    })

    // Add click handlers for better radio button interaction
    const radioButtons = finalQuiz.querySelectorAll('input[type="radio"]')
    radioButtons.forEach((radio) => {
      radio.addEventListener("change", function () {
        // Ensure the radio button is properly selected
        this.checked = true

        // Update visual feedback
        const parentOption = this.closest(".quiz-option")
        if (parentOption) {
          // Remove selected class from siblings
          const siblingOptions = parentOption.parentNode.querySelectorAll(".quiz-option")
          siblingOptions.forEach((option) => option.classList.remove("selected"))

          // Add selected class to current option
          parentOption.classList.add("selected")
        }
      })

      // Handle click events on the radio button itself
      radio.addEventListener("click", function (e) {
        // Ensure the click is processed
        setTimeout(() => {
          this.checked = true
          this.dispatchEvent(new Event("change"))
        }, 0)
      })
    })

    // Add click handlers for quiz option labels
    const quizOptions = finalQuiz.querySelectorAll(".quiz-option")
    quizOptions.forEach((option) => {
      option.addEventListener("click", function (e) {
        const radio = this.querySelector('input[type="radio"]')
        if (radio && e.target !== radio) {
          radio.checked = true
          radio.dispatchEvent(new Event("change"))
        }
      })
    })
  }
}

/**
 * Obtiene el idioma de la página actual.
 * @returns {string} El código del idioma ('es' o 'en').
 */
function getQuizLang() {
  return document.documentElement.lang || "en"
}

/**
 * Obtiene los textos del quiz en el idioma correspondiente.
 * @param {string} lang - El código del idioma.
 * @returns {object} Un objeto con los textos.
 */
function getQuizStrings(lang) {
  if (lang === "es") {
    return {
      tryAgain: "Intentar de nuevo",
    }
  }
  return {
    tryAgain: "Try Again",
  }
}

/**
 * Maneja el envío del formulario del quiz.
 * @param {Event} event - El evento de envío del formulario.
 */
function handleQuizSubmit(event) {
  event.preventDefault()
  const form = event.target
  const feedbackElement = document.getElementById("wellbeing-quiz-feedback")
  const submitButton = form.querySelector(".quiz-submit-btn")
  const checkboxes = form.querySelectorAll('input[type="checkbox"]')
  const correctAnswers = ["a", "e"]

  checkboxes.forEach((checkbox) => {
    const optionLabel = checkbox.closest(".quiz-option")
    const isCorrect = correctAnswers.includes(checkbox.value)
    const isChecked = checkbox.checked

    // Limpiar clases previas
    optionLabel.classList.remove("correct-answer", "incorrect-answer", "missed-answer")

    if (isChecked && isCorrect) {
      optionLabel.classList.add("correct-answer")
    } else if (isChecked && !isCorrect) {
      optionLabel.classList.add("incorrect-answer")
    } else if (!isChecked && isCorrect) {
      optionLabel.classList.add("missed-answer")
    }
    checkbox.disabled = true
  })

  if (feedbackElement) {
    feedbackElement.style.display = "block"
  }
  if (submitButton) {
    submitButton.style.display = "none"
  }

  // Añadir botón "Intentar de nuevo" si no existe
  let tryAgainButton = form.querySelector(".quiz-reset-btn")
  if (!tryAgainButton) {
    const lang = getQuizLang()
    const strings = getQuizStrings(lang)
    tryAgainButton = document.createElement("button")
    tryAgainButton.type = "button"
    tryAgainButton.className = "quiz-submit-btn quiz-reset-btn"
    tryAgainButton.textContent = strings.tryAgain
    // Insertar después del fieldset
    const fieldset = form.querySelector("fieldset")
    if (fieldset) {
      fieldset.parentNode.insertBefore(tryAgainButton, fieldset.nextSibling)
    } else {
      form.appendChild(tryAgainButton)
    }
    tryAgainButton.addEventListener("click", resetQuiz)
  }
}

/**
 * Reinicia el quiz a su estado inicial.
 */
function resetQuiz() {
  const form = document.getElementById("wellbeing-quiz")
  const feedbackElement = document.getElementById("wellbeing-quiz-feedback")
  const submitButton = form.querySelector(".quiz-submit-btn")
  const checkboxes = form.querySelectorAll('input[type="checkbox"]')
  const tryAgainButton = form.querySelector(".quiz-reset-btn")

  checkboxes.forEach((checkbox) => {
    const optionLabel = checkbox.closest(".quiz-option")
    checkbox.checked = false
    checkbox.disabled = false
    optionLabel.classList.remove("correct-answer", "incorrect-answer", "missed-answer")
  })

  if (feedbackElement) {
    feedbackElement.style.display = "none"
  }
  if (submitButton) {
    submitButton.style.display = "block"
  }
  if (tryAgainButton) {
    tryAgainButton.remove()
  }
}

function handleFinalQuizSubmit() {
  const form = document.getElementById("final-quiz")
  const feedback = document.getElementById("final-quiz-feedback")
  const submitBtn = form.querySelector(".quiz-submit-btn")

  const correctAnswers = {
    question1: "c",
    question2: "c",
    question3: "c",
    question4: "c",
    question5: "c",
    question6: "b",
    question7: "b",
    question8: "b",
    question9: "c",
    question10: "c",
  }

  const fieldsets = form.querySelectorAll("fieldset")
  let allAnswered = true
  const userAnswers = {}

  // Collect user answers and check if all questions are answered
  fieldsets.forEach((fieldset) => {
    const questionName = fieldset.querySelector('input[type="radio"]').name
    const selectedOption = form.querySelector(`input[name="${questionName}"]:checked`)
    if (!selectedOption) {
      allAnswered = false
    } else {
      userAnswers[questionName] = selectedOption.value
    }
  })

  if (!allAnswered) {
    alert("Please answer all questions before submitting.")
    return
  }

  // Save answers to sessionStorage
  const quizData = {
    answers: userAnswers,
    timestamp: new Date().toISOString(),
    completed: true,
  }

  try {
    sessionStorage.setItem("finalQuizAnswers", JSON.stringify(quizData))
    console.log("Final quiz answers saved to session storage:", quizData)
  } catch (error) {
    console.error("Error saving quiz answers to session storage:", error)
  }

  // Disable all inputs
  const allInputs = form.querySelectorAll('input[type="radio"]')
  allInputs.forEach((input) => {
    input.disabled = true
    input.closest(".quiz-option").style.cursor = "default"
  })

  // Calculate results and apply visual feedback
  let correctCount = 0
  let incorrectCount = 0

  // Process each question for visual feedback and counting
  fieldsets.forEach((fieldset) => {
    const questionName = fieldset.querySelector('input[type="radio"]').name
    const selectedOptionInput = form.querySelector(`input[name="${questionName}"]:checked`)
    const correctAnswerValue = correctAnswers[questionName]

    if (selectedOptionInput) {
      const selectedValue = selectedOptionInput.value
      const selectedOptionElement = selectedOptionInput.closest(".quiz-option")

      if (selectedValue === correctAnswerValue) {
        correctCount++
        selectedOptionElement.classList.add("correct-answer") // Green
      } else {
        incorrectCount++
        selectedOptionElement.classList.add("incorrect-answer") // Red

        // Also highlight the correct answer as 'missed'
        const correctOptionInput = form.querySelector(`input[name="${questionName}"][value="${correctAnswerValue}"]`)
        if (correctOptionInput) {
          const correctOptionElement = correctOptionInput.closest(".quiz-option")
          correctOptionElement.classList.add("missed-answer") // Yellow
        }
      }
    }
  })

  // Calculate percentage
  const totalQuestions = Object.keys(correctAnswers).length
  const percentage = Math.round((correctCount / totalQuestions) * 100)

  // Update results display
  document.getElementById("correct-count").textContent = correctCount
  document.getElementById("incorrect-count").textContent = incorrectCount
  document.getElementById("percentage-score").textContent = percentage + "%"

  // Show results container
  const resultsContainer = document.getElementById("quiz-results-container")
  resultsContainer.style.display = "block"

  // Change submit button to "Try Again" button
  submitBtn.textContent = "Try Again"
  submitBtn.disabled = false
  submitBtn.type = "button"

  // Remove the original submit event listener and add reset functionality
  const newSubmitBtn = submitBtn.cloneNode(true)
  submitBtn.parentNode.replaceChild(newSubmitBtn, submitBtn)

  newSubmitBtn.addEventListener("click", () => {
    resetFinalQuiz()
  })

  // Show feedback with save confirmation
  const feedbackElement = document.getElementById("final-quiz-feedback")
  feedbackElement.innerHTML = `
  <h4>Thank you for completing the final assessment!</h4>
  <p><strong>✓ Your answers have been saved successfully.</strong></p>
  <p>We appreciate the time and thought you've put into this test. We hope it has helped reinforce the key concepts and practical strategies you explored throughout the course.</p>
  <p>Your responses reflect the knowledge you've gained in your digital well-being journey. Keep reflecting, practicing, and applying what you've learned—and remember, digital well-being is an ongoing process of balance, awareness, and intentional choice.</p>
`

  feedback.style.display = "block"
  feedback.scrollIntoView({ behavior: "smooth", block: "center" })

  // Announce to screen readers
  const announcement = document.createElement("div")
  announcement.className = "sr-only"
  announcement.setAttribute("aria-live", "polite")
  announcement.textContent = `Quiz completed. You scored ${correctCount} out of ${totalQuestions} correct answers (${percentage}%). Results are now displayed below. You can try again if you wish.`
  form.appendChild(announcement)

  setTimeout(() => {
    if (announcement.parentNode) {
      announcement.parentNode.removeChild(announcement)
    }
  }, 1000)
}

function resetFinalQuiz() {
  const form = document.getElementById("final-quiz")
  const feedback = document.getElementById("final-quiz-feedback")
  const submitBtn = form.querySelector(".quiz-submit-btn")
  const resultsContainer = document.getElementById("quiz-results-container")

  // Reset form
  form.reset()

  // Enable all inputs
  const allInputs = form.querySelectorAll('input[type="radio"]')
  allInputs.forEach((input) => {
    input.disabled = false
    input.closest(".quiz-option").style.cursor = "pointer"
  })

  // Remove feedback classes and selected classes
  const allOptions = form.querySelectorAll(".quiz-option")
  allOptions.forEach((option) => {
    option.classList.remove("correct-answer", "incorrect-answer", "missed-answer", "selected")
  })

  // Hide feedback and results
  feedback.style.display = "none"
  resultsContainer.style.display = "none"

  // Reset results display
  document.getElementById("correct-count").textContent = "0"
  document.getElementById("incorrect-count").textContent = "0"
  document.getElementById("percentage-score").textContent = "0%"

  // Change button back to "Submit Answers"
  submitBtn.textContent = "Submit Answers"
  submitBtn.type = "submit"

  // Remove the reset event listener and restore submit functionality
  const newSubmitBtn = submitBtn.cloneNode(true)
  submitBtn.parentNode.replaceChild(newSubmitBtn, submitBtn)

  // Re-add the submit event listener
  newSubmitBtn.addEventListener("click", (e) => {
    e.preventDefault()
    handleFinalQuizSubmit()
  })

  // Clear saved answers from session storage
  try {
    sessionStorage.removeItem("finalQuizAnswers")
    console.log("Final quiz answers cleared from session storage")
  } catch (error) {
    console.error("Error clearing quiz answers from session storage:", error)
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

// Function to save quiz answers to session storage
function saveQuizAnswers(quizId, answers) {
  try {
    const quizData = {
      answers: answers,
      timestamp: new Date().toISOString(),
      completed: true,
    }
    sessionStorage.setItem(quizId, JSON.stringify(quizData))
    return true
  } catch (error) {
    console.error("Error saving quiz answers:", error)
    return false
  }
}

// Function to get saved quiz answers from session storage
function getSavedQuizAnswers(quizId) {
  try {
    const savedData = sessionStorage.getItem(quizId)
    return savedData ? JSON.parse(savedData) : null
  } catch (error) {
    console.error("Error retrieving saved quiz answers:", error)
    return null
  }
}

// Function to load saved answers when page loads
function loadSavedAnswers() {
  // Load final quiz answers if they exist
  const savedFinalQuiz = getSavedQuizAnswers("finalQuizAnswers")
  if (savedFinalQuiz && savedFinalQuiz.answers) {
    const form = document.getElementById("final-quiz")
    if (form) {
      // Restore selected answers
      Object.keys(savedFinalQuiz.answers).forEach((questionName) => {
        const answer = savedFinalQuiz.answers[questionName]
        const radio = form.querySelector(`input[name="${questionName}"][value="${answer}"]`)
        if (radio) {
          radio.checked = true
          const parentOption = radio.closest(".quiz-option")
          if (parentOption) {
            parentOption.classList.add("selected")
          }
        }
      })
    }
  }
}
