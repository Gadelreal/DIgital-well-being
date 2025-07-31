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
    wellbeingQuiz.addEventListener("submit", (e) => {
      e.preventDefault()
      handleWellbeingQuizSubmit()
    })
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

  // Calculate results
  let correctCount = 0
  let incorrectCount = 0

  // Disable all inputs
  const allInputs = form.querySelectorAll('input[type="radio"]')
  allInputs.forEach((input) => {
    input.disabled = true
    input.closest(".quiz-option").style.cursor = "default"
  })

  // Process each question for visual feedback and counting
  fieldsets.forEach((fieldset) => {
    const questionName = fieldset.querySelector('input[type="radio"]').name
    const selectedOption = form.querySelector(`input[name="${questionName}"]:checked`)
    const correctAnswerValue = correctAnswers[questionName]

    if (selectedOption) {
      const userSelectedValue = selectedOption.value
      const userOptionElement = selectedOption.closest(".quiz-option")

      if (userSelectedValue === correctAnswerValue) {
        // Correct answer
        correctCount++
        userOptionElement.classList.add("correct-answer") // Green
      } else {
        // Incorrect answer
        incorrectCount++
        userOptionElement.classList.add("incorrect-answer") // Red

        // Highlight the correct answer as missed
        const correctOption = fieldset.querySelector(`input[value="${correctAnswerValue}"]`)
        if (correctOption) {
          correctOption.closest(".quiz-option").classList.add("missed-answer") // Yellow
        }
      }
    } else {
      // This case should not happen due to the check before, but as a fallback:
      incorrectCount++
      // Highlight the correct answer as missed
      const correctOption = fieldset.querySelector(`input[value="${correctAnswerValue}"]`)
      if (correctOption) {
        correctOption.closest(".quiz-option").classList.add("missed-answer") // Yellow
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
