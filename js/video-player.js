/**
 * Evita que varios vídeos se reproduzcan a la vez.
 * Cuando un vídeo entra en reproducción, pausa todos los demás.
 */
document.addEventListener("DOMContentLoaded", () => {
  const videos = Array.from(document.querySelectorAll("video"))

  videos.forEach((video) => {
    video.addEventListener("play", () => {
      videos.forEach((other) => {
        if (other !== video && !other.paused && !other.ended) {
          other.pause()
        }
      })
    })
  })
})
