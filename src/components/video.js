
import Button from "./button.js"
import Progress from "./progress.js"

export default function Video(url) {
  const container = document.createElement("div")
  container.classList.add("video-container")

  const video = document.createElement("video")
  video.src = url
  video.classList.add("video-player")
  video.setAttribute("playsinline", "")
  video.setAttribute("preload", "metadata")

  // Criando os controles
  const controls = document.createElement("div")
  controls.classList.add("video-controls")

  // Botão Play/Pause
  const playPauseButton = Button("▶", () => {
    if (video.paused) {
      video.play()
      playPauseButton.textContent = "⏸"
    } else {
      video.pause()
      playPauseButton.textContent = "▶"
    }
  }, "video-btn play")

  // Barra de progresso (tempo do vídeo)
  const progressBar = Progress(0, 100, (value) => {
    video.currentTime = (value / 100) * video.duration
  }, "video-progress")

  video.addEventListener("timeupdate", () => {
    progressBar.value = (video.currentTime / video.duration) * 100 || 0
  })

  // Controle de volume
  const volumeControl = Progress(100, 100, (value) => {
    video.volume = value / 100
  }, "video-volume")

  // Botão de Mudo
  const volumeButton = Button("🔊", () => {
    video.muted = !video.muted
    volumeButton.textContent = video.muted ? "🔇" : "🔊"
  }, "video-btn volume")

  // Botão Fullscreen
  const fullscreenButton = Button("⛶", () => {
    if (!document.fullscreenElement) {
      container.requestFullscreen().catch(err => console.error(err))
    } else {
      document.exitFullscreen()
    }
  }, "video-btn fullscreen")

  // Botão de Fechar
  const closeButton = Button("✖", () => {
    video.pause()
    container.remove()
  }, "video-btn close")

  // Adiciona os botões ao controle
  controls.appendChild(playPauseButton)
  controls.appendChild(progressBar)
  controls.appendChild(volumeButton)
  controls.appendChild(volumeControl)
  controls.appendChild(fullscreenButton)
  controls.appendChild(closeButton)

  container.appendChild(video)
  container.appendChild(controls)
  document.body.appendChild(container)

  return container
}
