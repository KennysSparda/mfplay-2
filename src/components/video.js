// src/components/video.js
export default function Video(url) {
  const video = document.createElement("video")
  video.src = url
  video.controls = true

  // Ajusta dinamicamente a altura baseado na largura
  function resizeVideo() {
    video.style.height = `${window.innerHeight * 0.9}px` // 90% da altura da tela
  }

  // Atualiza o tamanho ao carregar e ao redimensionar a tela
  window.addEventListener("resize", resizeVideo)
  resizeVideo()

  return video
}
