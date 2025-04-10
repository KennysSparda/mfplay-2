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

  const videoComponent = Video(videoSrc, previousPath)

  page.append(videoComponent)
  return page
}