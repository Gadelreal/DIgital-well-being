// js/quiz.js

// This is a placeholder file.  Since there was no existing code, I am creating a basic quiz structure
// that allows me to demonstrate the requested update.

const quizData = [
  {
    question: "What is the capital of Spain?",
    answers: {
      a: "Madrid",
      b: "Barcelona",
      c: "Seville",
    },
    correctAnswer: "a",
  },
  {
    question: "What is 2 + 2?",
    answers: {
      a: "3",
      b: "4",
      c: "5",
    },
    correctAnswer: "b",
  },
]

let currentQuestionIndex = 0
let score = 0

const questionElement = document.getElementById("question")
const answersElement = document.getElementById("answers")
const submitButton = document.getElementById("submit")
const feedbackElement = document.getElementById("feedback")

function loadQuestion() {
  const currentQuestion = quizData[currentQuestionIndex]
  questionElement.innerText = currentQuestion.question

  answersElement.innerHTML = ""
  for (const key in currentQuestion.answers) {
    const button = document.createElement("button")
    button.innerText = currentQuestion.answers[key]
    button.addEventListener("click", () => checkAnswer(key))
    answersElement.appendChild(button)
  }
}

function checkAnswer(selectedAnswer) {
  const currentQuestion = quizData[currentQuestionIndex]

  if (selectedAnswer === currentQuestion.correctAnswer) {
    score++
    feedbackElement.innerText = "Correcta" // Updated to Spanish
    feedbackElement.style.color = "green"
  } else {
    feedbackElement.innerText = "Incorrect"
    feedbackElement.style.color = "red"
  }

  currentQuestionIndex++

  if (currentQuestionIndex < quizData.length) {
    loadQuestion()
  } else {
    showResults()
  }
}

function showResults() {
  questionElement.innerText = "Quiz completed!"
  answersElement.innerHTML = ""
  submitButton.style.display = "none"
  feedbackElement.innerText = `You scored ${score} out of ${quizData.length}`
}

loadQuestion()

submitButton.addEventListener("click", () => checkAnswer())
