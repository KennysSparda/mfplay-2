// src/components/hud.js
import Button from "./button.js";
import Progress from "./progress.js";


export default function HUD(video, onClose) {
  const controls = document.createElement("div");
  controls.classList.add("video-controls");

  // Botão Play/Pause
  const playPauseButton = Button(
    "▶",
    () => {
      if (video.paused) {
        video.play();
        playPauseButton.textContent = "⏸";
      } else {
        video.pause();
        playPauseButton.textContent = "▶";
      }
    },
    "video-btn play"
  );

  // Barra de progresso
  const progressBar = Progress(
    0,
    100,
    (value) => {
      video.currentTime = (value / 100) * video.duration;
    },
    "video-progress"
  );

  let isSeeking = false;
  progressBar.addEventListener("mousedown", () => (isSeeking = true));
  progressBar.addEventListener("mouseup", () => (isSeeking = false));

  video.addEventListener("timeupdate", () => {
    if (!isSeeking) {
      progressBar.value = (video.currentTime / video.duration) * 100 || 0;
    }
  });

  // Controle de volume
  const volumeControl = Progress(
    100,
    100,
    (value) => {
      video.volume = value / 100;
    },
    "video-volume"
  );

  // Botão de Mudo
  const volumeButton = Button(
    "🔊",
    () => {
      video.muted = !video.muted;
      volumeButton.textContent = video.muted ? "🔇" : "🔊";
    },
    "video-btn volume"
  );

  // Botão Fullscreen
  const fullscreenButton = Button(
    "⛶",
    () => {
      if (!document.fullscreenElement) {
        video.parentElement.requestFullscreen();
      } else {
        document.exitFullscreen();
      }
    },
    "video-btn fullscreen"
  );

  // Botão de Fechar
  const closeButton = Button(
    "✖",
    () => {
      video.pause();
      if (onClose) {
        onClose(); // Executa a função de callback para fechar
      }
    },
    "video-btn close"
  );

  // Função para mostrar/ocultar controles
  const showControls = () => {
    controls.classList.remove("hidden");
    controls.classList.add("visible");
  };

  const hideControls = () => {
    controls.classList.add("hidden");
    controls.classList.remove("visible");
  };

  let inactivityTimeout;
  const resetInactivityTimer = () => {
    showControls();
    clearTimeout(inactivityTimeout);
    inactivityTimeout = setTimeout(hideControls, 3000);
  };

  video.parentElement.addEventListener("mousemove", resetInactivityTimer);
  video.parentElement.addEventListener("touchstart", resetInactivityTimer);
  resetInactivityTimer();

  // Eventos de teclado
  document.addEventListener("keydown", (e) => {
    switch (e.key) {
      case " ":
        video.paused ? video.play() : video.pause();
        break;
      case "ArrowLeft":
        video.currentTime = Math.max(0, video.currentTime - 10);
        break;
      case "ArrowRight":
        video.currentTime = Math.min(video.duration, video.currentTime + 10);
        break;
      case "ArrowUp":
        video.volume = Math.min(1, video.volume + 0.1);
        break;
      case "ArrowDown":
        video.volume = Math.max(0, video.volume - 0.1);
        break;
      case "m":
        video.muted = !video.muted;
        break;
      case "f":
        if (!document.fullscreenElement) {
          video.parentElement.requestFullscreen();
        } else {
          document.exitFullscreen();
        }
        break;
      case "Escape":
        if (document.fullscreenElement) {
          document.exitFullscreen();
        }
        break;
    }
  });

  // Clique único: Play/Pause
  video.addEventListener("click", () => {
    video.paused ? video.play() : video.pause();
  });

  // Clique duplo: Fullscreen
  video.addEventListener("dblclick", () => {
    if (!document.fullscreenElement) {
      video.parentElement.requestFullscreen();
    } else {
      document.exitFullscreen();
    }
  });

  // Adiciona elementos à HUD
  controls.appendChild(playPauseButton);
  controls.appendChild(progressBar);
  controls.appendChild(volumeButton);
  controls.appendChild(volumeControl);
  controls.appendChild(fullscreenButton);
  controls.appendChild(closeButton);

  return controls;
}