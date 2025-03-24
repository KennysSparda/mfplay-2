// src/pages/videoPlayer.js
import Video from "../components/video.js"
import { navigateTo } from "../router.js"

export default function VideoPlayer(previousPath) {
  const page = document.createElement("div")
  page.className = "video-page"

  const params = new URLSearchParams(window.location.search)
  const videoSrc = params.get("src")

  if (!videoSrc) {
    page.innerHTML = "<p>❌ Vídeo não encontrado</p>"
    return page
  }

  const videoElement = Video(`http://localhost:3000${videoSrc}`, previousPath)

  page.append(videoElement)
  return page
}