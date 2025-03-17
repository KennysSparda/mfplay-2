import MovieCard from "./movieCard.js"

export default function MovieList(movies) {
  const movieList = document.createElement("div")
  movieList.className = "movie-list"

  movies.forEach(movie => {
    movieList.appendChild(MovieCard(movie))
  })

  return movieList
}
