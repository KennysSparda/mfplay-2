import MovieCard from "./movieCard.js"

export default function MovieList(movies) {
  const movieList = document.createElement("div")
  movieList.className = "movie-list"
  console.log(movies.length)
  movies.forEach(movie => {
    movieList.appendChild(MovieCard(movie))
  })

  return movieList
}
