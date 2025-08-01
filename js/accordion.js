document.addEventListener("DOMContentLoaded", () => {
  const accordionItems = document.querySelectorAll(".accordion-item")

  accordionItems.forEach((item) => {
    const trigger = item.querySelector(".accordion-trigger")
    if (!trigger) return

    const panel = document.getElementById(trigger.getAttribute("aria-controls"))
    const icon = trigger.querySelector(".accordion-icon")

    if (!panel) return

    // Set initial state
    if (icon) {
      icon.textContent = "+"
    }
    trigger.setAttribute("aria-expanded", "false")
    panel.setAttribute("hidden", "")
    panel.style.maxHeight = null

    trigger.addEventListener("click", () => {
      const isExpanded = trigger.getAttribute("aria-expanded") === "true"

      trigger.setAttribute("aria-expanded", !isExpanded)

      if (!isExpanded) {
        panel.removeAttribute("hidden")
        // Set max-height after a short delay to allow the 'hidden' attribute removal to register
        setTimeout(() => {
          panel.style.maxHeight = panel.scrollHeight + "px"
        }, 10)
        if (icon) {
          icon.textContent = "−"
        }
      } else {
        panel.style.maxHeight = null
        // Add hidden attribute after transition ends
        panel.addEventListener("transitionend", function handleTransitionEnd() {
          panel.setAttribute("hidden", "")
          panel.removeEventListener("transitionend", handleTransitionEnd)
        })
        if (icon) {
          icon.textContent = "+"
        }
      }
    })
  })
})
