document.addEventListener("DOMContentLoaded", () => {
  // Cargar reflexiones guardadas previamente
  loadSavedReflections()

  // Añadir event listeners a todos los botones de guardar
  const saveButtons = document.querySelectorAll(".save-button")
  saveButtons.forEach((button) => {
    button.addEventListener("click", saveReflection)

    // Añadir soporte para teclado
    button.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault()
        saveReflection(e)
      }
    })
  })

  // Añadir event listeners para los textareas
  const textareas = document.querySelectorAll(".reflection-textarea")
  textareas.forEach((textarea) => {
    // Añadir atributos de accesibilidad
    if (!textarea.getAttribute("aria-required")) {
      textarea.setAttribute("aria-required", "false")
    }

    // Añadir evento para guardar con Ctrl+Enter
    textarea.addEventListener("keydown", (e) => {
      if (e.ctrlKey && e.key === "Enter") {
        e.preventDefault()
        const reflectionId = textarea.id
        const saveButton = document.querySelector(`[data-reflection-id="${reflectionId}"]`)
        if (saveButton) {
          saveButton.click()
        }
      }
    })
  })
})

/**
 * Obtiene el idioma de la página actual.
 * @returns {string} El código del idioma ('es' o 'en').
 */
function getReflectionsLang() {
  return document.documentElement.lang || "en"
}

/**
 * Obtiene los textos de feedback en el idioma correspondiente.
 * @param {string} lang - El código del idioma.
 * @returns {object} Un objeto con los textos.
 */
function getReflectionsFeedbackStrings(lang) {
  if (lang === "es") {
    return {
      loaded: "Se ha cargado una reflexión guardada previamente",
      error: "Por favor, escribe algo antes de guardar",
      success: "¡Reflexión guardada con éxito!",
      aria_success: "Tu reflexión ha sido guardada con éxito.",
    }
  }
  return {
    loaded: "Previously saved reflection loaded",
    error: "Please enter some text before saving",
    success: "Reflection saved successfully!",
    aria_success: "Your reflection has been saved successfully.",
  }
}

/**
 * Carga las reflexiones guardadas previamente del localStorage
 */
function loadSavedReflections() {
  const lang = getReflectionsLang()
  const strings = getReflectionsFeedbackStrings(lang)
  const textareas = document.querySelectorAll(".reflection-textarea")

  textareas.forEach((textarea) => {
    const reflectionId = textarea.id
    const savedReflection = localStorage.getItem(`reflection_${reflectionId}`)

    if (savedReflection) {
      textarea.value = savedReflection
      const feedbackElement = document.getElementById(`feedback-${reflectionId}`)
      if (feedbackElement) {
        feedbackElement.textContent = strings.loaded
        feedbackElement.classList.add("show")
        setTimeout(() => {
          feedbackElement.classList.remove("show")
        }, 3000)
      }
    }
  })
}

/**
 * Guarda la reflexión en localStorage y muestra feedback
 */
function saveReflection(event) {
  const lang = getReflectionsLang()
  const strings = getReflectionsFeedbackStrings(lang)

  // Obtener el ID de la reflexión desde el atributo data
  const button = event.target.closest(".save-button")
  if (!button) return

  const reflectionId = button.getAttribute("data-reflection-id")
  const textarea = document.getElementById(reflectionId)
  const feedbackElement = document.getElementById(`feedback-${reflectionId}`)

  // Obtener el valor del textarea
  const reflectionText = textarea.value

  // Validar que haya contenido
  if (!reflectionText.trim()) {
    feedbackElement.textContent = strings.error
    feedbackElement.classList.add("show")
    feedbackElement.style.color = "#d32f2f" // Color de error

    // Eliminar la clase después de la animación
    setTimeout(() => {
      feedbackElement.classList.remove("show")
    }, 3000)

    // Enfocar el textarea
    textarea.focus()
    return
  }

  // Guardar en localStorage
  localStorage.setItem(`reflection_${reflectionId}`, reflectionText)

  // Mostrar feedback al usuario
  feedbackElement.textContent = strings.success
  feedbackElement.classList.add("show")
  feedbackElement.style.color = "" // Restablecer al color predeterminado

  // Eliminar la clase después de la animación
  setTimeout(() => {
    feedbackElement.classList.remove("show")
  }, 3000)

  // Anunciar para lectores de pantalla
  const ariaLiveRegion = document.createElement("div")
  ariaLiveRegion.setAttribute("aria-live", "polite")
  ariaLiveRegion.className = "sr-only"
  ariaLiveRegion.textContent = strings.aria_success
  document.body.appendChild(ariaLiveRegion)

  // Eliminar después de que se haya anunciado
  setTimeout(() => {
    document.body.removeChild(ariaLiveRegion)
  }, 3000)
}
