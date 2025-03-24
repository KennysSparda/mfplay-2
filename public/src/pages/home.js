import MovieList from "../components/movieList.js"
import HomeVideo from "../components/homevideo.js"

export default function Home() {
  const home = document.createElement("div")
  home.className = "home-container"

  

  const title = document.createElement("h1")
  title.textContent = "🎬 Bem-vindo ao MFPlay"
  title.className = "home-title"

  home.appendChild(title)
  HomeVideo(home)
  fetch("http://localhost:3000/api/videos")
  .then(res => res.json())
  .then(data => {
    console.log("Dados recebidos:", data) // Verifica no console
    if (Array.isArray(data.children)) {
      home.appendChild(MovieList(data.children)) // Usa 'children' que contém os arquivos
    } else {
      console.error("Formato de resposta inesperado", data)
    }
  })
  .catch(err => {
    console.error("Erro ao carregar filmes:", err)
  })


  return home
}

