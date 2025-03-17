import Button from "./button.js";
import Progress from "./progress.js";

export default function Video(url) {
  const container = document.createElement("div");
  container.classList.add("video-container");

  const video = document.createElement("video");
  video.src = url;
  video.classList.add("video-player");
  video.setAttribute("playsinline", "");
  video.setAttribute("preload", "metadata");

  // Criando os controles
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

  // Barra de progresso (tempo do vídeo)
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
        container.requestFullscreen().then(() => {
          video.style.width = "100vw";
          video.style.height = "100vh";
        }).catch((err) => console.error(err));
      } else {
        document.exitFullscreen().then(() => {
          video.style.width = "";
          video.style.height = "";
        });
      }
    },
    "video-btn fullscreen"
  );

  // Botão de Fechar
  const closeButton = Button(
    "✖",
    () => {
      video.pause();
      container.remove();
    },
    "video-btn close"
  );

  // Função para mostrar os controles
  const showControls = () => {
    controls.classList.remove("hidden");
    controls.classList.add("visible");
  };

  // Função para ocultar os controles
  const hideControls = () => {
    controls.classList.add("hidden");
    controls.classList.remove("visible");
  };

  let inactivityTimeout;

  // Função para reiniciar o temporizador de inatividade
  const resetInactivityTimer = () => {
    showControls();
    clearTimeout(inactivityTimeout);
    inactivityTimeout = setTimeout(hideControls, 3000); // Oculta após 3 segundos de inatividade
  };

  // Adiciona eventos para monitorar a atividade do usuário
  container.addEventListener("mousemove", resetInactivityTimer);
  container.addEventListener("touchstart", resetInactivityTimer);

  // Inicializa o temporizador de inatividade
  resetInactivityTimer();
  

  // Seleção de Faixas de Áudio
  const audioTrackMenu = document.createElement("select");
  audioTrackMenu.classList.add("audio-track-menu");

  video.addEventListener("loadedmetadata", () => {
    const audioTracks = video.audioTracks;
    if (audioTracks && audioTracks.length > 1) {
      for (let i = 0; i < audioTracks.length; i++) {
        const option = document.createElement("option");
        option.value = i;
        option.textContent = audioTracks[i].label || `Faixa ${i + 1}`;
        audioTrackMenu.appendChild(option);
      }
      audioTrackMenu.addEventListener("change", (e) => {
        const selectedTrackIndex = parseInt(e.target.value, 10);
        for (let i = 0; i < audioTracks.length; i++) {
          audioTracks[i].enabled = i === selectedTrackIndex;
        }
      });
      controls.appendChild(audioTrackMenu);
    }
  });

  // Adiciona os botões ao controle
  controls.appendChild(playPauseButton);
  controls.appendChild(progressBar);
  controls.appendChild(volumeButton);
  controls.appendChild(volumeControl);
  controls.appendChild(fullscreenButton);
  controls.appendChild(closeButton);

  container.appendChild(video);
  container.appendChild(controls);
  document.body.appendChild(container);

  return container;
}
