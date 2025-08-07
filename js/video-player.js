// js/video-player.js

// Import Video.js library
const videojs = window.videojs

// Array global para almacenar todas las instancias de Video.js
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

document.addEventListener("DOMContentLoaded", () => {
  // Inicializar todos los videos con Video.js
  const videos = document.querySelectorAll("video[data-video-id]")

  videos.forEach((video) => {
    const videoId = video.getAttribute("data-video-id")
    const logoSrc = video.getAttribute("data-logo")

    // Configuración de Video.js
    const player = videojs(video.id, {
      controls: true,
      responsive: true,
      fluid: true,
      playbackRates: [0.5, 1, 1.25, 1.5, 2],
      html5: {
        vhs: {
          overrideNative: true,
        },
      },
    })

    // Añadir el player al array global
    allPlayers.push(player)

    // Plugin para pausar otros videos
    player.ready(() => {
      player.on("play", () => {
        pauseOtherVideos(player)
      })

      // Añadir logo si está disponible
      if (logoSrc) {
        const logoOverlay = document.createElement("div")
        logoOverlay.className = "vjs-logo-overlay"
        logoOverlay.innerHTML = `<img src="${logoSrc}" alt="Logo" class="vjs-logo">`
        player.el().appendChild(logoOverlay)
      }

      // Set Spanish subtitles as default
      const setSpanishSubtitlesDefault = (player) => {
        const tracks = player.textTracks()

        // Function to set Spanish subtitles as default
        const setDefaultTrack = () => {
          for (let i = 0; i < tracks.length; i++) {
            const track = tracks[i]
            
            // Disable all tracks first
            if (track.mode !== 'disabled') {
              track.mode = 'disabled'
            }
            
            // Enable Spanish track if found
            if (track.language === 'es' || track.label === 'Spanish' || track.label === 'Español') {
              track.mode = 'showing'
              console.log('Spanish subtitles enabled by default')
            }
          }
        }

        // Initial setup
        setDefaultTrack()

        // Listen for track changes and maintain Spanish as default
        tracks.addEventListener("addtrack", () => {
          setTimeout(setDefaultTrack, 100) // Small delay to ensure tracks are loaded
        })

        // Also listen for loadedmetadata to ensure tracks are available
        player.on('loadedmetadata', () => {
          setTimeout(setDefaultTrack, 100)
        })
      }

      setSpanishSubtitlesDefault(player)
    })

    // Marcar video como visto cuando termine
    player.on("ended", () => {
      localStorage.setItem(`video_watched_${videoId}`, "true")
      updateVideoCheckmark(video.id)
    })

    // Verificar si el video ya fue visto
    if (localStorage.getItem(`video_watched_${videoId}`) === "true") {
      updateVideoCheckmark(video.id)
    }
  })

  // También manejar videos de YouTube e iframes
  const iframes = document.querySelectorAll('iframe[src*="youtube"]')
  iframes.forEach((iframe) => {
    iframe.addEventListener("load", () => {
      // Pausar videos de Video.js cuando se reproduce un YouTube
      iframe.contentWindow.addEventListener("message", (event) => {
        if (event.data && typeof event.data === "string") {
          const data = JSON.parse(event.data)
          if (data.event === "video-play") {
            allPlayers.forEach((player) => {
              if (!player.paused()) {
                player.pause()
              }
            })
          }
        }
      })
    })
  })
})

function updateVideoCheckmark(videoId) {
  const video = document.getElementById(videoId)
  if (video) {
    let checkmark = video.parentElement.querySelector(".video-checkmark")
    if (!checkmark) {
      checkmark = document.createElement("span")
      checkmark.className = "video-checkmark watched"
      checkmark.setAttribute("aria-label", "Video watched")
      video.parentElement.appendChild(checkmark)
    } else {
      checkmark.classList.add("watched")
    }
  }
}

// Función para resetear el progreso de videos (para desarrollo/testing)
function resetVideoProgress() {
  const videoIds = ["w01v00", "w01v01", "w01v02", "w01v03", "w01v04", "w01v05"]
  videoIds.forEach((id) => {
    localStorage.removeItem(`video_watched_${id}`)
  })

  document.querySelectorAll(".video-checkmark").forEach((checkmark) => {
    checkmark.classList.remove("watched")
  })

  console.log("Video progress reset")
}
