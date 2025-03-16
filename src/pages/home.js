// src/pages/home.js
import { navigateTo } from "../router.js"
import Button from "../components/button.js"

export default function Home() {
  const home = document.createElement("div")
  home.className = "home-container"

  const title = document.createElement("h1")
  title.textContent = "Bem-vindo ao MFPlay"
  title.className = "home-title"

  home.appendChild(title)

  fetch("http://localhost:3001/movies")
    .then(res => res.json())
    .then(movies => {
      const movieList = document.createElement("div")
      movieList.className = "movie-list"

      movies.forEach(movie => {
        const movieCard = document.createElement("div")
        movieCard.className = "movie-card"

        const cover = document.createElement("img")
        cover.src = movie.cover
        cover.alt = movie.title
        cover.className = "movie-cover"

        const movieTitle = document.createElement("p")
        movieTitle.textContent = movie.title
        movieTitle.className = "movie-title"

        const watchButton = Button("Assistir", () => navigateTo(`/video?src=${movie.path}`), "movie-button")

        movieCard.append(cover, movieTitle, watchButton)
        movieList.appendChild(movieCard)
      })

      home.appendChild(movieList)
    })
    .catch(err => {
      console.error("Erro ao carregar filmes:", err)
    })

  return home
}
