// src/pages/videoPlayer.js
import Video from "../components/video.js"
import Button from "../components/button.js"
import { navigateTo } from "../router.js"

export default function VideoPlayer() {
  const page = document.createElement("div")
  page.className = "video-page"

  const params = new URLSearchParams(window.location.search)
  const videoSrc = params.get("src")

  if (!videoSrc) {
    page.innerHTML = "<p>❌ Vídeo não encontrado</p>"
    return page
  }

  const backButton = Button("⬅ Voltar", () => navigateTo("/"), "video-back-button")

  // ✅ Agora o vídeo vai ser renderizado corretamente na tela
  const videoElement = Video(`http://26.64.225.16:3000${videoSrc}`)

  page.append(backButton, videoElement)
  return page
}
