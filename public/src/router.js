// src/router.js
import Home from "./pages/home.js"
import VideoPlayer from "./pages/videoPlayer.js"
import Config from "./pages/config.js"
import FolderView from "./pages/folderView.js" // Criamos esse componente

const routes = {
  "/": Home,
  "/video": VideoPlayer,
  "/config": Config
}

function Router() {
  const app = document.getElementById("app")
  app.innerHTML = "" // Limpa a tela

  let path = window.location.pathname

  // ⚠️ Impede loop de /folder/folder
  if (path === "/folder/folder" || path === "/folder") {
    console.warn("Corrigindo caminho:", path)
    navigateTo("/")
    return
  }

  if (path.startsWith("/folder")) {
    app.appendChild(FolderView()) // Renderiza a tela de pastas
  } else {
    const page = routes[path] || Home
    app.appendChild(page())
  }
}
// Muda a tela sem recarregar a página
function navigateTo(path) {
  window.history.pushState({}, "", path)
  Router()
}

// Roda o Router quando mudar o histórico (voltar/avançar)
window.addEventListener("popstate", Router)

export { Router, navigateTo }
