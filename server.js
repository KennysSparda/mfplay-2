import { createServer } from "http"
import { readdir, stat, createReadStream } from "fs"
import { extname, join, basename } from "path"
import { URL } from "url"

const PORT = 3001
const MOVIE_DIR = "mkv"

const getMovies = (dir, callback, files = []) => {
  readdir(dir, (err, items) => {
    if (err) return callback(err, [])

    let pending = items.length
    if (!pending) return callback(null, files)

    items.forEach(item => {
      const filePath = join(dir, item)

      stat(filePath, (err, stats) => {
        if (err) return callback(err, [])

        if (stats.isDirectory()) {
          getMovies(filePath, (err, res) => {
            if (err) return callback(err, [])
            files.push(...res)
            if (!--pending) callback(null, files)
          })
        } else {
          if (extname(item) === ".mkv") {
            const relativePath = filePath.replace(MOVIE_DIR, "").replace(/\\/g, "/").replace(/^\//, "")
            
            files.push({
              title: basename(item, ".mkv"),
              path: `http://localhost:${PORT}/mkv/${encodeURIComponent(relativePath)}`,
              cover: `http://localhost:${PORT}/covers/${encodeURIComponent(relativePath.replace(".mkv", ".jpg"))}`
            })
          }
          
          if (!--pending) callback(null, files)
        }
      })
    })
  })
}

const server = createServer((req, res) => {
  const url = new URL(req.url, `http://localhost:${PORT}`)
  const filePath = join(MOVIE_DIR, decodeURIComponent(url.pathname.replace("/mkv/", "")))

  res.setHeader("Access-Control-Allow-Origin", "*")
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS")
  res.setHeader("Access-Control-Allow-Headers", "Content-Type")

  if (req.method === "OPTIONS") {
    res.writeHead(204)
    return res.end()
  }

  if (url.pathname === "/movies") {
    getMovies(MOVIE_DIR, (err, movies) => {
      if (err) {
        res.writeHead(500, { "Content-Type": "application/json" })
        return res.end(JSON.stringify({ error: "Erro ao ler diretório", details: err.message }))
      }

      res.writeHead(200, { "Content-Type": "application/json" })
      res.end(JSON.stringify(movies))
    })
  } 
  
  // Servindo vídeos da pasta /mkv/
  else if (url.pathname.startsWith("/mkv/")) {
    stat(filePath, (err, stats) => {
      if (err || !stats.isFile()) {
        res.writeHead(404, { "Content-Type": "text/plain" })
        return res.end("Arquivo não encontrado")
      }

      res.writeHead(200, { "Content-Type": "video/mp4" }) // Definir o tipo correto do vídeo
      createReadStream(filePath).pipe(res)
    })
  } 
  else if (url.pathname.startsWith("/covers/")) {
    const decodedPath = decodeURIComponent(url.pathname.replace("/covers/", ""))
    const moviePath = join(MOVIE_DIR, decodedPath.replace(".jpg", ".mkv"))
    const imagePath = moviePath.replace(".mkv", ".jpg")
  
    console.log("Buscando imagem em:", imagePath)
  
    stat(imagePath, (err, stats) => {
      if (err || !stats.isFile()) {
        res.writeHead(404, { "Content-Type": "text/plain" })
        return res.end("Imagem não encontrada")
      }
  
      res.writeHead(200, { "Content-Type": "image/jpeg" })
      createReadStream(imagePath).pipe(res)
    })
  }
  
  else {
    res.writeHead(404, { "Content-Type": "text/plain" })
    res.end("Página não encontrada")
  }
})

server.listen(PORT, () => {
  console.log(`🔥 Servidor rodando em http://localhost:${PORT}`)
})
