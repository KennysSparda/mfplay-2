import { navigateTo } from "../router.js"
import Button from "./button.js"

export default function MovieCard(movie) {
  const movieCard = document.createElement("div")
  movieCard.className = "movie-card"

  const cover = document.createElement("img")
  cover.src = movie.cover || movie.path.replace(".mkv", ".jpg") // Se não tiver, tenta substituir
  cover.alt = movie.title
  cover.className = "movie-cover"
  

  const movieTitle = document.createElement("p")
  movieTitle.textContent = movie.title
  movieTitle.className = "movie-title"

  const watchButton = Button("▶ Assistir", () => navigateTo(`/video?src=${movie.path}`), "movie-button")

  movieCard.append(cover, movieTitle, watchButton)

  return movieCard
}
