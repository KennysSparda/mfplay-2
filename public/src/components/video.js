// src/components/video.js
import HUD from "./hud.js";
import { navigateTo } from "../router.js"; // Importe a função de navegação


export default function Video(url, previousPath = "/") { // 👈 Adiciona parâmetro para lembrar de onde veio
  const container = document.createElement("div");
  container.classList.add("video-container");

  const video = document.createElement("video");
  video.src = url;
  video.setAttribute("preload", "auto");
  video.classList.add("video-player");
  video.setAttribute("playsinline", "");
  video.setAttribute("preload", "metadata");

  // Feedback visual de ações (play, pause, avançar, retroceder)
  const feedback = document.createElement("div");
  feedback.classList.add("video-feedback");
  container.appendChild(feedback);

  function showFeedback(icon) {
    feedback.textContent = icon;
    feedback.classList.add("show");
    setTimeout(() => {
      feedback.classList.remove("show");
    }, 500);
  }

  video.addEventListener("pause", () => showFeedback("⏸"));
  video.addEventListener("play", () => showFeedback("▶"));

  document.addEventListener("keydown", (e) => {
    if (e.key === "ArrowRight") showFeedback("⏩");
    if (e.key === "ArrowLeft") showFeedback("⏪");
  });

  container.appendChild(video);

  const hud = HUD(video, () => {
    navigateTo(previousPath);
  });

  container.appendChild(hud);
  document.body.appendChild(container);

  return container;
}
