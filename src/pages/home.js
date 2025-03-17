import MovieList from "../components/movieList.js"

export default function Home() {
  const home = document.createElement("div")
  home.className = "home-container"

  const title = document.createElement("h1")
  title.textContent = "🎬 Bem-vindo ao MFPlay"
  title.className = "home-title"

  home.appendChild(title)

  fetch("http://localhost:3001/movies")
    .then(res => res.json())
    .then(movies => {
      home.appendChild(MovieList(movies))
    })
    .catch(err => {
      console.error("Erro ao carregar filmes:", err)
    })

  return home
}
