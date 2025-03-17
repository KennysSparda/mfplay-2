// src/pages/videoPlayer.js
import Video from "../components/video.js"
import Button from "../components/button.js"
import { navigateTo } from "../router.js"

export default function VideoPlayer() {
  const page = document.createElement("div")
  page.className = "video-page"

  // Pega o `src` da URL (ex: /video?src=http://localhost:3001/mkv/Naruto_01.mkv)
  const params = new URLSearchParams(window.location.search)
  const videoSrc = params.get("src")

  if (!videoSrc) {
    page.innerHTML = "<p>❌ Vídeo não encontrado</p>"
    return page
  }

  const backButton = Button("Voltar", () => navigateTo("/"), "video-back-button")
  const video = Video(videoSrc)

  page.append(backButton, video)
  return page
}
