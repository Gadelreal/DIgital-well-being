// js/video-player.js

// Import Video.js library
const videojs = window.videojs

// Array global para almacenar todas las instancias de players
const allPlayers = []

// Función para pausar todos los otros videos excepto el actual
function pauseOtherVideos(currentPlayer) {
  allPlayers.forEach((player) => {
    if (player !== currentPlayer && !player.paused()) {
      player.pause()
    }
  })
}

// Plugin personalizado para Video.js
videojs.registerPlugin("singlePlayPlugin", function (options) {
  

  // Cuando este video empiece a reproducirse, pausar todos los otros
  this.on("play", () => {
    console.log("Video playing, pausing others...")
    pauseOtherVideos(this)
  })

  this.on("ended", () => {
    console.log("Video ended")
  })

  // Configurar opciones por defecto
  options = videojs.mergeOptions(
    {
      enableSinglePlay: true,
    },
    options,
  )
})

// Inicializar todos los videos con la clase .video-js
document.addEventListener("DOMContentLoaded", () => {
  var videoElements = document.querySelectorAll("video.video-js")

  videoElements.forEach((el) => {
    // Solo inicializar si aún no está inicializado
    if (!el.classList.contains("vjs-initialized")) {
      var player = videojs(el, {
        // Configuración para mostrar el botón de play central
        playbackRates: [0.5, 1, 1.25, 1.5, 2],
        responsive: true,
        fluid: true,
        plugins: {
          singlePlayPlugin: {
            enableSinglePlay: true,
          },
        },
      })

      el.classList.add("vjs-initialized")

      // Agregar el player al array global
      allPlayers.push(player)

      // Asegurar que el big play button esté visible
      player.ready(() => {
        player.bigPlayButton.show()
      })
    }
  })
})
