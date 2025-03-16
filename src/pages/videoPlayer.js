// src/pages/videoPlayer.js
import Video from "../components/video.js"
import Button from "../components/button.js"
import { navigateTo } from "../router.js"

export default function VideoPlayer() {
  const page = document.createElement("div")
  page.className = "video-page"

  const backButton = Button("Voltar", () => navigateTo("/"), "video-back-button")
  const video = Video("mkv/Naruto Classico/Naruto Classico 01.mkv")

  page.append(backButton, video)
  return page
}
