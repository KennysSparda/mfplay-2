import { navigateTo } from "../router.js"
import Button from "./button.js"

export default function MovieCard(movie) {
  const movieCard = document.createElement("div")
  movieCard.className = "movie-card"

  const cover = document.createElement("img")
  cover.src = movie.cover || `/cover/${encodeURIComponent(movie.path.replace(/\.(mp4|mkv|avi|mov)$/i, ".jpg"))}`
  cover.alt = movie.name
  cover.className = "movie-cover"

  const movieTitle = document.createElement("p")
  movieTitle.textContent = movie.name
  movieTitle.className = "movie-title"

  // Se for uma pasta, clicar nela leva para dentro da pasta
  if (movie.type === "folder") {
    movieCard.addEventListener("click", () => {
      navigateTo(`/folder${movie.url}`)
    })
  }

  // Se for um vídeo, exibe o botão de assistir
  if (movie.type === "video") {
    const watchButton = Button("▶ Assistir", () => {
      navigateTo(`/video?src=${encodeURIComponent(movie.url)}`) // 🔥 Passando a URL correta para o player
    }, "movie-button")
    movieCard.append(watchButton)
  }
  

  movieCard.append(cover, movieTitle)
  
  return movieCard
}
