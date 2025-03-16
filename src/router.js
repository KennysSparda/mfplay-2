// src/router.js
import Home from "./pages/home.js"
import VideoPlayer from "./pages/videoPlayer.js"
import Config from "./pages/config.js"

const routes = {
  "/": Home,
  "/video": VideoPlayer,
  "/config": Config
}

function Router() {
  const app = document.getElementById("app")
  app.innerHTML = "" // Limpa a tela

  const page = routes[window.location.pathname] || Home
  app.appendChild(page())
}

// Muda a tela sem recarregar a página
function navigateTo(path) {
  window.history.pushState({}, "", path)
  Router()
}

// Roda o Router quando mudar o histórico (voltar/avançar)
window.addEventListener("popstate", Router)

export { Router, navigateTo }
