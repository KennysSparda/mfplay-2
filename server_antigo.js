import { createServer } from "http";
import { readdir, stat, createReadStream } from "fs";
import { extname, join, basename } from "path";
import { URL } from "url";

const PORT = 3001;
const SERVER_HOST = "26.64.225.16";
const MOVIE_DIR = "D:\\Filmes, Desenhos e Séries";

class MovieService {
  static getMovies(dir, callback, files = []) {
    readdir(dir, (err, items) => {
      if (err) return callback(err, []);

      let pending = items.length;
      if (!pending) return callback(null, files);

      items.forEach(item => {
        const filePath = join(dir, item);
        
        stat(filePath, (err, stats) => {
          if (err) return callback(err, []);

          if (stats.isDirectory()) {
            MovieService.getMovies(filePath, (err, res) => {
              if (err) return callback(err, []);
              files.push(...res);
              if (!--pending) callback(null, files);
            });
          } else {
            if (extname(item) === ".mkv") {
              const relativePath = filePath.replace(MOVIE_DIR, "").replace(/\\/g, "/").replace(/\s/g, "%20");
              
              files.push({
                title: basename(item, ".mkv"),
                path: `file://${SERVER_HOST}/Filmes%20-%20Desenhos%20-%20S%C3%A9ries${relativePath}`,
                cover: `file://${SERVER_HOST}/Filmes%20-%20Desenhos%20-%20S%C3%A9ries${relativePath.replace(".mkv", ".jpg")}`
              });
            }
            if (!--pending) callback(null, files);
          }
        });
      });
    });
  }
}

class RequestHandler {
  static handleMoviesRequest(res) {
    MovieService.getMovies(MOVIE_DIR, (err, movies) => {
      if (err) {
        res.writeHead(500, { "Content-Type": "application/json" });
        return res.end(JSON.stringify({ error: "Erro ao ler diretório", details: err.message }));
      }
      res.writeHead(200, { "Content-Type": "application/json" });
      res.end(JSON.stringify(movies));
    });
  }

  static handleVideoRequest(req, res) {
    const url = new URL(req.url, `http://localhost:${PORT}`);
    const filePath = join(MOVIE_DIR, decodeURIComponent(url.pathname.replace("/mkv/", "")));
    
    stat(filePath, (err, stats) => {
      if (err || !stats.isFile()) {
        res.writeHead(404, { "Content-Type": "text/plain" });
        return res.end("Arquivo não encontrado");
      }
      res.writeHead(200, { "Content-Type": "video/x-matroska" });
      createReadStream(filePath).pipe(res);
    });
  }

  static handleCoverRequest(req, res) {
    const url = new URL(req.url, `http://localhost:${PORT}`);
    const decodedPath = decodeURIComponent(url.pathname.replace("/covers/", ""));
    const moviePath = join(MOVIE_DIR, decodedPath.replace(".jpg", ".mkv"));
    const imagePath = moviePath.replace(".mkv", ".jpg");
    
    stat(imagePath, (err, stats) => {
      if (err || !stats.isFile()) {
        res.writeHead(404, { "Content-Type": "text/plain" });
        return res.end("Imagem não encontrada");
      }
      res.writeHead(200, { "Content-Type": "image/jpeg" });
      createReadStream(imagePath).pipe(res);
    });
  }
}

const server = createServer((req, res) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    res.writeHead(204);
    return res.end();
  }

  if (req.url === "/movies") {
    return RequestHandler.handleMoviesRequest(res);
  } else if (req.url.startsWith("/mkv/")) {
    return RequestHandler.handleVideoRequest(req, res);
  } else if (req.url.startsWith("/covers/")) {
    return RequestHandler.handleCoverRequest(req, res);
  }

  res.writeHead(404, { "Content-Type": "text/plain" });
  res.end("Página não encontrada");
});

server.listen(PORT, () => {
  console.log(`🔥 Servidor rodando em http://localhost:${PORT}`);
});
